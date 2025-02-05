"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installRiskScoresRoute = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _constants = require("../../../../../common/constants");
var _utils = require("../../../detection_engine/routes/utils");
var _install_risk_score_module = require("../helpers/install_risk_score_module");
var _schema = require("../schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const installRiskScoresRoute = (router, logger, security) => {
  router.post({
    path: _constants.INTERNAL_RISK_SCORE_URL,
    validate: _schema.onboardingRiskScoreSchema,
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const {
      riskScoreEntity
    } = request.body;
    try {
      const securitySolution = await context.securitySolution;
      const spaceId = securitySolution === null || securitySolution === void 0 ? void 0 : securitySolution.getSpaceId();
      const {
        client
      } = (await context.core).elasticsearch;
      const esClient = client.asCurrentUser;
      const res = await (0, _install_risk_score_module.installRiskScoreModule)({
        esClient,
        logger,
        riskScoreEntity,
        spaceId
      });
      return response.ok({
        body: res
      });
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};
exports.installRiskScoresRoute = installRiskScoresRoute;