"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actionsSchema = void 0;
var _configSchema = require("@kbn/config-schema");
var _lib = require("../../lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const actionsSchema = _configSchema.schema.arrayOf(_configSchema.schema.object({
  group: _configSchema.schema.string(),
  id: _configSchema.schema.string(),
  params: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any(), {
    defaultValue: {}
  }),
  frequency: _configSchema.schema.maybe(_configSchema.schema.object({
    summary: _configSchema.schema.boolean(),
    notify_when: _configSchema.schema.oneOf([_configSchema.schema.literal('onActionGroupChange'), _configSchema.schema.literal('onActiveAlert'), _configSchema.schema.literal('onThrottleInterval')]),
    throttle: _configSchema.schema.nullable(_configSchema.schema.string({
      validate: _lib.validateDurationSchema
    }))
  }))
}), {
  defaultValue: []
});
exports.actionsSchema = actionsSchema;