"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = exports.configSchema = exports.config = exports.CURRENT_CONNECTORS_INDEX = exports.CRAWLERS_INDEX = exports.CONNECTORS_VERSION = exports.CONNECTORS_JOBS_INDEX = exports.CONNECTORS_INDEX = exports.ANALYTICS_VERSION = exports.ANALYTICS_COLLECTIONS_INDEX = void 0;
var _configSchema = require("@kbn/config-schema");
var _plugin = require("./plugin");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const plugin = initializerContext => {
  return new _plugin.EnterpriseSearchPlugin(initializerContext);
};
exports.plugin = plugin;
const configSchema = _configSchema.schema.object({
  accessCheckTimeout: _configSchema.schema.number({
    defaultValue: 5000
  }),
  accessCheckTimeoutWarning: _configSchema.schema.number({
    defaultValue: 300
  }),
  customHeaders: _configSchema.schema.maybe(_configSchema.schema.object({}, {
    unknowns: 'allow'
  })),
  host: _configSchema.schema.maybe(_configSchema.schema.string()),
  ssl: _configSchema.schema.object({
    certificateAuthorities: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.arrayOf(_configSchema.schema.string(), {
      minSize: 1
    }), _configSchema.schema.string()])),
    verificationMode: _configSchema.schema.oneOf([_configSchema.schema.literal('none'), _configSchema.schema.literal('certificate'), _configSchema.schema.literal('full')], {
      defaultValue: 'full'
    })
  })
});
exports.configSchema = configSchema;
const config = {
  exposeToBrowser: {
    host: true
  },
  schema: configSchema
};
exports.config = config;
const CONNECTORS_INDEX = '.elastic-connectors';
exports.CONNECTORS_INDEX = CONNECTORS_INDEX;
const CURRENT_CONNECTORS_INDEX = '.elastic-connectors-v1';
exports.CURRENT_CONNECTORS_INDEX = CURRENT_CONNECTORS_INDEX;
const CONNECTORS_JOBS_INDEX = '.elastic-connectors-sync-jobs';
exports.CONNECTORS_JOBS_INDEX = CONNECTORS_JOBS_INDEX;
const CONNECTORS_VERSION = 1;
exports.CONNECTORS_VERSION = CONNECTORS_VERSION;
const CRAWLERS_INDEX = '.ent-search-actastic-crawler2_configurations_v2';
exports.CRAWLERS_INDEX = CRAWLERS_INDEX;
const ANALYTICS_COLLECTIONS_INDEX = '.elastic-analytics-collections';
exports.ANALYTICS_COLLECTIONS_INDEX = ANALYTICS_COLLECTIONS_INDEX;
const ANALYTICS_VERSION = '1';
exports.ANALYTICS_VERSION = ANALYTICS_VERSION;