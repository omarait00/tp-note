"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePrebuiltRules = void 0;
var _fp = require("lodash/fp");
var _transform_actions = require("../../../../../common/detection_engine/transform_actions");
var _constants = require("../../../../../common/constants");
var _rule_management = require("../../rule_management");
var _create_rules = require("../../rule_management/logic/crud/create_rules");
var _read_rules = require("../../rule_management/logic/crud/read_rules");
var _patch_rules = require("../../rule_management/logic/crud/patch_rules");
var _delete_rules = require("../../rule_management/logic/crud/delete_rules");
var _route = require("../api/install_prebuilt_rules_and_timelines/route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Updates existing prebuilt rules given a set of rules and output index.
 * This implements a chunked approach to not saturate network connections and
 * avoid being a "noisy neighbor".
 * @param rulesClient Alerting client
 * @param spaceId Current user spaceId
 * @param rules The rules to apply the update for
 */
const updatePrebuiltRules = async (rulesClient, savedObjectsClient, rules, ruleExecutionLog) => {
  const ruleChunks = (0, _fp.chunk)(_constants.MAX_RULES_TO_UPDATE_IN_PARALLEL, rules);
  for (const ruleChunk of ruleChunks) {
    const rulePromises = createPromises(rulesClient, savedObjectsClient, ruleChunk, ruleExecutionLog);
    await Promise.all(rulePromises);
  }
};

/**
 * Creates promises of the rules and returns them.
 * @param rulesClient Alerting client
 * @param spaceId Current user spaceId
 * @param rules The rules to apply the update for
 * @returns Promise of what was updated.
 */
exports.updatePrebuiltRules = updatePrebuiltRules;
const createPromises = (rulesClient, savedObjectsClient, rules, ruleExecutionLog) => {
  return rules.map(async rule => {
    const existingRule = await (0, _read_rules.readRules)({
      rulesClient,
      ruleId: rule.rule_id,
      id: undefined
    });
    const migratedRule = await (0, _rule_management.legacyMigrate)({
      rulesClient,
      savedObjectsClient,
      rule: existingRule
    });
    if (!migratedRule) {
      throw new _route.PrepackagedRulesError(`Failed to find rule ${rule.rule_id}`, 500);
    }

    // If we're trying to change the type of a prepackaged rule, we need to delete the old one
    // and replace it with the new rule, keeping the enabled setting, actions, throttle, id,
    // and exception lists from the old rule
    if (rule.type !== migratedRule.params.type) {
      await (0, _delete_rules.deleteRules)({
        ruleId: migratedRule.id,
        rulesClient,
        ruleExecutionLog
      });
      return (0, _create_rules.createRules)({
        rulesClient,
        params: {
          ...rule,
          // Force the prepackaged rule to use the enabled state from the existing rule,
          // regardless of what the prepackaged rule says
          enabled: migratedRule.enabled,
          actions: migratedRule.actions.map(_transform_actions.transformAlertToRuleAction)
        }
      });
    } else {
      return (0, _patch_rules.patchRules)({
        rulesClient,
        existingRule: migratedRule,
        nextParams: {
          ...rule,
          // Force enabled to use the enabled state from the existing rule by passing in undefined to patchRules
          enabled: undefined,
          actions: undefined
        }
      });
    }
  });
};