"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.beatsListingRoute = beatsListingRoute;
var _ccs_utils = require("../../../../../common/ccs_utils");
var _constants = require("../../../../../common/constants");
var _beats = require("../../../../../common/http_api/beats");
var _beats2 = require("../../../../lib/beats");
var _create_route_validation_function = require("../../../../lib/create_route_validation_function");
var _errors = require("../../../../lib/errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function beatsListingRoute(server) {
  const validateParams = (0, _create_route_validation_function.createValidationFunction)(_beats.postBeatsListingRequestParamsRT);
  const validateBody = (0, _create_route_validation_function.createValidationFunction)(_beats.postBeatsListingRequestPayloadRT);
  server.route({
    method: 'post',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/beats/beats',
    validate: {
      params: validateParams,
      body: validateBody
    },
    async handler(req) {
      const config = server.config;
      const ccs = req.payload.ccs;
      const clusterUuid = req.params.clusterUuid;
      const beatsIndexPattern = (0, _ccs_utils.prefixIndexPatternWithCcs)(config, _constants.INDEX_PATTERN_BEATS, ccs);
      try {
        const [stats, listing] = await Promise.all([(0, _beats2.getStats)(req, beatsIndexPattern, clusterUuid), (0, _beats2.getBeats)(req, beatsIndexPattern, clusterUuid)]);
        return _beats.postBeatsListingResponsePayloadRT.encode({
          stats,
          listing
        });
      } catch (err) {
        throw (0, _errors.handleError)(err, req);
      }
    }
  });
}