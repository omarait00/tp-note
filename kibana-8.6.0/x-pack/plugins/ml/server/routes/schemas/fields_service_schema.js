"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTimeFieldRangeSchema = exports.getCardinalityOfFieldsSchema = void 0;
var _configSchema = require("@kbn/config-schema");
var _datafeeds_schema = require("./datafeeds_schema");
var _runtime_mappings_schema = require("./runtime_mappings_schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getCardinalityOfFieldsSchema = _configSchema.schema.object({
  /** Index or indexes for which to return the time range. */
  index: _configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())]),
  /** Name(s) of the field(s) to return cardinality information. */
  fieldNames: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
  /** Query to match documents in the index(es) (optional). */
  query: _configSchema.schema.maybe(_configSchema.schema.any()),
  /** Name of the time field in the index. */
  timeFieldName: _configSchema.schema.maybe(_configSchema.schema.string()),
  /** Earliest timestamp for search, as epoch ms (optional). */
  earliestMs: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.number(), _configSchema.schema.string()])),
  /** Latest timestamp for search, as epoch ms (optional). */
  latestMs: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.number(), _configSchema.schema.string()]))
});
exports.getCardinalityOfFieldsSchema = getCardinalityOfFieldsSchema;
const getTimeFieldRangeSchema = _configSchema.schema.object({
  /** Index or indexes for which to return the time range. */
  index: _configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())]),
  /** Name of the time field in the index. */
  timeFieldName: _configSchema.schema.maybe(_configSchema.schema.string()),
  /** Query to match documents in the index(es). */
  query: _configSchema.schema.maybe(_configSchema.schema.any()),
  /** Additional search options. */
  runtimeMappings: _runtime_mappings_schema.runtimeMappingsSchema,
  indicesOptions: _datafeeds_schema.indicesOptionsSchema,
  /** Return times from the future. */
  allowFutureTime: _configSchema.schema.maybe(_configSchema.schema.boolean())
});
exports.getTimeFieldRangeSchema = getTimeFieldRangeSchema;