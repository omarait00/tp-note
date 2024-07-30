"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeYamlConfig = exports.getValueInSeconds = exports.getUnsupportedKeysError = exports.getOptionalListField = exports.getOptionalArrayField = exports.getNormalizeCommonFields = exports.getMultipleUrlsOrHostsError = exports.getMonitorLocations = exports.getCustomHeartbeatId = exports.flattenAndFormatObject = void 0;
var _lodash = require("lodash");
var _location_formatter = require("../../../../common/utils/location_formatter");
var _formatters = require("../../../../common/formatters");
var _runtime_types = require("../../../../common/runtime_types");
var _monitor_defaults = require("../../../../common/constants/monitor_defaults");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getNormalizeCommonFields = ({
  locations = [],
  privateLocations = [],
  monitor,
  projectId,
  namespace
}) => {
  var _monitor$enabled;
  const defaultFields = _monitor_defaults.DEFAULT_COMMON_FIELDS;
  const normalizedFields = {
    [_runtime_types.ConfigKey.JOURNEY_ID]: monitor.id || defaultFields[_runtime_types.ConfigKey.JOURNEY_ID],
    [_runtime_types.ConfigKey.MONITOR_SOURCE_TYPE]: _runtime_types.SourceType.PROJECT,
    [_runtime_types.ConfigKey.NAME]: monitor.name || '',
    [_runtime_types.ConfigKey.SCHEDULE]: {
      number: `${monitor.schedule}`,
      unit: _runtime_types.ScheduleUnit.MINUTES
    },
    [_runtime_types.ConfigKey.PROJECT_ID]: projectId,
    [_runtime_types.ConfigKey.LOCATIONS]: getMonitorLocations({
      monitor,
      privateLocations,
      publicLocations: locations
    }),
    [_runtime_types.ConfigKey.TAGS]: getOptionalListField(monitor.tags) || defaultFields[_runtime_types.ConfigKey.TAGS],
    [_runtime_types.ConfigKey.NAMESPACE]: (0, _formatters.formatKibanaNamespace)(namespace) || defaultFields[_runtime_types.ConfigKey.NAMESPACE],
    [_runtime_types.ConfigKey.ORIGINAL_SPACE]: namespace || defaultFields[_runtime_types.ConfigKey.NAMESPACE],
    [_runtime_types.ConfigKey.CUSTOM_HEARTBEAT_ID]: getCustomHeartbeatId(monitor, projectId, namespace),
    [_runtime_types.ConfigKey.ENABLED]: (_monitor$enabled = monitor.enabled) !== null && _monitor$enabled !== void 0 ? _monitor$enabled : defaultFields[_runtime_types.ConfigKey.ENABLED],
    [_runtime_types.ConfigKey.TIMEOUT]: monitor.timeout ? getValueInSeconds(monitor.timeout) : defaultFields[_runtime_types.ConfigKey.TIMEOUT],
    [_runtime_types.ConfigKey.CONFIG_HASH]: monitor.hash || defaultFields[_runtime_types.ConfigKey.CONFIG_HASH]
  };
  return normalizedFields;
};
exports.getNormalizeCommonFields = getNormalizeCommonFields;
const getCustomHeartbeatId = (monitor, projectId, namespace) => {
  return `${monitor.id}-${projectId}-${namespace}`;
};
exports.getCustomHeartbeatId = getCustomHeartbeatId;
const getMonitorLocations = ({
  privateLocations,
  publicLocations,
  monitor
}) => {
  var _monitor$locations, _monitor$privateLocat;
  const publicLocs = ((_monitor$locations = monitor.locations) === null || _monitor$locations === void 0 ? void 0 : _monitor$locations.map(id => {
    return publicLocations.find(location => location.id === id);
  })) || [];
  const privateLocs = ((_monitor$privateLocat = monitor.privateLocations) === null || _monitor$privateLocat === void 0 ? void 0 : _monitor$privateLocat.map(locationName => {
    return privateLocations.find(location => location.label.toLowerCase() === locationName.toLowerCase() || location.id.toLowerCase() === locationName.toLowerCase());
  })) || [];
  return [...publicLocs, ...privateLocs].filter(location => location !== undefined).map(loc => (0, _location_formatter.formatLocation)(loc));
};
exports.getMonitorLocations = getMonitorLocations;
const getUnsupportedKeysError = (monitor, unsupportedKeys, version) => ({
  id: monitor.id,
  reason: 'Unsupported Heartbeat option',
  details: `The following Heartbeat options are not supported for ${monitor.type} project monitors in ${version}: ${unsupportedKeys.join('|')}. You monitor was not created or updated.`
});
exports.getUnsupportedKeysError = getUnsupportedKeysError;
const getMultipleUrlsOrHostsError = (monitor, key, version) => ({
  id: monitor.id,
  reason: 'Unsupported Heartbeat option',
  details: `Multiple ${key} are not supported for ${monitor.type} project monitors in ${version}. Please set only 1 ${key.slice(0, -1)} per monitor. You monitor was not created or updated.`
});
exports.getMultipleUrlsOrHostsError = getMultipleUrlsOrHostsError;
const getValueInSeconds = value => {
  const keyMap = {
    h: 60 * 60,
    m: 60,
    s: 1
  };
  const key = value.slice(-1);
  const time = parseInt(value.slice(0, -1), 10);
  const valueInSeconds = time * (keyMap[key] || 1);
  return typeof valueInSeconds === 'number' ? `${valueInSeconds}` : null;
};

/**
 * Accounts for array values that are optionally defined as a comma seperated list
 *
 * @param {Array | string} [value]
 * @returns {array} Returns an array
 */
exports.getValueInSeconds = getValueInSeconds;
const getOptionalListField = value => {
  if (Array.isArray(value)) {
    return value;
  }
  return value ? value.split(',') : [];
};

/**
 * Accounts for heartbeat fields that are optionally an array or single string
 *
 * @param {Array | string} [value]
 * @returns {string} Returns first item when the value is an array, or the value itself
 */
exports.getOptionalListField = getOptionalListField;
const getOptionalArrayField = (value = '') => {
  const array = getOptionalListField(value);
  return array[0];
};

/**
 * Flattens arbitrary yaml into a synthetics monitor compatible configuration
 *
 * @param {Object} [monitor]
 * @returns {Object} Returns an object containing synthetics-compatible configuration keys
 */
exports.getOptionalArrayField = getOptionalArrayField;
const flattenAndFormatObject = (obj, prefix = '', keys) => Object.keys(obj).reduce((acc, k) => {
  const pre = prefix.length ? prefix + '.' : '';
  const key = pre + k;

  /* If the key is an array of numbers, convert to an array of strings */
  if (Array.isArray(obj[k])) {
    acc[key] = obj[k].map(value => typeof value === 'number' ? String(value) : value);
    return acc;
  }

  /* if the key is a supported key stop flattening early */
  if (keys.includes(key)) {
    acc[key] = obj[k];
    return acc;
  }
  if (typeof obj[k] === 'object') {
    Object.assign(acc, flattenAndFormatObject(obj[k], pre + k, keys));
  } else {
    acc[key] = obj[k];
  }
  return acc;
}, {});
exports.flattenAndFormatObject = flattenAndFormatObject;
const normalizeYamlConfig = monitor => {
  const defaultFields = _monitor_defaults.DEFAULT_FIELDS[monitor.type];
  const supportedKeys = Object.keys(defaultFields);
  const flattenedConfig = flattenAndFormatObject(monitor, '', supportedKeys);
  const {
    locations: _locations,
    privateLocations: _privateLocations,
    content: _content,
    id: _id,
    ...yamlConfig
  } = flattenedConfig;
  const unsupportedKeys = Object.keys(yamlConfig).filter(key => !supportedKeys.includes(key));
  const supportedYamlConfig = (0, _lodash.omit)(yamlConfig, unsupportedKeys);
  return {
    yamlConfig: supportedYamlConfig,
    unsupportedKeys
  };
};
exports.normalizeYamlConfig = normalizeYamlConfig;