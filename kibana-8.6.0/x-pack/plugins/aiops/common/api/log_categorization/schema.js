"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.categorizeSchema = void 0;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const categorizeSchema = _configSchema.schema.object({
  index: _configSchema.schema.string(),
  field: _configSchema.schema.string(),
  timeField: _configSchema.schema.string(),
  to: _configSchema.schema.number(),
  from: _configSchema.schema.number(),
  query: _configSchema.schema.any(),
  intervalMs: _configSchema.schema.maybe(_configSchema.schema.number())
});
exports.categorizeSchema = categorizeSchema;