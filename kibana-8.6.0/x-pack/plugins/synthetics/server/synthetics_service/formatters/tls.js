"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tlsFormatters = void 0;
var _common = require("./common");
var _monitor_management = require("../../../common/runtime_types/monitor_management");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const tlsFormatters = {
  [_monitor_management.ConfigKey.TLS_CERTIFICATE_AUTHORITIES]: null,
  [_monitor_management.ConfigKey.TLS_CERTIFICATE]: null,
  [_monitor_management.ConfigKey.TLS_KEY]: null,
  [_monitor_management.ConfigKey.TLS_KEY_PASSPHRASE]: null,
  [_monitor_management.ConfigKey.TLS_VERIFICATION_MODE]: null,
  [_monitor_management.ConfigKey.TLS_VERSION]: fields => (0, _common.arrayFormatter)(fields[_monitor_management.ConfigKey.TLS_VERSION])
};
exports.tlsFormatters = tlsFormatters;