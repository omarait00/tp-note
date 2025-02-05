"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apmInstanceRoute = apmInstanceRoute;
var _ccs_utils = require("../../../../../common/ccs_utils");
var _constants = require("../../../../../common/constants");
var _apm = require("../../../../../common/http_api/apm");
var _apm2 = require("../../../../lib/apm");
var _create_route_validation_function = require("../../../../lib/create_route_validation_function");
var _get_metrics = require("../../../../lib/details/get_metrics");
var _errors = require("../../../../lib/errors");
var _metric_set_instance = require("./metric_set_instance");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function apmInstanceRoute(server) {
  const validateParams = (0, _create_route_validation_function.createValidationFunction)(_apm.postApmInstanceRequestParamsRT);
  const validateBody = (0, _create_route_validation_function.createValidationFunction)(_apm.postApmInstanceRequestPayloadRT);
  server.route({
    method: 'post',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/apm/{apmUuid}',
    validate: {
      params: validateParams,
      body: validateBody
    },
    async handler(req) {
      const apmUuid = req.params.apmUuid;
      const config = server.config;
      const clusterUuid = req.params.clusterUuid;
      const ccs = req.payload.ccs;
      const apmIndexPattern = (0, _ccs_utils.prefixIndexPatternWithCcs)(config, _constants.INDEX_PATTERN_BEATS, ccs);
      const showCgroupMetrics = config.ui.container.apm.enabled;
      if (showCgroupMetrics) {
        const metricCpu = _metric_set_instance.metricSet.find(m => m.name === 'apm_cpu');
        if (metricCpu) {
          metricCpu.keys = ['apm_cgroup_cpu'];
        }
      }
      try {
        const [metrics, apmSummary] = await Promise.all([(0, _get_metrics.getMetrics)(req, 'beats', _metric_set_instance.metricSet, [{
          term: {
            'beats_stats.beat.uuid': apmUuid
          }
        }]), (0, _apm2.getApmInfo)(req, apmIndexPattern, {
          clusterUuid,
          apmUuid
        })]);
        return _apm.postApmInstanceResponsePayloadRT.encode({
          metrics,
          apmSummary
        });
      } catch (err) {
        return (0, _errors.handleError)(err, req);
      }
    }
  });
}