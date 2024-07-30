"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.legacyMigrate = exports.getUpdatedActionsParams = void 0;
var _fp = require("lodash/fp");
var _with_security_span = require("../../../../../utils/with_security_span");
var _rule_actions_legacy = require("../../../rule_actions_legacy");
var _rule_actions = require("../../normalization/rule_actions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// eslint-disable-next-line no-restricted-imports

/**
 * Determines if rule needs to be migrated from legacy actions
 * and returns necessary pieces for the updated rule
 */
const legacyMigrate = async ({
  rulesClient,
  savedObjectsClient,
  rule
}) => (0, _with_security_span.withSecuritySpan)('legacyMigrate', async () => {
  if (rule == null || rule.id == null) {
    return rule;
  }
  /**
   * On update / patch I'm going to take the actions as they are, better off taking rules client.find (siem.notification) result
   * and putting that into the actions array of the rule, then set the rules onThrottle property, notifyWhen and throttle from null -> actual value (1hr etc..)
   * Then use the rules client to delete the siem.notification
   * Then with the legacy Rule Actions saved object type, just delete it.
   */
  // find it using the references array, not params.ruleAlertId
  const [siemNotification, legacyRuleActionsSO] = await Promise.all([rulesClient.find({
    options: {
      filter: 'alert.attributes.alertTypeId:(siem.notifications)',
      hasReference: {
        type: 'alert',
        id: rule.id
      }
    }
  }), savedObjectsClient.find({
    type: _rule_actions_legacy.legacyRuleActionsSavedObjectType,
    hasReference: {
      type: 'alert',
      id: rule.id
    }
  })]);
  const siemNotificationsExist = siemNotification != null && siemNotification.data.length > 0;
  const legacyRuleNotificationSOsExist = legacyRuleActionsSO != null && legacyRuleActionsSO.saved_objects.length > 0;

  // Assumption: if no legacy sidecar SO or notification rule types exist
  // that reference the rule in question, assume rule actions are not legacy
  if (!siemNotificationsExist && !legacyRuleNotificationSOsExist) {
    return rule;
  }
  // If the legacy notification rule type ("siem.notification") exist,
  // migration and cleanup are needed
  if (siemNotificationsExist) {
    await rulesClient.delete({
      id: siemNotification.data[0].id
    });
  }
  // If legacy notification sidecar ("siem-detection-engine-rule-actions")
  // exist, migration and cleanup are needed
  if (legacyRuleNotificationSOsExist) {
    // Delete the legacy sidecar SO
    await savedObjectsClient.delete(_rule_actions_legacy.legacyRuleActionsSavedObjectType, legacyRuleActionsSO.saved_objects[0].id);

    // If "siem-detection-engine-rule-actions" notes that `ruleThrottle` is
    // "no_actions" or "rule", rule has no actions or rule is set to run
    // action on every rule run. In these cases, sidecar deletion is the only
    // cleanup needed and updates to the "throttle" and "notifyWhen". "siem.notification" are
    // not created for these action types
    if (legacyRuleActionsSO.saved_objects[0].attributes.ruleThrottle === 'no_actions' || legacyRuleActionsSO.saved_objects[0].attributes.ruleThrottle === 'rule') {
      return rule;
    }

    // Use "legacyRuleActionsSO" instead of "siemNotification" as "siemNotification" is not created
    // until a rule is run and added to task manager. That means that if by chance a user has a rule
    // with actions which they have yet to enable, the actions would be lost. Instead,
    // "legacyRuleActionsSO" is created on rule creation (pre 7.15) and we can rely on it to be there
    const migratedRule = getUpdatedActionsParams({
      rule,
      ruleThrottle: legacyRuleActionsSO.saved_objects[0].attributes.ruleThrottle,
      actions: legacyRuleActionsSO.saved_objects[0].attributes.actions,
      references: legacyRuleActionsSO.saved_objects[0].references
    });
    await rulesClient.update({
      id: rule.id,
      data: migratedRule
    });
    return {
      id: rule.id,
      ...migratedRule
    };
  }
});

/**
 * Translate legacy action sidecar action to rule action
 */
exports.legacyMigrate = legacyMigrate;
const getUpdatedActionsParams = ({
  rule,
  ruleThrottle,
  actions,
  references
}) => {
  const {
    id,
    ...restOfRule
  } = rule;
  const actionReference = references.reduce((acc, reference) => {
    acc[reference.name] = reference;
    return acc;
  }, {});
  if ((0, _fp.isEmpty)(actionReference)) {
    throw new Error(`An error occurred migrating legacy action for rule with id:${id}. Connector reference id not found.`);
  }
  // If rule has an action on any other interval (other than on every
  // rule run), need to move the action info from the sidecar/legacy action
  // into the rule itself
  return {
    ...restOfRule,
    actions: actions.reduce((acc, action) => {
      const {
        actionRef,
        action_type_id: actionTypeId,
        ...resOfAction
      } = action;
      if (!actionReference[actionRef]) {
        return acc;
      }
      return [...acc, {
        ...resOfAction,
        id: actionReference[actionRef].id,
        actionTypeId
      }];
    }, []),
    throttle: (0, _rule_actions.transformToAlertThrottle)(ruleThrottle),
    notifyWhen: (0, _rule_actions.transformToNotifyWhen)(ruleThrottle)
  };
};
exports.getUpdatedActionsParams = getUpdatedActionsParams;