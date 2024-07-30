"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTopNFunctionsSearchRoute = registerTopNFunctionsSearchRoute;
var _configSchema = require("@kbn/config-schema");
var _common = require("../../common");
var _functions = require("../../common/functions");
var _handle_route_error_handler = require("../utils/handle_route_error_handler");
var _create_profiling_es_client = require("../utils/create_profiling_es_client");
var _with_profiling_span = require("../utils/with_profiling_span");
var _compat = require("./compat");
var _get_executables_and_stacktraces = require("./get_executables_and_stacktraces");
var _query = require("./query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const querySchema = _configSchema.schema.object({
  timeFrom: _configSchema.schema.number(),
  timeTo: _configSchema.schema.number(),
  startIndex: _configSchema.schema.number(),
  endIndex: _configSchema.schema.number(),
  kuery: _configSchema.schema.string()
});
function registerTopNFunctionsSearchRoute({
  router,
  logger
}) {
  const paths = (0, _common.getRoutePaths)();
  router.get({
    path: paths.TopNFunctions,
    validate: {
      query: querySchema
    }
  }, async (context, request, response) => {
    try {
      const {
        timeFrom,
        timeTo,
        startIndex,
        endIndex,
        kuery
      } = request.query;
      const targetSampleSize = 20000; // minimum number of samples to get statistically sound results
      const esClient = await (0, _compat.getClient)(context);
      const filter = (0, _query.createCommonFilter)({
        timeFrom,
        timeTo,
        kuery
      });
      const {
        stackFrames,
        stackTraceEvents,
        stackTraces,
        executables
      } = await (0, _get_executables_and_stacktraces.getExecutablesAndStackTraces)({
        client: (0, _create_profiling_es_client.createProfilingEsClient)({
          request,
          esClient
        }),
        filter,
        logger,
        sampleSize: targetSampleSize
      });
      const t0 = Date.now();
      const topNFunctions = await (0, _with_profiling_span.withProfilingSpan)('create_topn_functions', async () => {
        return (0, _functions.createTopNFunctions)(stackTraceEvents, stackTraces, stackFrames, executables, startIndex, endIndex);
      });
      logger.info(`creating topN functions took ${Date.now() - t0} ms`);
      logger.info('returning payload response to client');
      return response.ok({
        body: topNFunctions
      });
    } catch (error) {
      return (0, _handle_route_error_handler.handleRouteHandlerError)({
        error,
        logger,
        response
      });
    }
  });
}