"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkEditRules = void 0;
var _pMap = _interopRequireDefault(require("p-map"));
var _constants = require("../../../../../../common/constants");
var _request_schema = require("../../../../../../common/detection_engine/rule_management/api/rules/bulk_actions/request_schema");
var _enrich_filter_with_rule_type_mappings = require("../search/enrich_filter_with_rule_type_mappings");
var _read_rules = require("../crud/read_rules");
var _rule_params_modifier = require("./rule_params_modifier");
var _split_bulk_edit_actions = require("./split_bulk_edit_actions");
var _validations = require("./validations");
var _action_to_rules_client_operation = require("./action_to_rules_client_operation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * calls rulesClient.bulkEdit
 * transforms bulk actions payload into rulesClient compatible operations
 * enriches query filter with rule types search queries
 * @param BulkEditRulesArguments
 * @returns edited rules and caught errors
 */
const bulkEditRules = async ({
  rulesClient,
  ids,
  actions,
  filter,
  mlAuthz
}) => {
  const {
    attributesActions,
    paramsActions
  } = (0, _split_bulk_edit_actions.splitBulkEditActions)(actions);
  const operations = attributesActions.map(_action_to_rules_client_operation.bulkEditActionToRulesClientOperation).flat();
  const result = await rulesClient.bulkEdit({
    ...(ids ? {
      ids
    } : {
      filter: (0, _enrich_filter_with_rule_type_mappings.enrichFilterWithRuleTypeMapping)(filter)
    }),
    operations,
    paramsModifier: async ruleParams => {
      await (0, _validations.validateBulkEditRule)({
        mlAuthz,
        ruleType: ruleParams.type,
        edit: actions,
        immutable: ruleParams.immutable
      });
      return (0, _rule_params_modifier.ruleParamsModifier)(ruleParams, paramsActions);
    }
  });

  // rulesClient bulkEdit currently doesn't support bulk mute/unmute.
  // this is a workaround to mitigate this,
  // until https://github.com/elastic/kibana/issues/139084 is resolved
  // if rule actions has been applied, we go through each rule, unmute it if necessary and refetch it
  // calling unmute needed only if rule was muted and throttle value is not NOTIFICATION_THROTTLE_NO_ACTIONS
  const ruleActions = attributesActions.filter(rule => [_request_schema.BulkActionEditType.set_rule_actions, _request_schema.BulkActionEditType.add_rule_actions].includes(rule.type));

  // bulk edit actions are applied in historical order.
  // So, we need to find a rule action that will be applied the last, to be able to check if rule should be muted/unmuted
  const rulesAction = ruleActions.pop();
  if (rulesAction) {
    const unmuteErrors = [];
    const rulesToUnmute = await (0, _pMap.default)(result.rules, async rule => {
      try {
        if (rule.muteAll && rulesAction.value.throttle !== _constants.NOTIFICATION_THROTTLE_NO_ACTIONS) {
          var _await$readRules;
          await rulesClient.unmuteAll({
            id: rule.id
          });
          return (_await$readRules = await (0, _read_rules.readRules)({
            rulesClient,
            id: rule.id,
            ruleId: undefined
          })) !== null && _await$readRules !== void 0 ? _await$readRules : rule;
        }
        return rule;
      } catch (err) {
        unmuteErrors.push({
          message: err.message,
          rule: {
            id: rule.id,
            name: rule.name
          }
        });
        return null;
      }
    }, {
      concurrency: _constants.MAX_RULES_TO_UPDATE_IN_PARALLEL
    });
    return {
      ...result,
      rules: rulesToUnmute.filter(rule => rule != null),
      errors: [...result.errors, ...unmuteErrors]
    };
  }
  return result;
};
exports.bulkEditRules = bulkEditRules;