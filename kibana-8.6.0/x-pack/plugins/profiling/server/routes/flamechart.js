"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerFlameChartSearchRoute = registerFlameChartSearchRoute;
var _configSchema = require("@kbn/config-schema");
var _common = require("../../common");
var _callee = require("../../common/callee");
var _handle_route_error_handler = require("../utils/handle_route_error_handler");
var _flamegraph = require("../../common/flamegraph");
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

function registerFlameChartSearchRoute({
  router,
  logger
}) {
  const paths = (0, _common.getRoutePaths)();
  router.get({
    path: paths.Flamechart,
    validate: {
      query: _configSchema.schema.object({
        timeFrom: _configSchema.schema.number(),
        timeTo: _configSchema.schema.number(),
        kuery: _configSchema.schema.string()
      })
    }
  }, async (context, request, response) => {
    const {
      timeFrom,
      timeTo,
      kuery
    } = request.query;
    const targetSampleSize = 20000; // minimum number of samples to get statistically sound results

    try {
      const esClient = await (0, _compat.getClient)(context);
      const filter = (0, _query.createCommonFilter)({
        timeFrom,
        timeTo,
        kuery
      });
      const totalSeconds = timeTo - timeFrom;
      const {
        stackTraceEvents,
        stackTraces,
        executables,
        stackFrames,
        totalFrames
      } = await (0, _get_executables_and_stacktraces.getExecutablesAndStackTraces)({
        logger,
        client: (0, _create_profiling_es_client.createProfilingEsClient)({
          request,
          esClient
        }),
        filter,
        sampleSize: targetSampleSize
      });
      const flamegraph = await (0, _with_profiling_span.withProfilingSpan)('create_flamegraph', async () => {
        const t0 = Date.now();
        const tree = (0, _callee.createCalleeTree)(stackTraceEvents, stackTraces, stackFrames, executables, totalFrames);
        logger.info(`creating callee tree took ${Date.now() - t0} ms`);
        const t1 = Date.now();
        const fg = (0, _flamegraph.createBaseFlameGraph)(tree, totalSeconds);
        logger.info(`creating flamegraph took ${Date.now() - t1} ms`);
        return fg;
      });
      logger.info('returning payload response to client');
      return response.ok({
        body: flamegraph
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