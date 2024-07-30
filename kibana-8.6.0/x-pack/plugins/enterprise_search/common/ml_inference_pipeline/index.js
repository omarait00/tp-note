"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseModelStateReasonFromStats = exports.parseModelStateFromStats = exports.parseMlInferenceParametersFromPipeline = exports.getSetProcessorForInferenceType = exports.getRemoveProcessorForInferenceType = exports.getMlModelTypesForModelConfig = exports.generateMlInferencePipelineBody = exports.formatPipelineName = exports.SUPPORTED_PYTORCH_TASKS = exports.BUILT_IN_MODEL_TAG = void 0;
var _pipelines = require("../types/pipelines");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// Getting an error importing this from @kbn/ml-plugin/common/constants/data_frame_analytics'
// So defining it locally for now with a test to make sure it matches.
const BUILT_IN_MODEL_TAG = 'prepackaged';

// Getting an error importing this from @kbn/ml-plugin/common/constants/trained_models'
// So defining it locally for now with a test to make sure it matches.
exports.BUILT_IN_MODEL_TAG = BUILT_IN_MODEL_TAG;
const SUPPORTED_PYTORCH_TASKS = {
  FILL_MASK: 'fill_mask',
  NER: 'ner',
  QUESTION_ANSWERING: 'question_answering',
  TEXT_CLASSIFICATION: 'text_classification',
  TEXT_EMBEDDING: 'text_embedding',
  ZERO_SHOT_CLASSIFICATION: 'zero_shot_classification'
};
exports.SUPPORTED_PYTORCH_TASKS = SUPPORTED_PYTORCH_TASKS;
/**
 * Generates the pipeline body for a machine learning inference pipeline
 * @param pipelineConfiguration machine learning inference pipeline configuration parameters
 * @returns pipeline body
 */
const generateMlInferencePipelineBody = ({
  description,
  destinationField,
  model,
  pipelineName,
  sourceField
}) => {
  var _model$input, _model$input$field_na;
  // if model returned no input field, insert a placeholder
  const modelInputField = ((_model$input = model.input) === null || _model$input === void 0 ? void 0 : (_model$input$field_na = _model$input.field_names) === null || _model$input$field_na === void 0 ? void 0 : _model$input$field_na.length) > 0 ? model.input.field_names[0] : 'MODEL_INPUT_FIELD';
  const inferenceType = Object.keys(model.inference_config)[0];
  const remove = getRemoveProcessorForInferenceType(destinationField, inferenceType);
  const set = getSetProcessorForInferenceType(destinationField, inferenceType);
  return {
    description: description !== null && description !== void 0 ? description : '',
    processors: [{
      remove: {
        field: `ml.inference.${destinationField}`,
        ignore_missing: true
      }
    }, ...(remove ? [{
      remove
    }] : []), {
      inference: {
        field_map: {
          [sourceField]: modelInputField
        },
        model_id: model.model_id,
        on_failure: [{
          append: {
            field: '_source._ingest.inference_errors',
            value: [{
              message: `Processor 'inference' in pipeline '${pipelineName}' failed with message '{{ _ingest.on_failure_message }}'`,
              pipeline: pipelineName,
              timestamp: '{{{ _ingest.timestamp }}}'
            }]
          }
        }],
        target_field: `ml.inference.${destinationField}`
      }
    }, {
      append: {
        field: '_source._ingest.processors',
        value: [{
          model_version: model.version,
          pipeline: pipelineName,
          processed_timestamp: '{{{ _ingest.timestamp }}}',
          types: getMlModelTypesForModelConfig(model)
        }]
      }
    }, ...(set ? [{
      set
    }] : [])],
    version: 1
  };
};
exports.generateMlInferencePipelineBody = generateMlInferencePipelineBody;
const getSetProcessorForInferenceType = (destinationField, inferenceType) => {
  let set;
  const prefixedDestinationField = `ml.inference.${destinationField}`;
  if (inferenceType === SUPPORTED_PYTORCH_TASKS.TEXT_CLASSIFICATION) {
    set = {
      copy_from: `${prefixedDestinationField}.predicted_value`,
      description: `Copy the predicted_value to '${destinationField}' if the prediction_probability is greater than 0.5`,
      field: destinationField,
      if: `ctx?.ml?.inference != null && ctx.ml.inference['${destinationField}'] != null && ctx.ml.inference['${destinationField}'].prediction_probability > 0.5`,
      value: undefined
    };
  } else if (inferenceType === SUPPORTED_PYTORCH_TASKS.TEXT_EMBEDDING) {
    set = {
      copy_from: `${prefixedDestinationField}.predicted_value`,
      description: `Copy the predicted_value to '${destinationField}'`,
      field: destinationField,
      if: `ctx?.ml?.inference != null && ctx.ml.inference['${destinationField}'] != null`,
      value: undefined
    };
  }
  return set;
};
exports.getSetProcessorForInferenceType = getSetProcessorForInferenceType;
const getRemoveProcessorForInferenceType = (destinationField, inferenceType) => {
  if (inferenceType === SUPPORTED_PYTORCH_TASKS.TEXT_CLASSIFICATION || inferenceType === SUPPORTED_PYTORCH_TASKS.TEXT_EMBEDDING) {
    return {
      field: destinationField,
      ignore_missing: true
    };
  }
};

/**
 * Parses model types list from the given configuration of a trained machine learning model
 * @param trainedModel configuration for a trained machine learning model
 * @returns list of model types
 */
exports.getRemoveProcessorForInferenceType = getRemoveProcessorForInferenceType;
const getMlModelTypesForModelConfig = trainedModel => {
  var _trainedModel$tags;
  if (!trainedModel) return [];
  const isBuiltIn = (_trainedModel$tags = trainedModel.tags) === null || _trainedModel$tags === void 0 ? void 0 : _trainedModel$tags.includes(BUILT_IN_MODEL_TAG);
  return [trainedModel.model_type, ...Object.keys(trainedModel.inference_config || {}), ...(isBuiltIn ? [BUILT_IN_MODEL_TAG] : [])].filter(type => type !== undefined);
};
exports.getMlModelTypesForModelConfig = getMlModelTypesForModelConfig;
const formatPipelineName = rawName => rawName.trim().replace(/\s+/g, '_') // Convert whitespaces to underscores
.toLowerCase();
exports.formatPipelineName = formatPipelineName;
const parseMlInferenceParametersFromPipeline = (name, pipeline) => {
  var _pipeline$processors, _inferenceProcessor$f;
  const processor = pipeline === null || pipeline === void 0 ? void 0 : (_pipeline$processors = pipeline.processors) === null || _pipeline$processors === void 0 ? void 0 : _pipeline$processors.find(proc => proc.inference !== undefined);
  if (!processor || (processor === null || processor === void 0 ? void 0 : processor.inference) === undefined) {
    return null;
  }
  const {
    inference: inferenceProcessor
  } = processor;
  const sourceFields = Object.keys((_inferenceProcessor$f = inferenceProcessor.field_map) !== null && _inferenceProcessor$f !== void 0 ? _inferenceProcessor$f : {});
  const sourceField = sourceFields.length === 1 ? sourceFields[0] : null;
  if (!sourceField) {
    return null;
  }
  return {
    destination_field: inferenceProcessor.target_field.replace('ml.inference.', ''),
    model_id: inferenceProcessor.model_id,
    pipeline_name: name,
    source_field: sourceField
  };
};
exports.parseMlInferenceParametersFromPipeline = parseMlInferenceParametersFromPipeline;
const parseModelStateFromStats = trainedModelStats => {
  var _trainedModelStats$de;
  switch (trainedModelStats === null || trainedModelStats === void 0 ? void 0 : (_trainedModelStats$de = trainedModelStats.deployment_stats) === null || _trainedModelStats$de === void 0 ? void 0 : _trainedModelStats$de.state) {
    case 'started':
      return _pipelines.TrainedModelState.Started;
    case 'starting':
      return _pipelines.TrainedModelState.Starting;
    case 'stopping':
      return _pipelines.TrainedModelState.Stopping;
    // @ts-ignore: type is wrong, "failed" is a possible state
    case 'failed':
      return _pipelines.TrainedModelState.Failed;
    default:
      return _pipelines.TrainedModelState.NotDeployed;
  }
};
exports.parseModelStateFromStats = parseModelStateFromStats;
const parseModelStateReasonFromStats = trainedModelStats => {
  var _trainedModelStats$de2;
  return trainedModelStats === null || trainedModelStats === void 0 ? void 0 : (_trainedModelStats$de2 = trainedModelStats.deployment_stats) === null || _trainedModelStats$de2 === void 0 ? void 0 : _trainedModelStats$de2.reason;
};
exports.parseModelStateReasonFromStats = parseModelStateReasonFromStats;