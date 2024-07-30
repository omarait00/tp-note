"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultPipeline = void 0;
var _ = require("../..");
var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getDefaultPipeline = async client => {
  var _mapping$CURRENT_CONN, _mapping$CURRENT_CONN2;
  const mapping = await client.asCurrentUser.indices.getMapping({
    index: _.CURRENT_CONNECTORS_INDEX
  });
  const meta = (_mapping$CURRENT_CONN = mapping[_.CURRENT_CONNECTORS_INDEX]) === null || _mapping$CURRENT_CONN === void 0 ? void 0 : (_mapping$CURRENT_CONN2 = _mapping$CURRENT_CONN.mappings._meta) === null || _mapping$CURRENT_CONN2 === void 0 ? void 0 : _mapping$CURRENT_CONN2.pipeline;
  const mappedMapping = meta ? {
    extract_binary_content: meta.default_extract_binary_content,
    name: meta.default_name,
    reduce_whitespace: meta.default_reduce_whitespace,
    run_ml_inference: meta.default_run_ml_inference
  } : _constants.DEFAULT_PIPELINE_VALUES;
  return mappedMapping;
};
exports.getDefaultPipeline = getDefaultPipeline;