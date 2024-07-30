"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createIndex = exports.createEsIndexBodySchema = void 0;
var _configSchema = require("@kbn/config-schema");
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createEsIndexBodySchema = _configSchema.schema.object({
  index: _configSchema.schema.string({
    minLength: 1
  }),
  mappings: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.recordOf(_configSchema.schema.string({
    minLength: 1
  }), _configSchema.schema.any())]))
});
exports.createEsIndexBodySchema = createEsIndexBodySchema;
const createIndex = async ({
  esClient,
  logger,
  options
}) => {
  try {
    await esClient.indices.create({
      index: options.index,
      mappings: typeof options.mappings === 'string' ? JSON.parse(options.mappings) : options.mappings
    });
    return {
      [options.index]: {
        success: true,
        error: null
      }
    };
  } catch (err) {
    const error = (0, _securitysolutionEsUtils.transformError)(err);
    logger.error(`Failed to create index: ${options.index}: ${error.message}`);
    return {
      [options.index]: {
        success: false,
        error
      }
    };
  }
};
exports.createIndex = createIndex;