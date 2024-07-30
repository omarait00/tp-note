"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;
exports.plugin = plugin;
var _configSchema = require("@kbn/config-schema");
var _plugin = require("./plugin");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const configSchema = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean({
    defaultValue: false
  })
});
// plugin config
const config = {
  schema: configSchema
};

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.
exports.config = config;
function plugin(initializerContext) {
  return new _plugin.ProfilingPlugin(initializerContext);
}