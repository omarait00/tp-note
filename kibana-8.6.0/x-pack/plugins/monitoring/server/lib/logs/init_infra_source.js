"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initInfraSource = void 0;
var _constants = require("../../../common/constants");
var _get_index_patterns = require("../cluster/get_index_patterns");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// @ts-ignore

const initInfraSource = (config, infraPlugin) => {
  if (infraPlugin) {
    const logsIndexPattern = (0, _get_index_patterns.getIndexPatterns)({
      config,
      type: 'logs',
      ccs: _constants.CCS_REMOTE_PATTERN
    });
    infraPlugin.defineInternalSourceConfiguration(_constants.INFRA_SOURCE_ID, {
      name: 'Elastic Stack Logs',
      logIndices: {
        type: 'index_name',
        indexName: logsIndexPattern
      }
    });
  }
};
exports.initInfraSource = initInfraSource;