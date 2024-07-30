"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateRuleRoute = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _constants = require("../../../../../../../common/constants");
var _rule_management = require("../../../../../../../common/detection_engine/rule_management");
var _rule_schema = require("../../../../../../../common/detection_engine/rule_schema");
var _authz = require("../../../../../machine_learning/authz");
var _validation = require("../../../../../machine_learning/validation");
var _utils = require("../../../../routes/utils");
var _utils2 = require("../../../utils/utils");
var _validate = require("../../../utils/validate");
var _update_rules = require("../../../logic/crud/update_rules");
var _route_validation = require("../../../../../../utils/build_validation/route_validation");
var _legacy_action_migration = require("../../../logic/rule_actions/legacy_action_migration");
var _read_rules = require("../../../logic/crud/read_rules");
var _check_for_default_rule_exception_list = require("../../../logic/exceptions/check_for_default_rule_exception_list");
var _validate_rule_default_exception_list = require("../../../logic/exceptions/validate_rule_default_exception_list");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// eslint-disable-next-line no-restricted-imports

const updateRuleRoute = (router, ml) => {
  router.put({
    path: _constants.DETECTION_ENGINE_RULES_URL,
    validate: {
      body: (0, _route_validation.buildRouteValidation)(_rule_schema.RuleUpdateProps)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const validationErrors = (0, _rule_management.validateUpdateRuleProps)(request.body);
    if (validationErrors.length) {
      return siemResponse.error({
        statusCode: 400,
        body: validationErrors
      });
    }
    try {
      const ctx = await context.resolve(['core', 'securitySolution', 'alerting', 'licensing']);
      const rulesClient = ctx.alerting.getRulesClient();
      const savedObjectsClient = ctx.core.savedObjects.client;
      const mlAuthz = (0, _authz.buildMlAuthz)({
        license: ctx.licensing.license,
        ml,
        request,
        savedObjectsClient
      });
      (0, _validation.throwAuthzError)(await mlAuthz.validateRuleType(request.body.type));
      (0, _check_for_default_rule_exception_list.checkDefaultRuleExceptionListReferences)({
        exceptionLists: request.body.exceptions_list
      });
      await (0, _validate_rule_default_exception_list.validateRuleDefaultExceptionList)({
        exceptionsList: request.body.exceptions_list,
        rulesClient,
        ruleRuleId: request.body.rule_id,
        ruleId: request.body.id
      });
      const existingRule = await (0, _read_rules.readRules)({
        rulesClient,
        ruleId: request.body.rule_id,
        id: request.body.id
      });
      const migratedRule = await (0, _legacy_action_migration.legacyMigrate)({
        rulesClient,
        savedObjectsClient,
        rule: existingRule
      });
      const rule = await (0, _update_rules.updateRules)({
        rulesClient,
        existingRule: migratedRule,
        ruleUpdate: request.body
      });
      if (rule != null) {
        const ruleExecutionLog = ctx.securitySolution.getRuleExecutionLog();
        const ruleExecutionSummary = await ruleExecutionLog.getExecutionSummary(rule.id);
        const [validated, errors] = (0, _validate.transformValidate)(rule, ruleExecutionSummary);
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
      } else {
        const error = (0, _utils2.getIdError)({
          id: request.body.id,
          ruleId: request.body.rule_id
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
exports.updateRuleRoute = updateRuleRoute;