"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.esPitInputSchema = exports.defineEsPitRoute = exports.DEFAULT_PIT_KEEP_ALIVE = void 0;
var _configSchema = require("@kbn/config-schema");
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DEFAULT_PIT_KEEP_ALIVE = '1m';
exports.DEFAULT_PIT_KEEP_ALIVE = DEFAULT_PIT_KEEP_ALIVE;
const esPitInputSchema = _configSchema.schema.object({
  index_name: _configSchema.schema.string(),
  keep_alive: _configSchema.schema.string({
    defaultValue: DEFAULT_PIT_KEEP_ALIVE
  })
});
exports.esPitInputSchema = esPitInputSchema;
const defineEsPitRoute = router => router.post({
  path: _constants.ES_PIT_ROUTE_PATH,
  validate: {
    query: esPitInputSchema
  },
  options: {
    tags: ['access:cloud-security-posture-read']
  }
}, async (context, request, response) => {
  const cspContext = await context.csp;
  if (!(await context.fleet).authz.fleet.all) {
    return response.forbidden();
  }
  try {
    const esClient = cspContext.esClient.asCurrentUser;
    const {
      id
    } = await esClient.openPointInTime({
      index: request.query.index_name,
      keep_alive: request.query.keep_alive
    });
    return response.ok({
      body: id
    });
  } catch (err) {
    const error = (0, _securitysolutionEsUtils.transformError)(err);
    cspContext.logger.error(`Failed to open Elasticsearch point in time: ${error}`);
    return response.customError({
      body: {
        message: error.message
      },
      statusCode: error.statusCode
    });
  }
});
exports.defineEsPitRoute = defineEsPitRoute;