"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readRuleRoute = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _constants = require("../../../../../../../common/constants");
var _rule_management = require("../../../../../../../common/detection_engine/rule_management");
var _route_validation = require("../../../../../../utils/build_validation/route_validation");
var _utils = require("../../../../routes/utils");
var _utils2 = require("../../../utils/utils");
var _read_rules = require("../../../logic/crud/read_rules");
var _rule_actions_legacy = require("../../../../rule_actions_legacy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// eslint-disable-next-line no-restricted-imports

const readRuleRoute = (router, logger) => {
  router.get({
    path: _constants.DETECTION_ENGINE_RULES_URL,
    validate: {
      query: (0, _route_validation.buildRouteValidation)(_rule_management.QueryRuleByIds)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const validationErrors = (0, _rule_management.validateQueryRuleByIds)(request.query);
    if (validationErrors.length) {
      return siemResponse.error({
        statusCode: 400,
        body: validationErrors
      });
    }
    const {
      id,
      rule_id: ruleId
    } = request.query;
    try {
      const rulesClient = (await context.alerting).getRulesClient();
      const ruleExecutionLog = (await context.securitySolution).getRuleExecutionLog();
      const savedObjectsClient = (await context.core).savedObjects.client;
      const rule = await (0, _read_rules.readRules)({
        id,
        rulesClient,
        ruleId
      });
      if (rule != null) {
        const legacyRuleActions = await (0, _rule_actions_legacy.legacyGetRuleActionsSavedObject)({
          savedObjectsClient,
          ruleAlertId: rule.id,
          logger
        });
        const ruleExecutionSummary = await ruleExecutionLog.getExecutionSummary(rule.id);
        const transformed = (0, _utils2.transform)(rule, ruleExecutionSummary, legacyRuleActions);
        if (transformed == null) {
          return siemResponse.error({
            statusCode: 500,
            body: 'Internal error transforming'
          });
        } else {
          return response.ok({
            body: transformed !== null && transformed !== void 0 ? transformed : {}
          });
        }
      } else {
        const error = (0, _utils2.getIdError)({
          id,
          ruleId
        });
        return siemResponse.error({
          body: error.message,
          statusCode: error.statusCode
        });
      }
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};
exports.readRuleRoute = readRuleRoute;