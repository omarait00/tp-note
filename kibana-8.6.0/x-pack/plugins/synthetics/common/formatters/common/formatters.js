"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringToJsonFormatter = exports.secondsToCronFormatter = exports.objectToJsonFormatter = exports.commonFormatters = exports.arrayToJsonFormatter = void 0;
var _monitor_management = require("../../runtime_types/monitor_management");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const commonFormatters = {
  [_monitor_management.ConfigKey.NAME]: null,
  [_monitor_management.ConfigKey.LOCATIONS]: null,
  [_monitor_management.ConfigKey.MONITOR_TYPE]: null,
  [_monitor_management.ConfigKey.ENABLED]: null,
  [_monitor_management.ConfigKey.CONFIG_ID]: null,
  [_monitor_management.ConfigKey.SCHEDULE]: fields => {
    var _fields$ConfigKey$SCH, _fields$ConfigKey$SCH2;
    return JSON.stringify(`@every ${(_fields$ConfigKey$SCH = fields[_monitor_management.ConfigKey.SCHEDULE]) === null || _fields$ConfigKey$SCH === void 0 ? void 0 : _fields$ConfigKey$SCH.number}${(_fields$ConfigKey$SCH2 = fields[_monitor_management.ConfigKey.SCHEDULE]) === null || _fields$ConfigKey$SCH2 === void 0 ? void 0 : _fields$ConfigKey$SCH2.unit}`);
  },
  [_monitor_management.ConfigKey.APM_SERVICE_NAME]: null,
  [_monitor_management.ConfigKey.TAGS]: fields => arrayToJsonFormatter(fields[_monitor_management.ConfigKey.TAGS]),
  [_monitor_management.ConfigKey.TIMEOUT]: fields => secondsToCronFormatter(fields[_monitor_management.ConfigKey.TIMEOUT] || undefined),
  [_monitor_management.ConfigKey.NAMESPACE]: null,
  [_monitor_management.ConfigKey.REVISION]: null,
  [_monitor_management.ConfigKey.MONITOR_SOURCE_TYPE]: null,
  [_monitor_management.ConfigKey.FORM_MONITOR_TYPE]: null,
  [_monitor_management.ConfigKey.JOURNEY_ID]: null,
  [_monitor_management.ConfigKey.PROJECT_ID]: null,
  [_monitor_management.ConfigKey.CUSTOM_HEARTBEAT_ID]: null,
  [_monitor_management.ConfigKey.ORIGINAL_SPACE]: null,
  [_monitor_management.ConfigKey.CONFIG_HASH]: null,
  [_monitor_management.ConfigKey.MONITOR_QUERY_ID]: null
};
exports.commonFormatters = commonFormatters;
const arrayToJsonFormatter = (value = []) => value.length ? JSON.stringify(value) : null;
exports.arrayToJsonFormatter = arrayToJsonFormatter;
const secondsToCronFormatter = (value = '') => value ? `${value}s` : null;
exports.secondsToCronFormatter = secondsToCronFormatter;
const objectToJsonFormatter = (value = {}) => Object.keys(value).length ? JSON.stringify(value) : null;
exports.objectToJsonFormatter = objectToJsonFormatter;
const stringToJsonFormatter = (value = '') => value ? JSON.stringify(value) : null;
exports.stringToJsonFormatter = stringToJsonFormatter;