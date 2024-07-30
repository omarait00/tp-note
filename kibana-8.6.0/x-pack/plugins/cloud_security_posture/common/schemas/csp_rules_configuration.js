"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cspRulesConfigSchema = void 0;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// cspRulesConfigSchema has to match the 'RuntimeCfg' struct in https://github.com/elastic/cloudbeat/blob/main/config/config.go#L45-L51
const cspRulesConfigSchema = _configSchema.schema.object({
  runtime_cfg: _configSchema.schema.object({
    activated_rules: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string()))
  })
});
exports.cspRulesConfigSchema = cspRulesConfigSchema;