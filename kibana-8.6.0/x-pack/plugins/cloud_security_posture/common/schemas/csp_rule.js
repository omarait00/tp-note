"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cspRuleSchemaV840 = exports.cspRuleSchemaV830 = void 0;
var _configSchema = require("@kbn/config-schema");
var _csp_rule_metadata = require("./csp_rule_metadata");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const cspRuleSchemaV830 = _configSchema.schema.object({
  audit: _configSchema.schema.string(),
  benchmark: _configSchema.schema.object({
    name: _configSchema.schema.string(),
    version: _configSchema.schema.string()
  }),
  default_value: _configSchema.schema.nullable(_configSchema.schema.string()),
  description: _configSchema.schema.string(),
  enabled: _configSchema.schema.boolean(),
  id: _configSchema.schema.string(),
  impact: _configSchema.schema.nullable(_configSchema.schema.string()),
  muted: _configSchema.schema.boolean(),
  name: _configSchema.schema.string(),
  package_policy_id: _configSchema.schema.string(),
  policy_id: _configSchema.schema.string(),
  profile_applicability: _configSchema.schema.string(),
  rationale: _configSchema.schema.string(),
  references: _configSchema.schema.nullable(_configSchema.schema.string()),
  rego_rule_id: _configSchema.schema.string(),
  remediation: _configSchema.schema.string(),
  section: _configSchema.schema.string(),
  tags: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  version: _configSchema.schema.string()
});
exports.cspRuleSchemaV830 = cspRuleSchemaV830;
const cspRuleSchemaV840 = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean(),
  metadata: _csp_rule_metadata.cspRuleMetadataSchema,
  muted: _configSchema.schema.boolean(),
  package_policy_id: _configSchema.schema.string(),
  policy_id: _configSchema.schema.string()
});
exports.cspRuleSchemaV840 = cspRuleSchemaV840;