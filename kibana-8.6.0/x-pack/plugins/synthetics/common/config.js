"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;
var _configSchema = require("@kbn/config-schema");
var _serverHttpTools = require("@kbn/server-http-tools");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const serviceConfig = _configSchema.schema.object({
  username: _configSchema.schema.maybe(_configSchema.schema.string()),
  password: _configSchema.schema.maybe(_configSchema.schema.string()),
  manifestUrl: _configSchema.schema.maybe(_configSchema.schema.string()),
  hosts: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
  syncInterval: _configSchema.schema.maybe(_configSchema.schema.string()),
  tls: _configSchema.schema.maybe(_serverHttpTools.sslSchema),
  devUrl: _configSchema.schema.maybe(_configSchema.schema.string()),
  showExperimentalLocations: _configSchema.schema.maybe(_configSchema.schema.boolean())
});
const uptimeConfig = _configSchema.schema.object({
  index: _configSchema.schema.maybe(_configSchema.schema.string()),
  service: _configSchema.schema.maybe(serviceConfig)
});
const config = {
  schema: uptimeConfig
};
exports.config = config;