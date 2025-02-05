"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNormalizeICMPFields = void 0;
var _monitor_defaults = require("../../../../common/constants/monitor_defaults");
var _monitor_management = require("../../../../common/runtime_types/monitor_management");
var _common_fields = require("./common_fields");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getNormalizeICMPFields = ({
  locations = [],
  privateLocations = [],
  monitor,
  projectId,
  namespace,
  version
}) => {
  const defaultFields = _monitor_defaults.DEFAULT_FIELDS[_monitor_management.DataStream.ICMP];
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
    [_monitor_management.ConfigKey.MONITOR_TYPE]: _monitor_management.DataStream.ICMP,
    [_monitor_management.ConfigKey.FORM_MONITOR_TYPE]: _monitor_management.FormMonitorType.ICMP,
    [_monitor_management.ConfigKey.HOSTS]: (0, _common_fields.getOptionalArrayField)(monitor[_monitor_management.ConfigKey.HOSTS]) || defaultFields[_monitor_management.ConfigKey.HOSTS],
    [_monitor_management.ConfigKey.WAIT]: monitor.wait ? (0, _common_fields.getValueInSeconds)(monitor.wait) || defaultFields[_monitor_management.ConfigKey.WAIT] : defaultFields[_monitor_management.ConfigKey.WAIT]
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
exports.getNormalizeICMPFields = getNormalizeICMPFields;