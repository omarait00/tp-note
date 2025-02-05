"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerStatsRoutes = registerStatsRoutes;
var _get_sync_jobs = require("../../lib/stats/get_sync_jobs");
var _elasticsearch_error_handler = require("../../utils/elasticsearch_error_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerStatsRoutes({
  enterpriseSearchRequestHandler,
  log,
  router
}) {
  router.get({
    path: '/internal/enterprise_search/stats/sync_jobs',
    validate: {}
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const {
      client
    } = (await context.core).elasticsearch;
    const body = await (0, _get_sync_jobs.fetchSyncJobsStats)(client);
    return response.ok({
      body
    });
  }));
  router.get({
    path: '/internal/enterprise_search/stats/cloud_health',
    validate: {}
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    var _entSearchResponse$pa, _entSearchResponse$pa2, _entSearchResponse$pa3;
    const MIN_MEMORY = 1289748481;
    const entSearchResponse = await enterpriseSearchRequestHandler.createRequest({
      path: '/api/ent/v1/internal/health'
    })(context, request, response);
    const hasMinConnectorMemory = ((_entSearchResponse$pa = entSearchResponse.payload) === null || _entSearchResponse$pa === void 0 ? void 0 : (_entSearchResponse$pa2 = _entSearchResponse$pa.jvm) === null || _entSearchResponse$pa2 === void 0 ? void 0 : (_entSearchResponse$pa3 = _entSearchResponse$pa2.memory_usage) === null || _entSearchResponse$pa3 === void 0 ? void 0 : _entSearchResponse$pa3.heap_max) > MIN_MEMORY;
    return response.ok({
      body: {
        has_min_connector_memory: hasMinConnectorMemory
      }
    });
  }));
}