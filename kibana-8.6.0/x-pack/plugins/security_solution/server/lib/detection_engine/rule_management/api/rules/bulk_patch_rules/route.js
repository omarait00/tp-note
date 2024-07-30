"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkPatchRulesRoute = void 0;
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _constants = require("../../../../../../../common/constants");
var _rule_management = require("../../../../../../../common/detection_engine/rule_management");
var _route_validation = require("../../../../../../utils/build_validation/route_validation");
var _authz = require("../../../../../machine_learning/authz");
var _validation = require("../../../../../machine_learning/validation");
var _utils = require("../../../../routes/utils");
var _utils2 = require("../../../utils/utils");
var _validate = require("../../../utils/validate");
var _patch_rules = require("../../../logic/crud/patch_rules");
var _read_rules = require("../../../logic/crud/read_rules");
var _legacy_action_migration = require("../../../logic/rule_actions/legacy_action_migration");
var _deprecation = require("../../deprecation");
var _validate_rule_default_exception_list = require("../../../logic/exceptions/validate_rule_default_exception_list");
var _validate_rules_with_duplicated_default_exceptions_list = require("../../../logic/exceptions/validate_rules_with_duplicated_default_exceptions_list");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// eslint-disable-next-line no-restricted-imports

/**
 * @deprecated since version 8.2.0. Use the detection_engine/rules/_bulk_action API instead
 */
const bulkPatchRulesRoute = (router, ml, logger) => {
  router.patch({
    path: _constants.DETECTION_ENGINE_RULES_BULK_UPDATE,
    validate: {
      body: (0, _route_validation.buildRouteValidationNonExact)(_rule_management.BulkPatchRulesRequestBody)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    (0, _deprecation.logDeprecatedBulkEndpoint)(logger, _constants.DETECTION_ENGINE_RULES_BULK_UPDATE);
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const ctx = await context.resolve(['core', 'securitySolution', 'alerting', 'licensing']);
    const rulesClient = ctx.alerting.getRulesClient();
    const ruleExecutionLog = ctx.securitySolution.getRuleExecutionLog();
    const savedObjectsClient = ctx.core.savedObjects.client;
    const mlAuthz = (0, _authz.buildMlAuthz)({
      license: ctx.licensing.license,
      ml,
      request,
      savedObjectsClient
    });
    const rules = await Promise.all(request.body.map(async payloadRule => {
      var _ref, _payloadRule$id;
      const idOrRuleIdOrUnknown = (_ref = (_payloadRule$id = payloadRule.id) !== null && _payloadRule$id !== void 0 ? _payloadRule$id : payloadRule.rule_id) !== null && _ref !== void 0 ? _ref : '(unknown id)';
      try {
        if (payloadRule.type) {
          // reject an unauthorized "promotion" to ML
          (0, _validation.throwAuthzError)(await mlAuthz.validateRuleType(payloadRule.type));
        }
        const existingRule = await (0, _read_rules.readRules)({
          rulesClient,
          ruleId: payloadRule.rule_id,
          id: payloadRule.id
        });
        if (existingRule !== null && existingRule !== void 0 && existingRule.params.type) {
          // reject an unauthorized modification of an ML rule
          (0, _validation.throwAuthzError)(await mlAuthz.validateRuleType(existingRule === null || existingRule === void 0 ? void 0 : existingRule.params.type));
        }
        (0, _validate_rules_with_duplicated_default_exceptions_list.validateRulesWithDuplicatedDefaultExceptionsList)({
          allRules: request.body,
          exceptionsList: payloadRule.exceptions_list,
          ruleId: idOrRuleIdOrUnknown
        });
        await (0, _validate_rule_default_exception_list.validateRuleDefaultExceptionList)({
          exceptionsList: payloadRule.exceptions_list,
          rulesClient,
          ruleRuleId: payloadRule.rule_id,
          ruleId: payloadRule.id
        });
        const migratedRule = await (0, _legacy_action_migration.legacyMigrate)({
          rulesClient,
          savedObjectsClient,
          rule: existingRule
        });
        const rule = await (0, _patch_rules.patchRules)({
          existingRule: migratedRule,
          rulesClient,
          nextParams: payloadRule
        });
        if (rule != null && rule.enabled != null && rule.name != null) {
          const ruleExecutionSummary = await ruleExecutionLog.getExecutionSummary(rule.id);
          return (0, _validate.transformValidateBulkError)(rule.id, rule, ruleExecutionSummary);
        } else {
          return (0, _utils2.getIdBulkError)({
            id: payloadRule.id,
            ruleId: payloadRule.rule_id
          });
        }
      } catch (err) {
        return (0, _utils.transformBulkError)(idOrRuleIdOrUnknown, err);
      }
    }));
    const [validated, errors] = (0, _securitysolutionIoTsUtils.validate)(rules, _rule_management.BulkCrudRulesResponse);
    if (errors != null) {
      return siemResponse.error({
        statusCode: 500,
        body: errors,
        headers: (0, _deprecation.getDeprecatedBulkEndpointHeader)(_constants.DETECTION_ENGINE_RULES_BULK_UPDATE)
      });
    } else {
      return response.ok({
        body: validated !== null && validated !== void 0 ? validated : {},
        headers: (0, _deprecation.getDeprecatedBulkEndpointHeader)(_constants.DETECTION_ENGINE_RULES_BULK_UPDATE)
      });
    }
  });
};
exports.bulkPatchRulesRoute = bulkPatchRulesRoute;