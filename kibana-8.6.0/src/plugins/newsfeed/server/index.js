"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;
exports.plugin = plugin;
var _plugin = require("./plugin");
var _config = require("./config");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const config = {
  schema: _config.configSchema,
  exposeToBrowser: {
    service: true,
    mainInterval: true,
    fetchInterval: true
  }
};
exports.config = config;
function plugin() {
  return new _plugin.NewsfeedPlugin();
}