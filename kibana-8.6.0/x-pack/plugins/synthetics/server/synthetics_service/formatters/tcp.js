"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tcpFormatters = void 0;
var _common = require("./common");
var _tls = require("./tls");
var _monitor_management = require("../../../common/runtime_types/monitor_management");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const tcpFormatters = {
  [_monitor_management.ConfigKey.METADATA]: null,
  [_monitor_management.ConfigKey.HOSTS]: null,
  [_monitor_management.ConfigKey.PORT]: null,
  [_monitor_management.ConfigKey.PROXY_URL]: null,
  [_monitor_management.ConfigKey.PROXY_USE_LOCAL_RESOLVER]: null,
  [_monitor_management.ConfigKey.RESPONSE_RECEIVE_CHECK]: null,
  [_monitor_management.ConfigKey.REQUEST_SEND_CHECK]: null,
  [_monitor_management.ConfigKey.URLS]: null,
  ..._tls.tlsFormatters,
  ..._common.commonFormatters
};
exports.tcpFormatters = tcpFormatters;