"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateDefaultPipeline = void 0;
var _ = require("../..");
var _setup_indices = require("../../index_management/setup_indices");
var _identify_exceptions = require("../../utils/identify_exceptions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const updateDefaultPipeline = async (client, pipeline) => {
  try {
    const mapping = await client.asCurrentUser.indices.getMapping({
      index: _.CURRENT_CONNECTORS_INDEX
    });
    const newPipeline = {
      default_extract_binary_content: pipeline.extract_binary_content,
      default_name: pipeline.name,
      default_reduce_whitespace: pipeline.reduce_whitespace,
      default_run_ml_inference: pipeline.run_ml_inference
    };
    await client.asCurrentUser.indices.putMapping({
      _meta: {
        ...mapping[_.CURRENT_CONNECTORS_INDEX].mappings._meta,
        pipeline: newPipeline
      },
      index: _.CURRENT_CONNECTORS_INDEX
    });
  } catch (error) {
    if ((0, _identify_exceptions.isIndexNotFoundException)(error)) {
      (0, _setup_indices.setupConnectorsIndices)(client.asCurrentUser);
    }
  }
};
exports.updateDefaultPipeline = updateDefaultPipeline;