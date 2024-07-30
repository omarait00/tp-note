"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apmInstancesRoute = apmInstancesRoute;
var _ccs_utils = require("../../../../../common/ccs_utils");
var _constants = require("../../../../../common/constants");
var _apm = require("../../../../../common/http_api/apm");
var _apm2 = require("../../../../lib/apm");
var _create_route_validation_function = require("../../../../lib/create_route_validation_function");
var _errors = require("../../../../lib/errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function apmInstancesRoute(server) {
  const validateParams = (0, _create_route_validation_function.createValidationFunction)(_apm.postApmInstancesRequestParamsRT);
  const validateBody = (0, _create_route_validation_function.createValidationFunction)(_apm.postApmInstancesRequestPayloadRT);
  server.route({
    method: 'post',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/apm/instances',
    validate: {
      params: validateParams,
      body: validateBody
    },
    async handler(req) {
      const config = server.config;
      const ccs = req.payload.ccs;
      const clusterUuid = req.params.clusterUuid;
      const apmIndexPattern = (0, _ccs_utils.prefixIndexPatternWithCcs)(config, _constants.INDEX_PATTERN_BEATS, ccs);
      try {
        const [stats, apms] = await Promise.all([(0, _apm2.getStats)(req, apmIndexPattern, clusterUuid), (0, _apm2.getApms)(req, apmIndexPattern, clusterUuid)]);
        return _apm.postApmInstancesResponsePayloadRT.encode({
          stats,
          apms,
          cgroup: config.ui.container.apm.enabled
        });
      } catch (err) {
        return (0, _errors.handleError)(err, req);
      }
    }
  });
}