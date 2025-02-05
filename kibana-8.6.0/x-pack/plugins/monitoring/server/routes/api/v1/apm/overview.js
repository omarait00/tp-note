"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apmOverviewRoute = apmOverviewRoute;
var _apm = require("../../../../../common/http_api/apm");
var _create_route_validation_function = require("../../../../lib/create_route_validation_function");
var _get_metrics = require("../../../../lib/details/get_metrics");
var _errors = require("../../../../lib/errors");
var _metric_set_overview = require("./metric_set_overview");
var _get_apm_cluster_status = require("./_get_apm_cluster_status");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function apmOverviewRoute(server) {
  const validateParams = (0, _create_route_validation_function.createValidationFunction)(_apm.postApmOverviewRequestParamsRT);
  const validateBody = (0, _create_route_validation_function.createValidationFunction)(_apm.postApmOverviewRequestPayloadRT);
  server.route({
    method: 'post',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/apm',
    validate: {
      params: validateParams,
      body: validateBody
    },
    async handler(req) {
      const config = server.config;
      const clusterUuid = req.params.clusterUuid;
      const showCgroupMetrics = config.ui.container.apm.enabled;
      if (showCgroupMetrics) {
        const metricCpu = _metric_set_overview.metricSet.find(m => m.name === 'apm_cpu');
        if (metricCpu) {
          metricCpu.keys = ['apm_cgroup_cpu'];
        }
      }
      try {
        const [stats, metrics] = await Promise.all([(0, _get_apm_cluster_status.getApmClusterStatus)(req, {
          clusterUuid
        }), (0, _get_metrics.getMetrics)(req, 'beats', _metric_set_overview.metricSet)]);
        return _apm.postApmOverviewResponsePayloadRT.encode({
          stats,
          metrics
        });
      } catch (err) {
        return (0, _errors.handleError)(err, req);
      }
    }
  });
}