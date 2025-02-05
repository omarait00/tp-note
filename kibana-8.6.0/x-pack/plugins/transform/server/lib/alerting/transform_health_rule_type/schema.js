"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformHealthRuleParams = void 0;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const transformHealthRuleParams = _configSchema.schema.object({
  includeTransforms: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  excludeTransforms: _configSchema.schema.nullable(_configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: []
  })),
  testsConfig: _configSchema.schema.nullable(_configSchema.schema.object({
    notStarted: _configSchema.schema.nullable(_configSchema.schema.object({
      enabled: _configSchema.schema.boolean({
        defaultValue: true
      })
    })),
    errorMessages: _configSchema.schema.nullable(_configSchema.schema.object({
      enabled: _configSchema.schema.boolean({
        defaultValue: true
      })
    }))
  }))
});
exports.transformHealthRuleParams = transformHealthRuleParams;