"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatSecrets = formatSecrets;
exports.normalizeSecrets = normalizeSecrets;
var _lodash = require("lodash");
var _monitor_management = require("../../../common/constants/monitor_management");
var _monitor_management2 = require("../../../common/runtime_types/monitor_management");
var _monitor_defaults = require("../../../common/constants/monitor_defaults");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function formatSecrets(monitor) {
  const monitorWithoutSecrets = (0, _lodash.omit)(monitor, _monitor_management.secretKeys);
  const secrets = (0, _lodash.pick)(monitor, _monitor_management.secretKeys);
  return {
    ...monitorWithoutSecrets,
    secrets: JSON.stringify(secrets)
  };
}
function normalizeSecrets(monitor) {
  const defaultFields = _monitor_defaults.DEFAULT_FIELDS[monitor.attributes[_monitor_management2.ConfigKey.MONITOR_TYPE]];
  const normalizedMonitor = {
    ...monitor,
    attributes: {
      ...defaultFields,
      ...monitor.attributes,
      ...JSON.parse(monitor.attributes.secrets || '')
    }
  };
  delete normalizedMonitor.attributes.secrets;
  return normalizedMonitor;
}