"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatMonitorConfig = exports.formatHeartbeatRequest = void 0;
var _lodash = require("lodash");
var _runtime_types = require("../../../common/runtime_types");
var _ = require(".");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const UI_KEYS_TO_SKIP = [_runtime_types.ConfigKey.JOURNEY_ID, _runtime_types.ConfigKey.PROJECT_ID, _runtime_types.ConfigKey.METADATA, _runtime_types.ConfigKey.UPLOAD_SPEED, _runtime_types.ConfigKey.DOWNLOAD_SPEED, _runtime_types.ConfigKey.LATENCY, _runtime_types.ConfigKey.IS_THROTTLING_ENABLED, _runtime_types.ConfigKey.REVISION, _runtime_types.ConfigKey.CUSTOM_HEARTBEAT_ID, _runtime_types.ConfigKey.FORM_MONITOR_TYPE, _runtime_types.ConfigKey.TEXT_ASSERTION, _runtime_types.ConfigKey.CONFIG_HASH, 'secrets'];
const uiToHeartbeatKeyMap = {
  throttling: _runtime_types.ConfigKey.THROTTLING_CONFIG
};
const formatMonitorConfig = (configKeys, config) => {
  const formattedMonitor = {};
  configKeys.forEach(key => {
    if (!UI_KEYS_TO_SKIP.includes(key)) {
      var _config$key, _formatters$key;
      const value = (_config$key = config[key]) !== null && _config$key !== void 0 ? _config$key : null;
      if (value === null || value === '') {
        return;
      }
      formattedMonitor[key] = !!_.formatters[key] ? (_formatters$key = _.formatters[key]) === null || _formatters$key === void 0 ? void 0 : _formatters$key.call(_.formatters, config) : value;
    }
  });
  Object.keys(uiToHeartbeatKeyMap).forEach(key => {
    const hbKey = key;
    const configKey = uiToHeartbeatKeyMap[hbKey];
    formattedMonitor[hbKey] = formattedMonitor[configKey];
    delete formattedMonitor[configKey];
  });
  return (0, _lodash.omitBy)(formattedMonitor, _lodash.isNil);
};
exports.formatMonitorConfig = formatMonitorConfig;
const formatHeartbeatRequest = ({
  monitor,
  monitorId,
  heartbeatId,
  runOnce,
  testRunId
}) => {
  const projectId = monitor[_runtime_types.ConfigKey.PROJECT_ID];
  return {
    ...monitor,
    id: heartbeatId,
    fields: {
      config_id: monitorId,
      'monitor.project.name': projectId || undefined,
      'monitor.project.id': projectId || undefined,
      run_once: runOnce,
      test_run_id: testRunId
    },
    fields_under_root: true
  };
};
exports.formatHeartbeatRequest = formatHeartbeatRequest;