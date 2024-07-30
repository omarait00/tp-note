"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTelemetryEndpointTaskConfig = createTelemetryEndpointTaskConfig;
var _common = require("../../../../../fleet/common");
var _helpers = require("../helpers");
var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// Endpoint agent uses this Policy ID while it's installing.
const DefaultEndpointPolicyIdToIgnore = '00000000-0000-0000-0000-000000000000';
const EmptyFleetAgentResponse = {
  agents: [],
  total: 0,
  page: 0,
  perPage: 0
};
const usageLabelPrefix = ['security_telemetry', 'endpoint_task'];
function createTelemetryEndpointTaskConfig(maxTelemetryBatch) {
  return {
    type: 'security:endpoint-meta-telemetry',
    title: 'Security Solution Telemetry Endpoint Metrics and Info task',
    interval: '24h',
    timeout: '5m',
    version: '1.0.0',
    getLastExecutionTime: _helpers.getPreviousDailyTaskTimestamp,
    runTask: async (taskId, logger, receiver, sender, taskExecutionPeriod) => {
      const startTime = Date.now();
      const taskName = 'Security Solution Telemetry Endpoint Metrics and Info task';
      try {
        if (!taskExecutionPeriod.last) {
          throw new Error('last execution timestamp is required');
        }
        const [clusterInfoPromise, licenseInfoPromise] = await Promise.allSettled([receiver.fetchClusterInfo(), receiver.fetchLicenseInfo()]);
        const clusterInfo = clusterInfoPromise.status === 'fulfilled' ? clusterInfoPromise.value : {};
        const licenseInfo = licenseInfoPromise.status === 'fulfilled' ? licenseInfoPromise.value : {};
        const endpointData = await fetchEndpointData(receiver, taskExecutionPeriod.last, taskExecutionPeriod.current);

        /** STAGE 1 - Fetch Endpoint Agent Metrics
         *
         * Reads Endpoint Agent metrics out of the `.ds-metrics-endpoint.metrics` data stream
         * and buckets them by Endpoint Agent id and sorts by the top hit. The EP agent will
         * report its metrics once per day OR every time a policy change has occured. If
         * a metric document(s) exists for an EP agent we map to fleet agent and policy
         */
        if (endpointData.endpointMetrics === undefined) {
          (0, _helpers.tlog)(logger, `no endpoint metrics to report`);
          await sender.sendOnDemand(_constants.TASK_METRICS_CHANNEL, [(0, _helpers.createTaskMetric)(taskName, true, startTime)]);
          return 0;
        }
        const {
          body: endpointMetricsResponse
        } = endpointData.endpointMetrics;
        if (endpointMetricsResponse.aggregations === undefined) {
          (0, _helpers.tlog)(logger, `no endpoint metrics to report`);
          await sender.sendOnDemand(_constants.TASK_METRICS_CHANNEL, [(0, _helpers.createTaskMetric)(taskName, true, startTime)]);
          return 0;
        }
        const telemetryUsageCounter = sender.getTelemetryUsageCluster();
        telemetryUsageCounter === null || telemetryUsageCounter === void 0 ? void 0 : telemetryUsageCounter.incrementCounter({
          counterName: (0, _helpers.createUsageCounterLabel)(usageLabelPrefix.concat(['payloads', _constants.TELEMETRY_CHANNEL_ENDPOINT_META])),
          counterType: 'num_endpoint',
          incrementBy: endpointMetricsResponse.aggregations.endpoint_count.value
        });
        const endpointMetrics = endpointMetricsResponse.aggregations.endpoint_agents.buckets.map(epMetrics => {
          return {
            endpoint_agent: epMetrics.latest_metrics.hits.hits[0]._source.agent.id,
            endpoint_version: epMetrics.latest_metrics.hits.hits[0]._source.agent.version,
            endpoint_metrics: epMetrics.latest_metrics.hits.hits[0]._source
          };
        });

        /** STAGE 2 - Fetch Fleet Agent Config
         *
         * As the policy id + policy version does not exist on the Endpoint Metrics document
         * we need to fetch information about the Fleet Agent and sync the metrics document
         * with the Agent's policy data.
         *
         */
        const agentsResponse = endpointData.fleetAgentsResponse;
        if (agentsResponse === undefined) {
          (0, _helpers.tlog)(logger, 'no fleet agent information available');
          await sender.sendOnDemand(_constants.TASK_METRICS_CHANNEL, [(0, _helpers.createTaskMetric)(taskName, true, startTime)]);
          return 0;
        }
        const fleetAgents = agentsResponse.agents.reduce((cache, agent) => {
          if (agent.id === DefaultEndpointPolicyIdToIgnore) {
            return cache;
          }
          if (agent.policy_id !== null && agent.policy_id !== undefined) {
            cache.set(agent.id, agent.policy_id);
          }
          return cache;
        }, new Map());
        const endpointPolicyCache = new Map();
        for (const policyInfo of fleetAgents.values()) {
          if (policyInfo !== null && policyInfo !== undefined && !endpointPolicyCache.has(policyInfo)) {
            (0, _helpers.tlog)(logger, `policy info exists as ${policyInfo}`);
            const agentPolicy = await receiver.fetchPolicyConfigs(policyInfo);
            const packagePolicies = agentPolicy === null || agentPolicy === void 0 ? void 0 : agentPolicy.package_policies;
            if (packagePolicies !== undefined && (0, _helpers.isPackagePolicyList)(packagePolicies)) {
              (0, _helpers.tlog)(logger, `package policy exists as ${JSON.stringify(packagePolicies)}`);
              packagePolicies.map(pPolicy => pPolicy).forEach(pPolicy => {
                var _pPolicy$inputs$, _pPolicy$inputs$2;
                if (((_pPolicy$inputs$ = pPolicy.inputs[0]) === null || _pPolicy$inputs$ === void 0 ? void 0 : _pPolicy$inputs$.config) !== undefined && ((_pPolicy$inputs$2 = pPolicy.inputs[0]) === null || _pPolicy$inputs$2 === void 0 ? void 0 : _pPolicy$inputs$2.config) !== null) {
                  pPolicy.inputs.forEach(input => {
                    if (input.type === _common.FLEET_ENDPOINT_PACKAGE && (input === null || input === void 0 ? void 0 : input.config) !== undefined && policyInfo !== undefined) {
                      endpointPolicyCache.set(policyInfo, pPolicy);
                    }
                  });
                }
              });
            }
          }
        }

        /** STAGE 3 - Fetch Endpoint Policy Responses
         *
         * Reads Endpoint Agent policy responses out of the `.ds-metrics-endpoint.policy*` data
         * stream and creates a local K/V structure that stores the policy response (V) with
         * the Endpoint Agent Id (K). A value will only exist if there has been a endpoint
         * enrolled in the last 24 hours OR a policy change has occurred. We only send
         * non-successful responses. If the field is null, we assume no responses in
         * the last 24h or no failures/warnings in the policy applied.
         *
         */
        const {
          body: failedPolicyResponses
        } = endpointData.epPolicyResponse;

        // If there is no policy responses in the 24h > now then we will continue
        const policyResponses = failedPolicyResponses.aggregations ? failedPolicyResponses.aggregations.policy_responses.buckets.reduce((cache, endpointAgentId) => {
          const doc = endpointAgentId.latest_response.hits.hits[0];
          cache.set(endpointAgentId.key, doc);
          return cache;
        }, new Map()) : new Map();
        (0, _helpers.tlog)(logger, `policy responses exists as ${JSON.stringify(Object.fromEntries(policyResponses))}`);

        /** STAGE 4 - Fetch Endpoint Agent Metadata
         *
         * Reads Endpoint Agent metadata out of the `.ds-metrics-endpoint.metadata` data stream
         * and buckets them by Endpoint Agent id and sorts by the top hit. The EP agent will
         * report its metadata once per day OR every time a policy change has occured. If
         * a metadata document(s) exists for an EP agent we map to fleet agent and policy
         */
        if (endpointData.endpointMetadata === undefined) {
          (0, _helpers.tlog)(logger, `no endpoint metadata to report`);
        }
        const {
          body: endpointMetadataResponse
        } = endpointData.endpointMetadata;
        if (endpointMetadataResponse.aggregations === undefined) {
          (0, _helpers.tlog)(logger, `no endpoint metadata to report`);
        }
        const endpointMetadata = endpointMetadataResponse.aggregations.endpoint_metadata.buckets.reduce((cache, endpointAgentId) => {
          const doc = endpointAgentId.latest_metadata.hits.hits[0];
          cache.set(endpointAgentId.key, doc);
          return cache;
        }, new Map());
        (0, _helpers.tlog)(logger, `endpoint metadata exists as ${JSON.stringify(Object.fromEntries(endpointMetadata))}`);
        /** STAGE 5 - Create the telemetry log records
         *
         * Iterates through the endpoint metrics documents at STAGE 1 and joins them together
         * to form the telemetry log that is sent back to Elastic Security developers to
         * make improvements to the product.
         *
         */
        try {
          const telemetryPayloads = endpointMetrics.map(endpoint => {
            var _policyConfig, _policyConfig$package;
            let policyConfig = null;
            let failedPolicy = null;
            let endpointMetadataById = null;
            const fleetAgentId = endpoint.endpoint_metrics.elastic.agent.id;
            const endpointAgentId = endpoint.endpoint_agent;
            const policyInformation = fleetAgents.get(fleetAgentId);
            if (policyInformation) {
              policyConfig = endpointPolicyCache.get(policyInformation) || null;
              if (policyConfig) {
                failedPolicy = policyResponses.get(endpointAgentId);
              }
            }
            if (endpointMetadata) {
              endpointMetadataById = endpointMetadata.get(endpointAgentId);
            }
            const {
              cpu,
              memory,
              uptime,
              documents_volume: documentsVolume,
              malicious_behavior_rules: maliciousBehaviorRules,
              system_impact: systemImpact,
              threads,
              event_filter: eventFilter
            } = endpoint.endpoint_metrics.Endpoint.metrics;
            const endpointPolicyDetail = (0, _helpers.extractEndpointPolicyConfig)(policyConfig);
            if (endpointPolicyDetail) {
              endpointPolicyDetail.value = (0, _helpers.addDefaultAdvancedPolicyConfigSettings)(endpointPolicyDetail.value);
            }
            return {
              '@timestamp': taskExecutionPeriod.current,
              cluster_uuid: clusterInfo.cluster_uuid,
              cluster_name: clusterInfo.cluster_name,
              license_id: licenseInfo === null || licenseInfo === void 0 ? void 0 : licenseInfo.uid,
              endpoint_id: endpointAgentId,
              endpoint_version: endpoint.endpoint_version,
              endpoint_package_version: ((_policyConfig = policyConfig) === null || _policyConfig === void 0 ? void 0 : (_policyConfig$package = _policyConfig.package) === null || _policyConfig$package === void 0 ? void 0 : _policyConfig$package.version) || null,
              endpoint_metrics: {
                cpu: cpu.endpoint,
                memory: memory.endpoint.private,
                uptime,
                documentsVolume,
                maliciousBehaviorRules,
                systemImpact,
                threads,
                eventFilter
              },
              endpoint_meta: {
                os: endpoint.endpoint_metrics.host.os,
                capabilities: endpointMetadataById !== null && endpointMetadataById !== undefined ? endpointMetadataById._source.Endpoint.capabilities : []
              },
              policy_config: endpointPolicyDetail !== null ? endpointPolicyDetail : {},
              policy_response: failedPolicy !== null && failedPolicy !== undefined ? {
                agent_policy_status: failedPolicy._source.event.agent_id_status,
                manifest_version: failedPolicy._source.Endpoint.policy.applied.artifacts.global.version,
                status: failedPolicy._source.Endpoint.policy.applied.status,
                actions: failedPolicy._source.Endpoint.policy.applied.actions.map(action => action.status !== 'success' ? action : null).filter(action => action !== null),
                configuration: failedPolicy._source.Endpoint.configuration,
                state: failedPolicy._source.Endpoint.state
              } : {},
              telemetry_meta: {
                metrics_timestamp: endpoint.endpoint_metrics['@timestamp']
              }
            };
          });

          /**
           * STAGE 6 - Send the documents
           *
           * Send the documents in a batches of maxTelemetryBatch
           */
          const batches = (0, _helpers.batchTelemetryRecords)(telemetryPayloads, maxTelemetryBatch);
          for (const batch of batches) {
            await sender.sendOnDemand(_constants.TELEMETRY_CHANNEL_ENDPOINT_META, batch);
          }
          await sender.sendOnDemand(_constants.TASK_METRICS_CHANNEL, [(0, _helpers.createTaskMetric)(taskName, true, startTime)]);
          return telemetryPayloads.length;
        } catch (err) {
          logger.warn(`could not complete endpoint alert telemetry task due to ${err === null || err === void 0 ? void 0 : err.message}`);
          await sender.sendOnDemand(_constants.TASK_METRICS_CHANNEL, [(0, _helpers.createTaskMetric)(taskName, false, startTime, err.message)]);
          return 0;
        }
      } catch (err) {
        await sender.sendOnDemand(_constants.TASK_METRICS_CHANNEL, [(0, _helpers.createTaskMetric)(taskName, false, startTime, err.message)]);
        return 0;
      }
    }
  };
}
async function fetchEndpointData(receiver, executeFrom, executeTo) {
  const [fleetAgentsResponse, epMetricsResponse, policyResponse, endpointMetadata] = await Promise.allSettled([receiver.fetchFleetAgents(), receiver.fetchEndpointMetrics(executeFrom, executeTo), receiver.fetchEndpointPolicyResponses(executeFrom, executeTo), receiver.fetchEndpointMetadata(executeFrom, executeTo)]);
  return {
    fleetAgentsResponse: fleetAgentsResponse.status === 'fulfilled' ? fleetAgentsResponse.value : EmptyFleetAgentResponse,
    endpointMetrics: epMetricsResponse.status === 'fulfilled' ? epMetricsResponse.value : undefined,
    epPolicyResponse: policyResponse.status === 'fulfilled' ? policyResponse.value : undefined,
    endpointMetadata: endpointMetadata.status === 'fulfilled' ? endpointMetadata.value : undefined
  };
}