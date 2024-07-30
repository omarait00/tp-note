"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tcpFormatters = void 0;
var _monitor_management = require("../../runtime_types/monitor_management");
var _formatters = require("../common/formatters");
var _formatters2 = require("../tls/formatters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const tcpFormatters = {
  [_monitor_management.ConfigKey.METADATA]: fields => (0, _formatters.objectToJsonFormatter)(fields[_monitor_management.ConfigKey.METADATA]),
  [_monitor_management.ConfigKey.HOSTS]: null,
  [_monitor_management.ConfigKey.PROXY_URL]: null,
  [_monitor_management.ConfigKey.PROXY_USE_LOCAL_RESOLVER]: null,
  [_monitor_management.ConfigKey.RESPONSE_RECEIVE_CHECK]: null,
  [_monitor_management.ConfigKey.REQUEST_SEND_CHECK]: null,
  [_monitor_management.ConfigKey.PORT]: null,
  [_monitor_management.ConfigKey.URLS]: null,
  ..._formatters2.tlsFormatters,
  ..._formatters.commonFormatters
};
exports.tcpFormatters = tcpFormatters;