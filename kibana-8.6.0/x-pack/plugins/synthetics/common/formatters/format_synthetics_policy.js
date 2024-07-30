"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatSyntheticsPolicy = void 0;
var _formatters = require("./formatters");
var _runtime_types = require("../runtime_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const formatSyntheticsPolicy = (newPolicy, monitorType, config, isLegacy) => {
  const configKeys = Object.keys(config);
  const formattedPolicy = {
    ...newPolicy
  };
  const currentInput = formattedPolicy.inputs.find(input => input.type === `synthetics/${monitorType}`);
  const dataStream = currentInput === null || currentInput === void 0 ? void 0 : currentInput.streams.find(stream => stream.data_stream.dataset === monitorType);
  formattedPolicy.inputs.forEach(input => input.enabled = false);
  if (currentInput && dataStream) {
    // reset all data streams to enabled false
    formattedPolicy.inputs.forEach(input => input.enabled = false);
    // enable only the input type and data stream that matches the monitor type.
    currentInput.enabled = true;
    dataStream.enabled = true;
  }
  configKeys.forEach(key => {
    var _dataStream$vars;
    const configItem = dataStream === null || dataStream === void 0 ? void 0 : (_dataStream$vars = dataStream.vars) === null || _dataStream$vars === void 0 ? void 0 : _dataStream$vars[key];
    if (configItem) {
      if (_formatters.formatters[key]) {
        var _formatters$key;
        configItem.value = (_formatters$key = _formatters.formatters[key]) === null || _formatters$key === void 0 ? void 0 : _formatters$key.call(_formatters.formatters, config);
      } else if (key === _runtime_types.ConfigKey.MONITOR_SOURCE_TYPE && isLegacy) {
        configItem.value = undefined;
      } else {
        configItem.value = config[key] === undefined || config[key] === null ? null : config[key];
      }
    }
  });
  return {
    formattedPolicy,
    dataStream,
    currentInput
  };
};
exports.formatSyntheticsPolicy = formatSyntheticsPolicy;