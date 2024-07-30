"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRuleRoute = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _constants = require("../../../../../../../common/constants");
var _rule_management = require("../../../../../../../common/detection_engine/rule_management");
var _rule_schema = require("../../../../../../../common/detection_engine/rule_schema");
var _route_validation = require("../../../../../../utils/build_validation/route_validation");
var _authz = require("../../../../../machine_learning/authz");
var _validation = require("../../../../../machine_learning/validation");
var _read_rules = require("../../../logic/crud/read_rules");
var _utils = require("../../../../routes/utils");
var _create_rules = require("../../../logic/crud/create_rules");
var _check_for_default_rule_exception_list = require("../../../logic/exceptions/check_for_default_rule_exception_list");
var _validate_rule_default_exception_list = require("../../../logic/exceptions/validate_rule_default_exception_list");
var _validate = require("../../../utils/validate");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createRuleRoute = (router, ml) => {
  router.post({
    path: _constants.DETECTION_ENGINE_RULES_URL,
    validate: {
      body: (0, _route_validation.buildRouteValidation)(_rule_schema.RuleCreateProps)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const validationErrors = (0, _rule_management.validateCreateRuleProps)(request.body);
    if (validationErrors.length) {
      return siemResponse.error({
        statusCode: 400,
        body: validationErrors
      });
    }
    try {
      var _ctx$lists;
      const ctx = await context.resolve(['core', 'securitySolution', 'licensing', 'alerting', 'lists']);
      const rulesClient = ctx.alerting.getRulesClient();
      const ruleExecutionLog = ctx.securitySolution.getRuleExecutionLog();
      const savedObjectsClient = ctx.core.savedObjects.client;
      const exceptionsClient = (_ctx$lists = ctx.lists) === null || _ctx$lists === void 0 ? void 0 : _ctx$lists.getExceptionListClient();
      if (request.body.rule_id != null) {
        const rule = await (0, _read_rules.readRules)({
          rulesClient,
          ruleId: request.body.rule_id,
          id: undefined
        });
        if (rule != null) {
          return siemResponse.error({
            statusCode: 409,
            body: `rule_id: "${request.body.rule_id}" already exists`
          });
        }
      }
      const mlAuthz = (0, _authz.buildMlAuthz)({
        license: ctx.licensing.license,
        ml,
        request,
        savedObjectsClient
      });
      (0, _validation.throwAuthzError)(await mlAuthz.validateRuleType(request.body.type));

      // This will create the endpoint list if it does not exist yet
      await (exceptionsClient === null || exceptionsClient === void 0 ? void 0 : exceptionsClient.createEndpointList());
      (0, _check_for_default_rule_exception_list.checkDefaultRuleExceptionListReferences)({
        exceptionLists: request.body.exceptions_list
      });
      await (0, _validate_rule_default_exception_list.validateRuleDefaultExceptionList)({
        exceptionsList: request.body.exceptions_list,
        rulesClient,
        ruleRuleId: undefined,
        ruleId: undefined
      });
      const createdRule = await (0, _create_rules.createRules)({
        rulesClient,
        params: request.body
      });
      const ruleExecutionSummary = await ruleExecutionLog.getExecutionSummary(createdRule.id);
      const [validated, errors] = (0, _validate.transformValidate)(createdRule, ruleExecutionSummary);
      if (errors != null) {
        return siemResponse.error({
          statusCode: 500,
          body: errors
        });
      } else {
        return response.ok({
          body: validated !== null && validated !== void 0 ? validated : {}
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
exports.createRuleRoute = createRuleRoute;