"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formattersMap = exports.formatters = exports.formatKibanaNamespace = void 0;
var _common = require("../../../fleet/common");
var _runtime_types = require("../runtime_types");
var _formatters = require("./http/formatters");
var _formatters2 = require("./tcp/formatters");
var _formatters3 = require("./icmp/formatters");
var _formatters4 = require("./browser/formatters");
var _formatters5 = require("./common/formatters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const formattersMap = {
  [_runtime_types.DataStream.HTTP]: _formatters.httpFormatters,
  [_runtime_types.DataStream.ICMP]: _formatters3.icmpFormatters,
  [_runtime_types.DataStream.TCP]: _formatters2.tcpFormatters,
  [_runtime_types.DataStream.BROWSER]: _formatters4.browserFormatters
};
exports.formattersMap = formattersMap;
const formatters = {
  ..._formatters.httpFormatters,
  ..._formatters3.icmpFormatters,
  ..._formatters2.tcpFormatters,
  ..._formatters4.browserFormatters,
  ..._formatters5.commonFormatters
};

/* Formats kibana space id into a valid Fleet-compliant datastream namespace */
exports.formatters = formatters;
const formatKibanaNamespace = spaceId => {
  const namespaceRegExp = new RegExp(_common.INVALID_NAMESPACE_CHARACTERS, 'g');
  const kibanaNamespace = spaceId.replace(namespaceRegExp, '_');
  return kibanaNamespace;
};
exports.formatKibanaNamespace = formatKibanaNamespace;