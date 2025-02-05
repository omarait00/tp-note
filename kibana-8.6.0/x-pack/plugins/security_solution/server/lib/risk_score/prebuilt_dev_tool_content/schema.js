"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReadConsoleRequestSchema = void 0;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ReadConsoleRequestSchema = {
  params: _configSchema.schema.object({
    console_id: _configSchema.schema.oneOf([_configSchema.schema.literal('enable_host_risk_score'), _configSchema.schema.literal('enable_user_risk_score')])
  })
};
exports.ReadConsoleRequestSchema = ReadConsoleRequestSchema;