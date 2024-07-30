"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkUpdateRulesRoute = void 0;
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _rule_management = require("../../../../../../../common/detection_engine/rule_management");
var _route_validation = require("../../../../../../utils/build_validation/route_validation");
var _constants = require("../../../../../../../common/constants");
var _authz = require("../../../../../machine_learning/authz");
var _validation = require("../../../../../machine_learning/validation");
var _utils = require("../../../utils/utils");
var _validate = require("../../../utils/validate");
var _utils2 = require("../../../../routes/utils");
var _update_rules = require("../../../logic/crud/update_rules");
var _legacy_action_migration = require("../../../logic/rule_actions/legacy_action_migration");
var _read_rules = require("../../../logic/crud/read_rules");
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
const bulkUpdateRulesRoute = (router, ml, logger) => {
  router.put({
    path: _constants.DETECTION_ENGINE_RULES_BULK_UPDATE,
    validate: {
      body: (0, _route_validation.buildRouteValidation)(_rule_management.BulkUpdateRulesRequestBody)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    (0, _deprecation.logDeprecatedBulkEndpoint)(logger, _constants.DETECTION_ENGINE_RULES_BULK_UPDATE);
    const siemResponse = (0, _utils2.buildSiemResponse)(response);
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
        const validationErrors = (0, _rule_management.validateUpdateRuleProps)(payloadRule);
        if (validationErrors.length) {
          return (0, _utils2.createBulkErrorObject)({
            ruleId: payloadRule.rule_id,
            statusCode: 400,
            message: validationErrors.join()
          });
        }
        (0, _validation.throwAuthzError)(await mlAuthz.validateRuleType(payloadRule.type));
        const existingRule = await (0, _read_rules.readRules)({
          rulesClient,
          ruleId: payloadRule.rule_id,
          id: payloadRule.id
        });
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
        const rule = await (0, _update_rules.updateRules)({
          rulesClient,
          existingRule: migratedRule,
          ruleUpdate: payloadRule
        });
        if (rule != null) {
          const ruleExecutionSummary = await ruleExecutionLog.getExecutionSummary(rule.id);
          return (0, _validate.transformValidateBulkError)(rule.id, rule, ruleExecutionSummary);
        } else {
          return (0, _utils.getIdBulkError)({
            id: payloadRule.id,
            ruleId: payloadRule.rule_id
          });
        }
      } catch (err) {
        return (0, _utils2.transformBulkError)(idOrRuleIdOrUnknown, err);
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
exports.bulkUpdateRulesRoute = bulkUpdateRulesRoute;