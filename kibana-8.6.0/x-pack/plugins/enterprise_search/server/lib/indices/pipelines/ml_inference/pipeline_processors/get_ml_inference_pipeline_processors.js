"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProcessorPipelineMap = exports.getMlModelConfigsForModelIds = exports.getMlInferencePipelineProcessorNamesFromPipelines = exports.fetchPipelineProcessorInferenceData = exports.fetchMlInferencePipelines = exports.fetchMlInferencePipelineProcessors = exports.fetchAndAddTrainedModelData = void 0;
var _ml_inference_pipeline = require("../../../../../../common/ml_inference_pipeline");
var _pipelines = require("../../../../../../common/types/pipelines");
var _ml_inference_pipeline_utils = require("../../../../../utils/ml_inference_pipeline_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const fetchMlInferencePipelines = async client => {
  try {
    return await client.ingest.getPipeline({
      id: (0, _ml_inference_pipeline_utils.getInferencePipelineNameFromIndexName)('*')
    });
  } catch (error) {
    // The GET /_ingest/pipeline API returns an empty object on 404 Not Found. If there are no `@ml-inference`
    // pipelines then return an empty record of pipelines
    return {};
  }
};
exports.fetchMlInferencePipelines = fetchMlInferencePipelines;
const getMlInferencePipelineProcessorNamesFromPipelines = (indexName, pipelines) => {
  var _pipelines$mlInferenc;
  const mlInferencePipelineName = (0, _ml_inference_pipeline_utils.getInferencePipelineNameFromIndexName)(indexName);
  if ((pipelines === null || pipelines === void 0 ? void 0 : (_pipelines$mlInferenc = pipelines[mlInferencePipelineName]) === null || _pipelines$mlInferenc === void 0 ? void 0 : _pipelines$mlInferenc.processors) === undefined) {
    return [];
  }
  const {
    [mlInferencePipelineName]: {
      processors: mlInferencePipelineProcessors = []
    }
  } = pipelines;
  return mlInferencePipelineProcessors.map(obj => {
    var _obj$pipeline;
    return (_obj$pipeline = obj.pipeline) === null || _obj$pipeline === void 0 ? void 0 : _obj$pipeline.name;
  }).filter(name => name !== undefined);
};
exports.getMlInferencePipelineProcessorNamesFromPipelines = getMlInferencePipelineProcessorNamesFromPipelines;
const getProcessorPipelineMap = pipelines => {
  const result = {};
  const addPipelineToProcessorMap = (processorName, pipelineName) => {
    if (processorName in result) {
      result[processorName].push(pipelineName);
    } else {
      result[processorName] = [pipelineName];
    }
  };
  Object.entries(pipelines).forEach(([name, pipeline]) => {
    var _pipeline$processors;
    return pipeline === null || pipeline === void 0 ? void 0 : (_pipeline$processors = pipeline.processors) === null || _pipeline$processors === void 0 ? void 0 : _pipeline$processors.forEach(processor => {
      var _processor$pipeline;
      if (((_processor$pipeline = processor.pipeline) === null || _processor$pipeline === void 0 ? void 0 : _processor$pipeline.name) !== undefined) {
        addPipelineToProcessorMap(processor.pipeline.name, name);
      }
    });
  });
  return result;
};
exports.getProcessorPipelineMap = getProcessorPipelineMap;
const fetchPipelineProcessorInferenceData = async (client, mlInferencePipelineProcessorNames, pipelineProcessorsMap) => {
  const mlInferencePipelineProcessorConfigs = await client.ingest.getPipeline({
    id: mlInferencePipelineProcessorNames.join()
  });
  return Object.keys(mlInferencePipelineProcessorConfigs).reduce((pipelineProcessorData, pipelineProcessorName) => {
    var _inferenceProcessor$i, _pipelineProcessorsMa;
    // Get the processors for the current pipeline processor of the ML Inference Processor.
    const subProcessors = mlInferencePipelineProcessorConfigs[pipelineProcessorName].processors || [];

    // Find the inference processor, which we can assume there will only be one.
    const inferenceProcessor = subProcessors.find(obj => obj.hasOwnProperty('inference'));
    const trainedModelName = inferenceProcessor === null || inferenceProcessor === void 0 ? void 0 : (_inferenceProcessor$i = inferenceProcessor.inference) === null || _inferenceProcessor$i === void 0 ? void 0 : _inferenceProcessor$i.model_id;
    if (trainedModelName) pipelineProcessorData.push({
      modelId: trainedModelName,
      modelState: _pipelines.TrainedModelState.NotDeployed,
      pipelineName: pipelineProcessorName,
      pipelineReferences: (_pipelineProcessorsMa = pipelineProcessorsMap === null || pipelineProcessorsMap === void 0 ? void 0 : pipelineProcessorsMap[pipelineProcessorName]) !== null && _pipelineProcessorsMa !== void 0 ? _pipelineProcessorsMa : [],
      trainedModelName,
      types: []
    });
    return pipelineProcessorData;
  }, []);
};
exports.fetchPipelineProcessorInferenceData = fetchPipelineProcessorInferenceData;
const getMlModelConfigsForModelIds = async (client, trainedModelsProvider, trainedModelNames) => {
  const [trainedModels, trainedModelsStats, trainedModelsInCurrentSpace] = await Promise.all([client.ml.getTrainedModels({
    model_id: trainedModelNames.join()
  }), client.ml.getTrainedModelsStats({
    model_id: trainedModelNames.join()
  }), trainedModelsProvider.getTrainedModels({}) // Get all models from current space; note we can't
  // use exact model name matching, that returns an
  // error for models that cannot be found
  ]);

  const modelNamesInCurrentSpace = trainedModelsInCurrentSpace.trained_model_configs.map(modelConfig => modelConfig.model_id);
  const modelConfigs = {};
  trainedModels.trained_model_configs.forEach(trainedModelData => {
    const trainedModelName = trainedModelData.model_id;
    if (trainedModelNames.includes(trainedModelName)) {
      modelConfigs[trainedModelName] = {
        modelId: modelNamesInCurrentSpace.includes(trainedModelName) ? trainedModelName : undefined,
        modelState: _pipelines.TrainedModelState.NotDeployed,
        pipelineName: '',
        pipelineReferences: [],
        trainedModelName,
        types: (0, _ml_inference_pipeline.getMlModelTypesForModelConfig)(trainedModelData)
      };
    }
  });
  trainedModelsStats.trained_model_stats.forEach(trainedModelStats => {
    const trainedModelName = trainedModelStats.model_id;
    if (modelConfigs.hasOwnProperty(trainedModelName)) {
      modelConfigs[trainedModelName].modelState = (0, _ml_inference_pipeline.parseModelStateFromStats)(trainedModelStats);
      modelConfigs[trainedModelName].modelStateReason = (0, _ml_inference_pipeline.parseModelStateReasonFromStats)(trainedModelStats);
    }
  });
  return modelConfigs;
};
exports.getMlModelConfigsForModelIds = getMlModelConfigsForModelIds;
const fetchAndAddTrainedModelData = async (client, trainedModelsProvider, pipelineProcessorData) => {
  const trainedModelNames = Array.from(new Set(pipelineProcessorData.map(pipeline => pipeline.trainedModelName)));
  const modelConfigs = await getMlModelConfigsForModelIds(client, trainedModelsProvider, trainedModelNames);
  return pipelineProcessorData.map(data => {
    const model = modelConfigs[data.trainedModelName];
    if (!model) {
      return data;
    }
    const {
      modelId,
      types,
      modelState,
      modelStateReason
    } = model;
    return {
      ...data,
      modelId,
      modelState,
      modelStateReason,
      types
    };
  });
};
exports.fetchAndAddTrainedModelData = fetchAndAddTrainedModelData;
const fetchMlInferencePipelineProcessors = async (client, trainedModelsProvider, indexName) => {
  if (!trainedModelsProvider) {
    throw new Error('Machine Learning is not enabled');
  }
  const allMlPipelines = await fetchMlInferencePipelines(client);
  const pipelineProcessorsPipelineCountMap = getProcessorPipelineMap(allMlPipelines);
  const mlInferencePipelineProcessorNames = getMlInferencePipelineProcessorNamesFromPipelines(indexName, allMlPipelines);

  // Elasticsearch's GET pipelines API call will return all of the pipeline data if no ids are
  // provided. If we didn't find pipeline processors, return early to avoid fetching all of
  // the possible pipeline data.
  if (mlInferencePipelineProcessorNames.length === 0) return [];
  const pipelineProcessorInferenceData = await fetchPipelineProcessorInferenceData(client, mlInferencePipelineProcessorNames, pipelineProcessorsPipelineCountMap);

  // Elasticsearch's GET trained models and GET trained model stats API calls will return the
  // data/stats for all of the trained models if no ids are provided. If we didn't find any
  // inference processors, return early to avoid fetching all of the possible trained model data.
  if (pipelineProcessorInferenceData.length === 0) return [];
  const pipelines = await fetchAndAddTrainedModelData(client, trainedModelsProvider, pipelineProcessorInferenceData);

  // Due to restrictions with Kibana spaces we do not want to return the trained model name
  // to the UI. So we remove it from the data structure here.
  return pipelines.map(({
    trainedModelName,
    ...pipeline
  }) => pipeline);
};
exports.fetchMlInferencePipelineProcessors = fetchMlInferencePipelineProcessors;