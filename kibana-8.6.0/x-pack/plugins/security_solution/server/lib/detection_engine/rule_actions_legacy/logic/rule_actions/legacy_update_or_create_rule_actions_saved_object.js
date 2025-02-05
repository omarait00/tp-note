"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.legacyUpdateOrCreateRuleActionsSavedObject = void 0;
var _legacy_get_rule_actions_saved_object = require("./legacy_get_rule_actions_saved_object");
var _legacy_create_rule_actions_saved_object = require("./legacy_create_rule_actions_saved_object");
var _legacy_update_rule_actions_saved_object = require("./legacy_update_rule_actions_saved_object");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// eslint-disable-next-line no-restricted-imports

// eslint-disable-next-line no-restricted-imports

// eslint-disable-next-line no-restricted-imports

/**
 * NOTE: This should _only_ be seen to be used within the legacy route of "legacyCreateLegacyNotificationRoute" and not exposed and not
 * used anywhere else. If you see it being used anywhere else, that would be a bug.
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 * @see legacyCreateLegacyNotificationRoute
 */
const legacyUpdateOrCreateRuleActionsSavedObject = async ({
  savedObjectsClient,
  ruleAlertId,
  actions,
  throttle,
  logger
}) => {
  const ruleActions = await (0, _legacy_get_rule_actions_saved_object.legacyGetRuleActionsSavedObject)({
    ruleAlertId,
    savedObjectsClient,
    logger
  });
  if (ruleActions != null) {
    return (0, _legacy_update_rule_actions_saved_object.legacyUpdateRuleActionsSavedObject)({
      ruleAlertId,
      savedObjectsClient,
      actions,
      throttle,
      ruleActions
    });
  } else {
    return (0, _legacy_create_rule_actions_saved_object.legacyCreateRuleActionsSavedObject)({
      ruleAlertId,
      savedObjectsClient,
      actions,
      throttle
    });
  }
};
exports.legacyUpdateOrCreateRuleActionsSavedObject = legacyUpdateOrCreateRuleActionsSavedObject;