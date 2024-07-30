"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.icmpFormatters = void 0;
var _common = require("./common");
var _monitor_management = require("../../../common/runtime_types/monitor_management");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const icmpFormatters = {
  [_monitor_management.ConfigKey.HOSTS]: null,
  [_monitor_management.ConfigKey.WAIT]: fields => (0, _common.secondsToCronFormatter)(fields[_monitor_management.ConfigKey.WAIT]),
  ..._common.commonFormatters
};
exports.icmpFormatters = icmpFormatters;