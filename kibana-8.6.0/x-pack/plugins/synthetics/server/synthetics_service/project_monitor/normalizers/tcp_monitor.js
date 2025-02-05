"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNormalizeTCPFields = void 0;
var _lodash = require("lodash");
var _monitor_defaults = require("../../../../common/constants/monitor_defaults");
var _monitor_management = require("../../../../common/runtime_types/monitor_management");
var _common_fields = require("./common_fields");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getNormalizeTCPFields = ({
  locations = [],
  privateLocations = [],
  monitor,
  projectId,
  namespace,
  version
}) => {
  const defaultFields = _monitor_defaults.DEFAULT_FIELDS[_monitor_management.DataStream.TCP];
  const errors = [];
  const {
    yamlConfig,
    unsupportedKeys
  } = (0, _common_fields.normalizeYamlConfig)(monitor);
  const commonFields = (0, _common_fields.getNormalizeCommonFields)({
    locations,
    privateLocations,
    monitor,
    projectId,
    namespace,
    version
  });

  /* Check if monitor has multiple hosts */
  const hosts = (0, _common_fields.getOptionalListField)(monitor.hosts);
  if (hosts.length > 1) {
    errors.push((0, _common_fields.getMultipleUrlsOrHostsError)(monitor, 'hosts', version));
  }
  if (unsupportedKeys.length) {
    errors.push((0, _common_fields.getUnsupportedKeysError)(monitor, unsupportedKeys, version));
  }
  const normalizedFields = {
    ...yamlConfig,
    ...commonFields,
    [_monitor_management.ConfigKey.MONITOR_TYPE]: _monitor_management.DataStream.TCP,
    [_monitor_management.ConfigKey.FORM_MONITOR_TYPE]: _monitor_management.FormMonitorType.TCP,
    [_monitor_management.ConfigKey.HOSTS]: (0, _common_fields.getOptionalArrayField)(monitor[_monitor_management.ConfigKey.HOSTS]) || defaultFields[_monitor_management.ConfigKey.HOSTS],
    [_monitor_management.ConfigKey.TLS_VERSION]: (0, _lodash.get)(monitor, _monitor_management.ConfigKey.TLS_VERSION) ? (0, _common_fields.getOptionalListField)((0, _lodash.get)(monitor, _monitor_management.ConfigKey.TLS_VERSION)) : defaultFields[_monitor_management.ConfigKey.TLS_VERSION]
  };
  return {
    normalizedFields: {
      ...defaultFields,
      ...normalizedFields
    },
    unsupportedKeys,
    errors
  };
};
exports.getNormalizeTCPFields = getNormalizeTCPFields;