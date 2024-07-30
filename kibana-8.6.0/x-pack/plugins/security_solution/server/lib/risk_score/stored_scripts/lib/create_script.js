"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStoredScriptBodySchema = exports.createStoredScript = void 0;
var _configSchema = require("@kbn/config-schema");
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createStoredScriptBodySchema = _configSchema.schema.object({
  id: _configSchema.schema.string({
    minLength: 1
  }),
  script: _configSchema.schema.object({
    lang: _configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.literal('painless'), _configSchema.schema.literal('expression'), _configSchema.schema.literal('mustache'), _configSchema.schema.literal('java')]),
    options: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.string())),
    source: _configSchema.schema.string()
  })
});
exports.createStoredScriptBodySchema = createStoredScriptBodySchema;
const createStoredScript = async ({
  esClient,
  logger,
  options
}) => {
  try {
    await esClient.putScript(options);
    return {
      [options.id]: {
        success: true,
        error: null
      }
    };
  } catch (error) {
    const createScriptError = (0, _securitysolutionEsUtils.transformError)(error);
    logger.error(`Failed to create stored script: ${options.id}: ${createScriptError.message}`);
    return {
      [options.id]: {
        success: false,
        error: createScriptError
      }
    };
  }
};
exports.createStoredScript = createStoredScript;