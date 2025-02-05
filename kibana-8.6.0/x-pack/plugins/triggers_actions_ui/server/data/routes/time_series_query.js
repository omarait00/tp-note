"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTimeSeriesQueryRoute = createTimeSeriesQueryRoute;
var _time_series_types = require("../lib/time_series_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createTimeSeriesQueryRoute(logger, timeSeriesQuery, router, baseRoute) {
  const path = `${baseRoute}/_time_series_query`;
  logger.debug(`registering indexThreshold route POST ${path}`);
  router.post({
    path,
    validate: {
      body: _time_series_types.TimeSeriesQuerySchema
    }
  }, handler);
  async function handler(ctx, req, res) {
    logger.debug(`route ${path} request: ${JSON.stringify(req.body)}`);
    const esClient = (await ctx.core).elasticsearch.client.asCurrentUser;
    const result = await timeSeriesQuery({
      logger,
      esClient,
      query: req.body
    });
    logger.debug(`route ${path} response: ${JSON.stringify(result)}`);
    return res.ok({
      body: result
    });
  }
}