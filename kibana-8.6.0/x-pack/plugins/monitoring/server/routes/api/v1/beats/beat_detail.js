"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.beatsDetailRoute = beatsDetailRoute;
var _ccs_utils = require("../../../../../common/ccs_utils");
var _constants = require("../../../../../common/constants");
var _beats = require("../../../../../common/http_api/beats");
var _beats2 = require("../../../../lib/beats");
var _create_route_validation_function = require("../../../../lib/create_route_validation_function");
var _get_metrics = require("../../../../lib/details/get_metrics");
var _errors = require("../../../../lib/errors");
var _metric_set_detail = require("./metric_set_detail");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function beatsDetailRoute(server) {
  const validateParams = (0, _create_route_validation_function.createValidationFunction)(_beats.postBeatDetailRequestParamsRT);
  const validateBody = (0, _create_route_validation_function.createValidationFunction)(_beats.postBeatDetailRequestPayloadRT);
  server.route({
    method: 'post',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/beats/beat/{beatUuid}',
    validate: {
      params: validateParams,
      body: validateBody
    },
    async handler(req) {
      const clusterUuid = req.params.clusterUuid;
      const beatUuid = req.params.beatUuid;
      const config = server.config;
      const ccs = req.payload.ccs;
      const beatsIndexPattern = (0, _ccs_utils.prefixIndexPatternWithCcs)(config, _constants.INDEX_PATTERN_BEATS, ccs);
      const summaryOptions = {
        clusterUuid,
        beatUuid,
        start: req.payload.timeRange.min,
        end: req.payload.timeRange.max
      };
      try {
        const [summary, metrics] = await Promise.all([(0, _beats2.getBeatSummary)(req, beatsIndexPattern, summaryOptions), (0, _get_metrics.getMetrics)(req, 'beats', _metric_set_detail.metricSet, [{
          term: {
            'beats_stats.beat.uuid': beatUuid
          }
        }])]);
        return _beats.postBeatDetailResponsePayloadRT.encode({
          summary,
          metrics
        });
      } catch (err) {
        throw (0, _errors.handleError)(err, req);
      }
    }
  });
}