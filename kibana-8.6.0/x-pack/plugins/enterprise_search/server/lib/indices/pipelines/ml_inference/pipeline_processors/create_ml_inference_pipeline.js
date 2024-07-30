"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMlInferencePipeline = exports.createAndReferenceMlInferencePipeline = void 0;
var _ml_inference_pipeline = require("../../../../../../common/ml_inference_pipeline");
var _error_codes = require("../../../../../../common/types/error_codes");
var _create_ml_inference_pipeline = require("../../../../../utils/create_ml_inference_pipeline");
var _ml_inference_pipeline_utils = require("../../../../../utils/ml_inference_pipeline_utils");
var _create_pipeline_definitions = require("../../../../pipelines/create_pipeline_definitions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Creates a Machine Learning Inference pipeline with the given settings, if it doesn't exist yet,
 * then references it in the "parent" ML Inference pipeline that is associated with the index.
 * @param indexName name of the index this pipeline corresponds to.
 * @param pipelineName pipeline name set by the user.
 * @param modelId model ID selected by the user.
 * @param sourceField The document field that model will read.
 * @param destinationField The document field that the model will write to.
 * @param esClient the Elasticsearch Client to use when retrieving pipeline and model details.
 */
const createAndReferenceMlInferencePipeline = async (indexName, pipelineName, modelId, sourceField, destinationField, esClient) => {
  const createPipelineResult = await createMlInferencePipeline(pipelineName, modelId, sourceField, destinationField, esClient);
  const addSubPipelineResult = await (0, _create_ml_inference_pipeline.addSubPipelineToIndexSpecificMlPipeline)(indexName, createPipelineResult.id, esClient);
  return {
    ...createPipelineResult,
    addedToParentPipeline: addSubPipelineResult.addedToParentPipeline
  };
};

/**
 * Creates a Machine Learning Inference pipeline with the given settings, if it doesn't exist yet.
 * @param pipelineName pipeline name set by the user.
 * @param modelId model ID selected by the user.
 * @param sourceField The document field that model will read.
 * @param destinationField The document field that the model will write to.
 * @param esClient the Elasticsearch Client to use when retrieving pipeline and model details.
 */
exports.createAndReferenceMlInferencePipeline = createAndReferenceMlInferencePipeline;
const createMlInferencePipeline = async (pipelineName, modelId, sourceField, destinationField, esClient) => {
  var _pipelineByName;
  const inferencePipelineGeneratedName = (0, _ml_inference_pipeline_utils.getPrefixedInferencePipelineProcessorName)(pipelineName);

  // Check that a pipeline with the same name doesn't already exist
  let pipelineByName;
  try {
    pipelineByName = await esClient.ingest.getPipeline({
      id: inferencePipelineGeneratedName
    });
  } catch (error) {
    // Silently swallow error
  }
  if ((_pipelineByName = pipelineByName) !== null && _pipelineByName !== void 0 && _pipelineByName[inferencePipelineGeneratedName]) {
    throw new Error(_error_codes.ErrorCode.PIPELINE_ALREADY_EXISTS);
  }

  // Generate pipeline with default processors
  const mlInferencePipeline = await (0, _create_pipeline_definitions.formatMlPipelineBody)(inferencePipelineGeneratedName, modelId, sourceField, destinationField || (0, _ml_inference_pipeline.formatPipelineName)(pipelineName), esClient);
  await esClient.ingest.putPipeline({
    id: inferencePipelineGeneratedName,
    ...mlInferencePipeline
  });
  return {
    created: true,
    id: inferencePipelineGeneratedName
  };
};
exports.createMlInferencePipeline = createMlInferencePipeline;