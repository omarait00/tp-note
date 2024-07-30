"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkDeleteRulesRoute = void 0;
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _constants = require("../../../../../../../common/constants");
var _rule_management = require("../../../../../../../common/detection_engine/rule_management");
var _route_validation = require("../../../../../../utils/build_validation/route_validation");
var _utils = require("../../../utils/utils");
var _validate = require("../../../utils/validate");
var _utils2 = require("../../../../routes/utils");
var _delete_rules = require("../../../logic/crud/delete_rules");
var _read_rules = require("../../../logic/crud/read_rules");
var _legacy_action_migration = require("../../../logic/rule_actions/legacy_action_migration");
var _deprecation = require("../../deprecation");
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
const bulkDeleteRulesRoute = (router, logger) => {
  const config = {
    validate: {
      body: (0, _route_validation.buildRouteValidation)(_rule_management.BulkDeleteRulesRequestBody)
    },
    path: _constants.DETECTION_ENGINE_RULES_BULK_DELETE,
    options: {
      tags: ['access:securitySolution']
    }
  };
  const handler = async (context, request, response) => {
    (0, _deprecation.logDeprecatedBulkEndpoint)(logger, _constants.DETECTION_ENGINE_RULES_BULK_DELETE);
    const siemResponse = (0, _utils2.buildSiemResponse)(response);
    const ctx = await context.resolve(['core', 'securitySolution', 'alerting']);
    const rulesClient = ctx.alerting.getRulesClient();
    const ruleExecutionLog = ctx.securitySolution.getRuleExecutionLog();
    const savedObjectsClient = ctx.core.savedObjects.client;
    const rules = await Promise.all(request.body.map(async payloadRule => {
      var _ref;
      const {
        id,
        rule_id: ruleId
      } = payloadRule;
      const idOrRuleIdOrUnknown = (_ref = id !== null && id !== void 0 ? id : ruleId) !== null && _ref !== void 0 ? _ref : '(unknown id)';
      const validationErrors = (0, _rule_management.validateQueryRuleByIds)(payloadRule);
      if (validationErrors.length) {
        return (0, _utils2.createBulkErrorObject)({
          ruleId: idOrRuleIdOrUnknown,
          statusCode: 400,
          message: validationErrors.join()
        });
      }
      try {
        const rule = await (0, _read_rules.readRules)({
          rulesClient,
          id,
          ruleId
        });
        const migratedRule = await (0, _legacy_action_migration.legacyMigrate)({
          rulesClient,
          savedObjectsClient,
          rule
        });
        if (!migratedRule) {
          return (0, _utils.getIdBulkError)({
            id,
            ruleId
          });
        }
        const ruleExecutionSummary = await ruleExecutionLog.getExecutionSummary(migratedRule.id);
        await (0, _delete_rules.deleteRules)({
          ruleId: migratedRule.id,
          rulesClient,
          ruleExecutionLog
        });
        return (0, _validate.transformValidateBulkError)(idOrRuleIdOrUnknown, migratedRule, ruleExecutionSummary);
      } catch (err) {
        return (0, _utils2.transformBulkError)(idOrRuleIdOrUnknown, err);
      }
    }));
    const [validated, errors] = (0, _securitysolutionIoTsUtils.validate)(rules, _rule_management.BulkCrudRulesResponse);
    if (errors != null) {
      return siemResponse.error({
        statusCode: 500,
        body: errors,
        headers: (0, _deprecation.getDeprecatedBulkEndpointHeader)(_constants.DETECTION_ENGINE_RULES_BULK_DELETE)
      });
    } else {
      return response.ok({
        body: validated !== null && validated !== void 0 ? validated : {},
        headers: (0, _deprecation.getDeprecatedBulkEndpointHeader)(_constants.DETECTION_ENGINE_RULES_BULK_DELETE)
      });
    }
  };
  router.delete(config, handler);
  router.post(config, handler);
};
exports.bulkDeleteRulesRoute = bulkDeleteRulesRoute;