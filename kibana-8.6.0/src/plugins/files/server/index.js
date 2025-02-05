"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "createEsFileClient", {
  enumerable: true,
  get: function () {
    return _file_client.createEsFileClient;
  }
});
exports.plugin = plugin;
var _plugin = require("./plugin");
var _file_client = require("./file_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function plugin(initializerContext) {
  return new _plugin.FilesPlugin(initializerContext);
}