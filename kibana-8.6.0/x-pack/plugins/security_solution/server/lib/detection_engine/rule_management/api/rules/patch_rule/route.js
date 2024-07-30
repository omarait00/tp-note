"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchRuleRoute = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _constants = require("../../../../../../../common/constants");
var _rule_management = require("../../../../../../../common/detection_engine/rule_management");
var _route_validation = require("../../../../../../utils/build_validation/route_validation");
var _authz = require("../../../../../machine_learning/authz");
var _validation = require("../../../../../machine_learning/validation");
var _utils = require("../../../../routes/utils");
var _read_rules = require("../../../logic/crud/read_rules");
var _patch_rules = require("../../../logic/crud/patch_rules");
var _check_for_default_rule_exception_list = require("../../../logic/exceptions/check_for_default_rule_exception_list");
var _validate_rule_default_exception_list = require("../../../logic/exceptions/validate_rule_default_exception_list");
var _legacy_action_migration = require("../../../logic/rule_actions/legacy_action_migration");
var _utils2 = require("../../../utils/utils");
var _validate = require("../../../utils/validate");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// eslint-disable-next-line no-restricted-imports

const patchRuleRoute = (router, ml) => {
  router.patch({
    path: _constants.DETECTION_ENGINE_RULES_URL,
    validate: {
      // Use non-exact validation because everything is optional in patch - since everything is optional,
      // io-ts can't find the right schema from the type specific union and the exact check breaks.
      // We do type specific validation after fetching the existing rule so we know the rule type.
      body: (0, _route_validation.buildRouteValidationNonExact)(_rule_management.PatchRuleRequestBody)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const validationErrors = (0, _rule_management.validatePatchRuleRequestBody)(request.body);
    if (validationErrors.length) {
      return siemResponse.error({
        statusCode: 400,
        body: validationErrors
      });
    }
    try {
      const params = request.body;
      const rulesClient = (await context.alerting).getRulesClient();
      const ruleExecutionLog = (await context.securitySolution).getRuleExecutionLog();
      const savedObjectsClient = (await context.core).savedObjects.client;
      const mlAuthz = (0, _authz.buildMlAuthz)({
        license: (await context.licensing).license,
        ml,
        request,
        savedObjectsClient
      });
      if (params.type) {
        // reject an unauthorized "promotion" to ML
        (0, _validation.throwAuthzError)(await mlAuthz.validateRuleType(params.type));
      }
      const existingRule = await (0, _read_rules.readRules)({
        rulesClient,
        ruleId: params.rule_id,
        id: params.id
      });
      if (existingRule !== null && existingRule !== void 0 && existingRule.params.type) {
        // reject an unauthorized modification of an ML rule
        (0, _validation.throwAuthzError)(await mlAuthz.validateRuleType(existingRule === null || existingRule === void 0 ? void 0 : existingRule.params.type));
      }
      (0, _check_for_default_rule_exception_list.checkDefaultRuleExceptionListReferences)({
        exceptionLists: params.exceptions_list
      });
      await (0, _validate_rule_default_exception_list.validateRuleDefaultExceptionList)({
        exceptionsList: params.exceptions_list,
        rulesClient,
        ruleRuleId: params.rule_id,
        ruleId: params.id
      });
      const migratedRule = await (0, _legacy_action_migration.legacyMigrate)({
        rulesClient,
        savedObjectsClient,
        rule: existingRule
      });
      const rule = await (0, _patch_rules.patchRules)({
        rulesClient,
        existingRule: migratedRule,
        nextParams: params
      });
      if (rule != null && rule.enabled != null && rule.name != null) {
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
          id: params.id,
          ruleId: params.rule_id
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
exports.patchRuleRoute = patchRuleRoute;