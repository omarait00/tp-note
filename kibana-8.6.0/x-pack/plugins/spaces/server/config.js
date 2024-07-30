"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConfigSchema = void 0;
exports.createConfig$ = createConfig$;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ConfigSchema = _configSchema.schema.object({
  maxSpaces: _configSchema.schema.number({
    defaultValue: 1000
  })
});
exports.ConfigSchema = ConfigSchema;
function createConfig$(context) {
  return context.config.create();
}