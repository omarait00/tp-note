"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tlsValueToYamlFormatter = exports.tlsValueToStringFormatter = exports.tlsFormatters = exports.tlsArrayToYamlFormatter = void 0;
var _monitor_management = require("../../runtime_types/monitor_management");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const tlsFormatters = {
  [_monitor_management.ConfigKey.TLS_CERTIFICATE_AUTHORITIES]: fields => tlsValueToYamlFormatter(fields[_monitor_management.ConfigKey.TLS_CERTIFICATE_AUTHORITIES]),
  [_monitor_management.ConfigKey.TLS_CERTIFICATE]: fields => tlsValueToYamlFormatter(fields[_monitor_management.ConfigKey.TLS_CERTIFICATE]),
  [_monitor_management.ConfigKey.TLS_KEY]: fields => tlsValueToYamlFormatter(fields[_monitor_management.ConfigKey.TLS_KEY]),
  [_monitor_management.ConfigKey.TLS_KEY_PASSPHRASE]: fields => tlsValueToStringFormatter(fields[_monitor_management.ConfigKey.TLS_KEY_PASSPHRASE]),
  [_monitor_management.ConfigKey.TLS_VERIFICATION_MODE]: fields => tlsValueToStringFormatter(fields[_monitor_management.ConfigKey.TLS_VERIFICATION_MODE]),
  [_monitor_management.ConfigKey.TLS_VERSION]: fields => tlsArrayToYamlFormatter(fields[_monitor_management.ConfigKey.TLS_VERSION])
};

// only add tls settings if they are enabled by the user and isEnabled is true
exports.tlsFormatters = tlsFormatters;
const tlsValueToYamlFormatter = (tlsValue = '') => tlsValue ? JSON.stringify(tlsValue) : null;
exports.tlsValueToYamlFormatter = tlsValueToYamlFormatter;
const tlsValueToStringFormatter = (tlsValue = '') => tlsValue || null;
exports.tlsValueToStringFormatter = tlsValueToStringFormatter;
const tlsArrayToYamlFormatter = (tlsValue = []) => tlsValue.length ? JSON.stringify(tlsValue) : null;
exports.tlsArrayToYamlFormatter = tlsArrayToYamlFormatter;