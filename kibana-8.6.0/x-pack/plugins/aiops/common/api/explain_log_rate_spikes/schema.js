"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aiopsExplainLogRateSpikesSchema = void 0;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const aiopsExplainLogRateSpikesSchema = _configSchema.schema.object({
  start: _configSchema.schema.number(),
  end: _configSchema.schema.number(),
  searchQuery: _configSchema.schema.string(),
  timeFieldName: _configSchema.schema.string(),
  includeFrozen: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  grouping: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  /** Analysis selection time ranges */
  baselineMin: _configSchema.schema.number(),
  baselineMax: _configSchema.schema.number(),
  deviationMin: _configSchema.schema.number(),
  deviationMax: _configSchema.schema.number(),
  /** The index to query for log rate spikes */
  index: _configSchema.schema.string(),
  /** Settings to override headers derived compression and flush fix */
  compressResponse: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  flushFix: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  /** Overrides to skip steps of the analysis with existing data */
  overrides: _configSchema.schema.maybe(_configSchema.schema.object({
    loaded: _configSchema.schema.maybe(_configSchema.schema.number()),
    remainingFieldCandidates: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
    // TODO Improve schema
    changePoints: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.any()))
  }))
});
exports.aiopsExplainLogRateSpikesSchema = aiopsExplainLogRateSpikesSchema;