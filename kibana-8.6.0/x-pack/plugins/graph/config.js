"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configSchema = void 0;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const configSchema = _configSchema.schema.object({
  savePolicy: _configSchema.schema.oneOf([_configSchema.schema.literal('none'), _configSchema.schema.literal('config'), _configSchema.schema.literal('configAndData'), _configSchema.schema.literal('configAndDataWithConsent')], {
    defaultValue: 'configAndData'
  }),
  canEditDrillDownUrls: _configSchema.schema.boolean({
    defaultValue: true
  })
});
exports.configSchema = configSchema;