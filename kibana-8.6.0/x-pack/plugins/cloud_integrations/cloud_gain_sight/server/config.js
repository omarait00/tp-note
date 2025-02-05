"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const configSchema = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean({
    defaultValue: false
  }),
  org_id: _configSchema.schema.conditional(_configSchema.schema.siblingRef('enabled'), true, _configSchema.schema.string({
    minLength: 1
  }), _configSchema.schema.maybe(_configSchema.schema.string()))
});
const config = {
  exposeToBrowser: {
    org_id: true
  },
  schema: configSchema
};
exports.config = config;