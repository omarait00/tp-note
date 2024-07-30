"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formattersMap = exports.formatters = void 0;
var _http = require("./http");
var _tcp = require("./tcp");
var _icmp = require("./icmp");
var _browser = require("./browser");
var _common = require("./common");
var _runtime_types = require("../../../common/runtime_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const formattersMap = {
  [_runtime_types.DataStream.HTTP]: _http.httpFormatters,
  [_runtime_types.DataStream.ICMP]: _icmp.icmpFormatters,
  [_runtime_types.DataStream.TCP]: _tcp.tcpFormatters,
  [_runtime_types.DataStream.BROWSER]: _browser.browserFormatters
};
exports.formattersMap = formattersMap;
const formatters = {
  ..._http.httpFormatters,
  ..._icmp.icmpFormatters,
  ..._tcp.tcpFormatters,
  ..._browser.browserFormatters,
  ..._common.commonFormatters
};
exports.formatters = formatters;