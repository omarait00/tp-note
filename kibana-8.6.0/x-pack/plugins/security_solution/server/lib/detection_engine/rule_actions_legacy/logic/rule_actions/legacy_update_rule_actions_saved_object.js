"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.legacyUpdateRuleActionsSavedObject = void 0;
var _legacy_saved_object_mappings = require("./legacy_saved_object_mappings");
var _legacy_utils = require("./legacy_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// eslint-disable-next-line no-restricted-imports

// eslint-disable-next-line no-restricted-imports

/**
 * NOTE: This should _only_ be seen to be used within the legacy route of "legacyCreateLegacyNotificationRoute" and not exposed and not
 * used anywhere else. If you see it being used anywhere else, that would be a bug.
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 */
const legacyUpdateRuleActionsSavedObject = async ({
  ruleAlertId,
  savedObjectsClient,
  actions,
  throttle,
  ruleActions
}) => {
  const referenceWithAlertId = [(0, _legacy_utils.legacyGetRuleReference)(ruleAlertId)];
  const actionReferences = actions != null ? actions.map((action, index) => (0, _legacy_utils.legacyGetActionReference)(action.id, index)) : ruleActions.actions.map((action, index) => (0, _legacy_utils.legacyGetActionReference)(action.id, index));
  const references = [...referenceWithAlertId, ...actionReferences];
  const throttleOptions = throttle ? (0, _legacy_utils.legacyGetThrottleOptions)(throttle) : {
    ruleThrottle: ruleActions.ruleThrottle,
    alertThrottle: ruleActions.alertThrottle
  };
  const attributes = {
    actions: actions != null ? actions.map((alertAction, index) => (0, _legacy_utils.legacyTransformActionToReference)(alertAction, index)) : ruleActions.actions.map((alertAction, index) => (0, _legacy_utils.legacyTransformLegacyRuleAlertActionToReference)(alertAction, index)),
    ...throttleOptions
  };
  await savedObjectsClient.update(_legacy_saved_object_mappings.legacyRuleActionsSavedObjectType, ruleActions.id, attributes, {
    references
  });
};
exports.legacyUpdateRuleActionsSavedObject = legacyUpdateRuleActionsSavedObject;