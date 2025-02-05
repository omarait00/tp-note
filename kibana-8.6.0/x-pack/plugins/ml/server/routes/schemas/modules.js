"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupModuleBodySchema = exports.optionalModuleIdParamSchema = exports.modulesIndexPatternTitleSchema = exports.moduleIdParamSchema = void 0;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const setupModuleBodySchema = _configSchema.schema.object({
  /**
   * Job ID prefix. This will be added to the start of the ID every job created by the module (optional).
   */
  prefix: _configSchema.schema.maybe(_configSchema.schema.string()),
  /**
   * List of group IDs. This will override the groups assigned to each job created by the module (optional).
   */
  groups: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
  /**
   * Name of kibana index pattern. Overrides the index used in each datafeed and each index pattern
   * used in the custom urls and saved objects created by the module. A matching index pattern must
   * exist in kibana if the module contains custom urls or saved objects which rely on an index pattern ID.
   * If the module does not contain custom urls or saved objects which require an index pattern ID, the
   * indexPatternName can be any index name or pattern that will match an ES index. It can also be a comma
   * separated list of names. If no indexPatternName is supplied, the default index pattern specified in
   * the manifest.json will be used (optional).
   */
  indexPatternName: _configSchema.schema.maybe(_configSchema.schema.string()),
  /**
   * ES Query DSL object. Overrides the query object for each datafeed created by the module (optional).
   */
  query: _configSchema.schema.maybe(_configSchema.schema.any()),
  /**
   * Flag to specify that each job created by the module uses a dedicated index (optional).
   */
  useDedicatedIndex: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  /**
   * Flag to specify that each datafeed created by the module is started once saved. Defaults to <code>false</code> (optional).
   */
  startDatafeed: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  /**
   * Start date for datafeed. Specified in epoch seconds. Only used if startDatafeed is true.
   * If not specified, a value of 0 is used i.e. start at the beginning of the data (optional).
   */
  start: _configSchema.schema.maybe(_configSchema.schema.number()),
  /**
   * End date for datafeed. Specified in epoch seconds. Only used if startDatafeed is true.
   * If not specified, the datafeed will continue to run in real time (optional).
   */
  end: _configSchema.schema.maybe(_configSchema.schema.number()),
  /**
   * Partial job configuration which will override jobs contained in the module. Can be an array of objects.
   * If a <code>job_id</code> is specified, only that job in the module will be overridden.
   * Applied before any of the existing
   * overridable options (e.g. useDedicatedIndex, groups, indexPatternName etc)
   * and so can be overridden themselves (optional).
   */
  jobOverrides: _configSchema.schema.maybe(_configSchema.schema.any()),
  /**
   * Partial datafeed configuration which will override datafeeds contained in the module.
   * Can be an array of objects.
   * If a datafeed_id or a job_id is specified,
   * only that datafeed in the module will be overridden. Applied before any of the existing
   * overridable options (e.g. useDedicatedIndex, groups, indexPatternName etc)
   * and so can be overridden themselves (optional).
   */
  datafeedOverrides: _configSchema.schema.maybe(_configSchema.schema.any()),
  /**
   * Indicates whether an estimate of the model memory limit
   * should be made by checking the cardinality of fields in the job configurations (optional).
   */
  estimateModelMemory: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  /**
   * Add each job created to the * space (optional)
   */
  applyToAllSpaces: _configSchema.schema.maybe(_configSchema.schema.boolean())
});
exports.setupModuleBodySchema = setupModuleBodySchema;
const optionalModuleIdParamSchema = _configSchema.schema.object({
  /**
   * ID of the module.
   */
  moduleId: _configSchema.schema.maybe(_configSchema.schema.string())
});
exports.optionalModuleIdParamSchema = optionalModuleIdParamSchema;
const moduleIdParamSchema = _configSchema.schema.object({
  /**
   * ID of the module.
   */
  moduleId: _configSchema.schema.string()
});
exports.moduleIdParamSchema = moduleIdParamSchema;
const modulesIndexPatternTitleSchema = _configSchema.schema.object({
  /**
   * Index pattern to recognize. Note that this does not need to be a Kibana
   * index pattern, and can be the name of a single Elasticsearch index,
   * or include a wildcard (*) to match multiple indices.
   */
  indexPatternTitle: _configSchema.schema.string()
});
exports.modulesIndexPatternTitleSchema = modulesIndexPatternTitleSchema;