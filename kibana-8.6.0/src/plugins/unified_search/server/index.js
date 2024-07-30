"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Plugin", {
  enumerable: true,
  get: function () {
    return _plugin.UnifiedSearchServerPlugin;
  }
});
exports.config = void 0;
exports.plugin = plugin;
var _config = require("../config");
var _plugin = require("./plugin");
var _config_deprecations = require("./config_deprecations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Static code to be shared externally
 * @public
 */

function plugin(initializerContext) {
  return new _plugin.UnifiedSearchServerPlugin(initializerContext);
}
const config = {
  deprecations: _config_deprecations.autocompleteConfigDeprecationProvider,
  exposeToBrowser: {
    autocomplete: true
  },
  schema: _config.configSchema
};
exports.config = config;