"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.entSearchOverviewRoute = entSearchOverviewRoute;
var _enterprise_search = require("../../../../../common/http_api/enterprise_search");
var _create_route_validation_function = require("../../../../lib/create_route_validation_function");
var _get_metrics = require("../../../../lib/details/get_metrics");
var _enterprise_search2 = require("../../../../lib/enterprise_search");
var _errors = require("../../../../lib/errors");
var _metric_set_overview = require("./metric_set_overview");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function entSearchOverviewRoute(server) {
  const validateParams = (0, _create_route_validation_function.createValidationFunction)(_enterprise_search.postEnterpriseSearchOverviewRequestParamsRT);
  const validateBody = (0, _create_route_validation_function.createValidationFunction)(_enterprise_search.postEnterpriseSearchOverviewRequestPayloadRT);
  server.route({
    method: 'post',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/enterprise_search',
    validate: {
      params: validateParams,
      body: validateBody
    },
    async handler(req) {
      const clusterUuid = req.params.clusterUuid;
      try {
        const [stats, metrics] = await Promise.all([(0, _enterprise_search2.getStats)(req, clusterUuid), (0, _get_metrics.getMetrics)(req, 'enterprise_search', _metric_set_overview.metricSet, [], {
          skipClusterUuidFilter: true
        })]);
        return _enterprise_search.postEnterpriseSearchOverviewResponsePayloadRT.encode({
          stats,
          metrics
        });
      } catch (err) {
        return (0, _errors.handleError)(err, req);
      }
    }
  });
}