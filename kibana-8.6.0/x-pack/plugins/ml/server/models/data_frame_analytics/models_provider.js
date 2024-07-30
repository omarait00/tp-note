"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modelsProvider = modelsProvider;
var _lodash = require("lodash");
var _guards = require("../../../common/types/guards");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const NODE_FIELDS = ['attributes', 'name', 'roles'];
function modelsProvider(client, mlClient) {
  return {
    /**
     * Retrieves the map of model ids and aliases with associated pipelines.
     * @param modelIds - Array of models ids and model aliases.
     */
    async getModelsPipelines(modelIds) {
      const modelIdsMap = new Map(modelIds.map(id => [id, null]));
      try {
        const body = await client.asCurrentUser.ingest.getPipeline();
        for (const [pipelineName, pipelineDefinition] of Object.entries(body)) {
          const {
            processors
          } = pipelineDefinition;
          for (const processor of processors) {
            var _processor$inference;
            const id = (_processor$inference = processor.inference) === null || _processor$inference === void 0 ? void 0 : _processor$inference.model_id;
            if (modelIdsMap.has(id)) {
              const obj = modelIdsMap.get(id);
              if (obj === null) {
                modelIdsMap.set(id, {
                  [pipelineName]: pipelineDefinition
                });
              } else {
                obj[pipelineName] = pipelineDefinition;
              }
            }
          }
        }
      } catch (error) {
        if (error.statusCode === 404) {
          // ES returns 404 when there are no pipelines
          // Instead, we should return the modelIdsMap and a 200
          return modelIdsMap;
        }
        throw error;
      }
      return modelIdsMap;
    },
    /**
     * Provides the ML nodes overview with allocated models.
     */
    async getNodesOverview() {
      // TODO set node_id to ml:true when elasticsearch client is updated.
      const response = await mlClient.getMemoryStats();
      const {
        trained_model_stats: trainedModelStats
      } = await mlClient.getTrainedModelsStats({
        size: 10000
      });
      const mlNodes = Object.entries(response.nodes).filter(([, node]) => node.roles.includes('ml'));
      const nodeDeploymentStatsResponses = mlNodes.map(([nodeId, node]) => {
        const nodeFields = (0, _lodash.pick)(node, NODE_FIELDS);
        nodeFields.attributes = nodeFields.attributes;
        const allocatedModels = trainedModelStats.filter(d => (0, _guards.isDefined)(d.deployment_stats) && (0, _guards.isDefined)(d.deployment_stats.nodes) && d.deployment_stats.nodes.some(n => Object.keys(n.node)[0] === nodeId)).map(d => {
          const modelSizeState = d.model_size_stats;
          const deploymentStats = d.deployment_stats;
          if (!deploymentStats || !modelSizeState) {
            throw new Error('deploymentStats or modelSizeState not defined');
          }
          const {
            nodes,
            ...rest
          } = deploymentStats;
          const {
            node: tempNode,
            ...nodeRest
          } = nodes.find(v => Object.keys(v.node)[0] === nodeId);
          return {
            model_id: d.model_id,
            ...rest,
            ...modelSizeState,
            node: nodeRest
          };
        });
        const modelsMemoryUsage = allocatedModels.map(v => {
          return {
            model_id: v.model_id,
            model_size: v.required_native_memory_bytes
          };
        });
        const memoryRes = {
          adTotalMemory: node.mem.ml.anomaly_detectors_in_bytes,
          dfaTotalMemory: node.mem.ml.data_frame_analytics_in_bytes,
          trainedModelsTotalMemory: node.mem.ml.native_inference_in_bytes
        };
        for (const key of Object.keys(memoryRes)) {
          if (memoryRes[key] > 0) {
            /**
             * The amount of memory needed to load the ML native code shared libraries. The assumption is that the first
             * ML job to run on a given node will do this, and then subsequent ML jobs on the same node will reuse the
             * same already-loaded code.
             */
            memoryRes[key] += node.mem.ml.native_code_overhead_in_bytes;
            break;
          }
        }
        return {
          id: nodeId,
          ...nodeFields,
          allocated_models: allocatedModels,
          memory_overview: {
            machine_memory: {
              total: node.mem.adjusted_total_in_bytes,
              jvm: node.jvm.heap_max_in_bytes
            },
            anomaly_detection: {
              total: memoryRes.adTotalMemory
            },
            dfa_training: {
              total: memoryRes.dfaTotalMemory
            },
            trained_models: {
              total: memoryRes.trainedModelsTotalMemory,
              by_model: modelsMemoryUsage
            },
            ml_max_in_bytes: node.mem.ml.max_in_bytes
          }
        };
      });
      return {
        // TODO preserve _nodes from the response when getMemoryStats method is updated to support ml:true filter
        _nodes: {
          ...response._nodes,
          total: mlNodes.length,
          successful: mlNodes.length
        },
        nodes: nodeDeploymentStatsResponses
      };
    }
  };
}