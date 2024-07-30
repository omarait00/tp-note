"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNormalizeBrowserFields = void 0;
var _runtime_types = require("../../../../common/runtime_types");
var _monitor_defaults = require("../../../../common/constants/monitor_defaults");
var _common_fields = require("./common_fields");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getNormalizeBrowserFields = ({
  locations = [],
  privateLocations = [],
  monitor,
  projectId,
  namespace,
  version
}) => {
  var _monitor$throttling, _monitor$throttling2, _Boolean, _monitor$throttling3, _monitor$filter;
  const defaultFields = _monitor_defaults.DEFAULT_FIELDS[_runtime_types.DataStream.BROWSER];
  const commonFields = (0, _common_fields.getNormalizeCommonFields)({
    locations,
    privateLocations,
    monitor,
    projectId,
    namespace,
    version
  });
  const normalizedFields = {
    ...commonFields,
    [_runtime_types.ConfigKey.MONITOR_TYPE]: _runtime_types.DataStream.BROWSER,
    [_runtime_types.ConfigKey.FORM_MONITOR_TYPE]: _runtime_types.FormMonitorType.MULTISTEP,
    [_runtime_types.ConfigKey.SOURCE_PROJECT_CONTENT]: monitor.content || defaultFields[_runtime_types.ConfigKey.SOURCE_PROJECT_CONTENT],
    [_runtime_types.ConfigKey.THROTTLING_CONFIG]: monitor.throttling ? `${monitor.throttling.download}d/${monitor.throttling.upload}u/${monitor.throttling.latency}l` : defaultFields[_runtime_types.ConfigKey.THROTTLING_CONFIG],
    [_runtime_types.ConfigKey.DOWNLOAD_SPEED]: `${((_monitor$throttling = monitor.throttling) === null || _monitor$throttling === void 0 ? void 0 : _monitor$throttling.download) || defaultFields[_runtime_types.ConfigKey.DOWNLOAD_SPEED]}`,
    [_runtime_types.ConfigKey.UPLOAD_SPEED]: `${((_monitor$throttling2 = monitor.throttling) === null || _monitor$throttling2 === void 0 ? void 0 : _monitor$throttling2.upload) || defaultFields[_runtime_types.ConfigKey.UPLOAD_SPEED]}`,
    [_runtime_types.ConfigKey.IS_THROTTLING_ENABLED]: (_Boolean = Boolean(monitor.throttling)) !== null && _Boolean !== void 0 ? _Boolean : defaultFields[_runtime_types.ConfigKey.IS_THROTTLING_ENABLED],
    [_runtime_types.ConfigKey.LATENCY]: `${((_monitor$throttling3 = monitor.throttling) === null || _monitor$throttling3 === void 0 ? void 0 : _monitor$throttling3.latency) || defaultFields[_runtime_types.ConfigKey.LATENCY]}`,
    [_runtime_types.ConfigKey.IGNORE_HTTPS_ERRORS]: monitor.ignoreHTTPSErrors || defaultFields[_runtime_types.ConfigKey.IGNORE_HTTPS_ERRORS],
    [_runtime_types.ConfigKey.SCREENSHOTS]: monitor.screenshot || defaultFields[_runtime_types.ConfigKey.SCREENSHOTS],
    [_runtime_types.ConfigKey.PLAYWRIGHT_OPTIONS]: Object.keys(monitor.playwrightOptions || {}).length ? JSON.stringify(monitor.playwrightOptions) : defaultFields[_runtime_types.ConfigKey.PLAYWRIGHT_OPTIONS],
    [_runtime_types.ConfigKey.PARAMS]: Object.keys(monitor.params || {}).length ? JSON.stringify(monitor.params) : defaultFields[_runtime_types.ConfigKey.PARAMS],
    [_runtime_types.ConfigKey.JOURNEY_FILTERS_MATCH]: ((_monitor$filter = monitor.filter) === null || _monitor$filter === void 0 ? void 0 : _monitor$filter.match) || defaultFields[_runtime_types.ConfigKey.JOURNEY_FILTERS_MATCH],
    [_runtime_types.ConfigKey.TIMEOUT]: monitor.timeout ? (0, _common_fields.getValueInSeconds)(monitor.timeout) : defaultFields[_runtime_types.ConfigKey.TIMEOUT]
  };
  return {
    normalizedFields: {
      ...defaultFields,
      ...normalizedFields
    },
    unsupportedKeys: [],
    errors: []
  };
};
exports.getNormalizeBrowserFields = getNormalizeBrowserFields;