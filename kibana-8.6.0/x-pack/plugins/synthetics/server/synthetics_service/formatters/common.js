"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringToObjectFormatter = exports.secondsToCronFormatter = exports.objectFormatter = exports.commonFormatters = exports.arrayFormatter = void 0;
var _runtime_types = require("../../../common/runtime_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const commonFormatters = {
  [_runtime_types.ConfigKey.NAME]: null,
  [_runtime_types.ConfigKey.LOCATIONS]: null,
  [_runtime_types.ConfigKey.ENABLED]: null,
  [_runtime_types.ConfigKey.MONITOR_TYPE]: null,
  [_runtime_types.ConfigKey.CONFIG_ID]: null,
  [_runtime_types.ConfigKey.LOCATIONS]: null,
  [_runtime_types.ConfigKey.SCHEDULE]: fields => {
    var _fields$ConfigKey$SCH, _fields$ConfigKey$SCH2;
    return `@every ${(_fields$ConfigKey$SCH = fields[_runtime_types.ConfigKey.SCHEDULE]) === null || _fields$ConfigKey$SCH === void 0 ? void 0 : _fields$ConfigKey$SCH.number}${(_fields$ConfigKey$SCH2 = fields[_runtime_types.ConfigKey.SCHEDULE]) === null || _fields$ConfigKey$SCH2 === void 0 ? void 0 : _fields$ConfigKey$SCH2.unit}`;
  },
  [_runtime_types.ConfigKey.APM_SERVICE_NAME]: null,
  [_runtime_types.ConfigKey.TAGS]: fields => arrayFormatter(fields[_runtime_types.ConfigKey.TAGS]),
  [_runtime_types.ConfigKey.TIMEOUT]: fields => secondsToCronFormatter(fields[_runtime_types.ConfigKey.TIMEOUT] || undefined),
  [_runtime_types.ConfigKey.NAMESPACE]: null,
  [_runtime_types.ConfigKey.REVISION]: null,
  [_runtime_types.ConfigKey.MONITOR_SOURCE_TYPE]: fields => fields[_runtime_types.ConfigKey.MONITOR_SOURCE_TYPE] || _runtime_types.SourceType.UI,
  [_runtime_types.ConfigKey.FORM_MONITOR_TYPE]: null,
  [_runtime_types.ConfigKey.JOURNEY_ID]: null,
  [_runtime_types.ConfigKey.PROJECT_ID]: null,
  [_runtime_types.ConfigKey.CUSTOM_HEARTBEAT_ID]: null,
  [_runtime_types.ConfigKey.ORIGINAL_SPACE]: null,
  [_runtime_types.ConfigKey.CONFIG_HASH]: null,
  [_runtime_types.ConfigKey.MONITOR_QUERY_ID]: null
};
exports.commonFormatters = commonFormatters;
const arrayFormatter = (value = []) => value.length ? value : null;
exports.arrayFormatter = arrayFormatter;
const secondsToCronFormatter = (value = '') => value ? `${value}s` : null;
exports.secondsToCronFormatter = secondsToCronFormatter;
const objectFormatter = (value = {}) => Object.keys(value).length ? value : null;
exports.objectFormatter = objectFormatter;
const stringToObjectFormatter = value => {
  try {
    const obj = JSON.parse(value || '{}');
    return Object.keys(obj).length ? obj : undefined;
  } catch {
    return undefined;
  }
};
exports.stringToObjectFormatter = stringToObjectFormatter;