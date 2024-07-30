"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cspRuleMetadataSchema = void 0;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const cspRuleMetadataSchema = _configSchema.schema.object({
  audit: _configSchema.schema.string(),
  benchmark: _configSchema.schema.object({
    name: _configSchema.schema.string(),
    id: _configSchema.schema.string(),
    version: _configSchema.schema.string()
  }),
  default_value: _configSchema.schema.maybe(_configSchema.schema.string()),
  description: _configSchema.schema.string(),
  id: _configSchema.schema.string(),
  impact: _configSchema.schema.maybe(_configSchema.schema.string()),
  name: _configSchema.schema.string(),
  profile_applicability: _configSchema.schema.string(),
  rationale: _configSchema.schema.string(),
  references: _configSchema.schema.maybe(_configSchema.schema.string()),
  rego_rule_id: _configSchema.schema.string(),
  remediation: _configSchema.schema.string(),
  section: _configSchema.schema.string(),
  tags: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  version: _configSchema.schema.string()
});
exports.cspRuleMetadataSchema = cspRuleMetadataSchema;