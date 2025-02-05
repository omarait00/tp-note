"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRiskScoreIndexStatusRoute = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _constants = require("../../../../common/constants");
var _route_validation = require("../../../utils/build_validation/route_validation");
var _utils = require("../../detection_engine/routes/utils");
var _schema = require("./schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getRiskScoreIndexStatusRoute = router => {
  router.get({
    path: _constants.RISK_SCORE_INDEX_STATUS_API_URL,
    validate: {
      query: (0, _route_validation.buildRouteValidation)(_schema.indexStatusSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const coreContext = await context.core;
    const {
      indexName,
      entity
    } = request.query;
    try {
      const newFieldName = `${entity}.risk.calculated_level`;
      const res = await coreContext.elasticsearch.client.asCurrentUser.fieldCaps({
        index: indexName,
        fields: newFieldName,
        ignore_unavailable: true,
        allow_no_indices: false
      });
      const isDeprecated = !Object.keys(res.fields).includes(newFieldName);
      return response.ok({
        body: {
          isDeprecated,
          isEnabled: true
        }
      });
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      if (error.statusCode === 404) {
        // index does not exist, therefore cannot be deprecated
        return response.ok({
          body: {
            isDeprecated: false,
            isEnabled: false
          }
        });
      }
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};
exports.getRiskScoreIndexStatusRoute = getRiskScoreIndexStatusRoute;