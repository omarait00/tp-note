"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "initializeControlGroupTelemetry", {
  enumerable: true,
  get: function () {
    return _control_group_telemetry.initializeControlGroupTelemetry;
  }
});
exports.plugin = void 0;
var _plugin = require("./plugin");
var _control_group_telemetry = require("./control_group/control_group_telemetry");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const plugin = () => new _plugin.ControlsPlugin();
exports.plugin = plugin;