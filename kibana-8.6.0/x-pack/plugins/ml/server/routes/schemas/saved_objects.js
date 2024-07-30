"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateTrainedModelsSpaces = exports.updateJobsSpaces = exports.syncJobObjects = exports.syncCheckSchema = exports.jobTypeLiterals = exports.itemsAndCurrentSpace = exports.itemTypeSchema = exports.itemTypeLiterals = exports.canDeleteMLSpaceAwareItemsSchema = void 0;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const jobTypeLiterals = _configSchema.schema.oneOf([_configSchema.schema.literal('anomaly-detector'), _configSchema.schema.literal('data-frame-analytics')]);
exports.jobTypeLiterals = jobTypeLiterals;
const itemTypeLiterals = _configSchema.schema.oneOf([_configSchema.schema.literal('anomaly-detector'), _configSchema.schema.literal('data-frame-analytics'), _configSchema.schema.literal('trained-model')]);
exports.itemTypeLiterals = itemTypeLiterals;
const itemTypeSchema = _configSchema.schema.object({
  jobType: itemTypeLiterals
});
exports.itemTypeSchema = itemTypeSchema;
const updateJobsSpaces = _configSchema.schema.object({
  jobType: jobTypeLiterals,
  jobIds: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  spacesToAdd: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  spacesToRemove: _configSchema.schema.arrayOf(_configSchema.schema.string())
});
exports.updateJobsSpaces = updateJobsSpaces;
const updateTrainedModelsSpaces = _configSchema.schema.object({
  modelIds: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  spacesToAdd: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  spacesToRemove: _configSchema.schema.arrayOf(_configSchema.schema.string())
});
exports.updateTrainedModelsSpaces = updateTrainedModelsSpaces;
const itemsAndCurrentSpace = _configSchema.schema.object({
  mlSavedObjectType: itemTypeLiterals,
  ids: _configSchema.schema.arrayOf(_configSchema.schema.string())
});
exports.itemsAndCurrentSpace = itemsAndCurrentSpace;
const syncJobObjects = _configSchema.schema.object({
  simulate: _configSchema.schema.maybe(_configSchema.schema.boolean())
});
exports.syncJobObjects = syncJobObjects;
const syncCheckSchema = _configSchema.schema.object({
  mlSavedObjectType: _configSchema.schema.maybe(_configSchema.schema.string())
});
exports.syncCheckSchema = syncCheckSchema;
const canDeleteMLSpaceAwareItemsSchema = _configSchema.schema.object({
  /** List of job or trained model IDs. */
  ids: _configSchema.schema.arrayOf(_configSchema.schema.string())
});
exports.canDeleteMLSpaceAwareItemsSchema = canDeleteMLSpaceAwareItemsSchema;