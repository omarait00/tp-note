"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = exports.config = void 0;
var _plugin = require("./plugin");
var _config = require("./config");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const plugin = initContext => new _plugin.MonitoringCollectionPlugin(initContext);
exports.plugin = plugin;
const config = {
  schema: _config.configSchema
};
exports.config = config;