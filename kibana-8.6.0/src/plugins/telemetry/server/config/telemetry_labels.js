"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.labelsSchema = void 0;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Labels to enrich the context of the telemetry generated.
 * When adding new keys, bear in mind that this info is exposed
 * to the browser **even to unauthenticated pages**.
 */
const labelsSchema = _configSchema.schema.object({
  branch: _configSchema.schema.maybe(_configSchema.schema.string()),
  ciBuildJobId: _configSchema.schema.maybe(_configSchema.schema.string()),
  ciBuildId: _configSchema.schema.maybe(_configSchema.schema.string()),
  ciBuildNumber: _configSchema.schema.maybe(_configSchema.schema.number()),
  ftrConfig: _configSchema.schema.maybe(_configSchema.schema.string()),
  gitRev: _configSchema.schema.maybe(_configSchema.schema.string()),
  isPr: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  prId: _configSchema.schema.maybe(_configSchema.schema.number()),
  journeyName: _configSchema.schema.maybe(_configSchema.schema.string()),
  testBuildId: _configSchema.schema.maybe(_configSchema.schema.string()),
  testJobId: _configSchema.schema.maybe(_configSchema.schema.string()),
  ciBuildName: _configSchema.schema.maybe(_configSchema.schema.string())
}, {
  defaultValue: {}
});
exports.labelsSchema = labelsSchema;