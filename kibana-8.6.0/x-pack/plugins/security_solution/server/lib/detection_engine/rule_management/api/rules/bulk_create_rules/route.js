"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkCreateRulesRoute = void 0;
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _constants = require("../../../../../../../common/constants");
var _rule_management = require("../../../../../../../common/detection_engine/rule_management");
var _authz = require("../../../../../machine_learning/authz");
var _validation = require("../../../../../machine_learning/validation");
var _create_rules = require("../../../logic/crud/create_rules");
var _read_rules = require("../../../logic/crud/read_rules");
var _get_duplicates = require("./get_duplicates");
var _validate = require("../../../utils/validate");
var _route_validation = require("../../../../../../utils/build_validation/route_validation");
var _validate_rule_default_exception_list = require("../../../logic/exceptions/validate_rule_default_exception_list");
var _validate_rules_with_duplicated_default_exceptions_list = require("../../../logic/exceptions/validate_rules_with_duplicated_default_exceptions_list");
var _utils = require("../../../../routes/utils");
var _deprecation = require("../../deprecation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * @deprecated since version 8.2.0. Use the detection_engine/rules/_bulk_action API instead
 */
const bulkCreateRulesRoute = (router, ml, logger) => {
  router.post({
    path: _constants.DETECTION_ENGINE_RULES_BULK_CREATE,
    validate: {
      body: (0, _route_validation.buildRouteValidation)(_rule_management.BulkCreateRulesRequestBody)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    (0, _deprecation.logDeprecatedBulkEndpoint)(logger, _constants.DETECTION_ENGINE_RULES_BULK_CREATE);
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const ctx = await context.resolve(['core', 'securitySolution', 'licensing', 'alerting']);
    const rulesClient = ctx.alerting.getRulesClient();
    const savedObjectsClient = ctx.core.savedObjects.client;
    const mlAuthz = (0, _authz.buildMlAuthz)({
      license: ctx.licensing.license,
      ml,
      request,
      savedObjectsClient
    });
    const ruleDefinitions = request.body;
    const dupes = (0, _get_duplicates.getDuplicates)(ruleDefinitions, 'rule_id');
    const rules = await Promise.all(ruleDefinitions.filter(rule => rule.rule_id == null || !dupes.includes(rule.rule_id)).map(async payloadRule => {
      if (payloadRule.rule_id != null) {
        const rule = await (0, _read_rules.readRules)({
          id: undefined,
          rulesClient,
          ruleId: payloadRule.rule_id
        });
        if (rule != null) {
          return (0, _utils.createBulkErrorObject)({
            ruleId: payloadRule.rule_id,
            statusCode: 409,
            message: `rule_id: "${payloadRule.rule_id}" already exists`
          });
        }
      }
      try {
        (0, _validate_rules_with_duplicated_default_exceptions_list.validateRulesWithDuplicatedDefaultExceptionsList)({
          allRules: request.body,
          exceptionsList: payloadRule.exceptions_list,
          ruleId: payloadRule.rule_id
        });
        await (0, _validate_rule_default_exception_list.validateRuleDefaultExceptionList)({
          exceptionsList: payloadRule.exceptions_list,
          rulesClient,
          ruleRuleId: payloadRule.rule_id,
          ruleId: undefined
        });
        const validationErrors = (0, _rule_management.validateCreateRuleProps)(payloadRule);
        if (validationErrors.length) {
          return (0, _utils.createBulkErrorObject)({
            ruleId: payloadRule.rule_id,
            statusCode: 400,
            message: validationErrors.join()
          });
        }
        (0, _validation.throwAuthzError)(await mlAuthz.validateRuleType(payloadRule.type));
        const createdRule = await (0, _create_rules.createRules)({
          rulesClient,
          params: payloadRule
        });
        return (0, _validate.transformValidateBulkError)(createdRule.params.ruleId, createdRule, null);
      } catch (err) {
        return (0, _utils.transformBulkError)(payloadRule.rule_id, err);
      }
    }));
    const rulesBulk = [...rules, ...dupes.map(ruleId => (0, _utils.createBulkErrorObject)({
      ruleId,
      statusCode: 409,
      message: `rule_id: "${ruleId}" already exists`
    }))];
    const [validated, errors] = (0, _securitysolutionIoTsUtils.validate)(rulesBulk, _rule_management.BulkCrudRulesResponse);
    if (errors != null) {
      return siemResponse.error({
        statusCode: 500,
        body: errors,
        headers: (0, _deprecation.getDeprecatedBulkEndpointHeader)(_constants.DETECTION_ENGINE_RULES_BULK_CREATE)
      });
    } else {
      return response.ok({
        body: validated !== null && validated !== void 0 ? validated : {},
        headers: (0, _deprecation.getDeprecatedBulkEndpointHeader)(_constants.DETECTION_ENGINE_RULES_BULK_CREATE)
      });
    }
  });
};
exports.bulkCreateRulesRoute = bulkCreateRulesRoute;