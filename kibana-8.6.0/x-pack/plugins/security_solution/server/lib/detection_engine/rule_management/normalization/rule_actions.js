"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformToNotifyWhen = exports.transformToAlertThrottle = exports.transformFromAlertThrottle = exports.transformActions = void 0;
var _constants = require("../../../../../common/constants");
var _transform_actions = require("../../../../../common/detection_engine/transform_actions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Given a throttle from a "security_solution" rule this will transform it into an "alerting" notifyWhen
 * on their saved object.
 * @params throttle The throttle from a "security_solution" rule
 * @returns The correct "NotifyWhen" for a Kibana alerting.
 */
const transformToNotifyWhen = throttle => {
  if (throttle == null || throttle === _constants.NOTIFICATION_THROTTLE_NO_ACTIONS) {
    return null; // Although I return null, this does not change the value of the "notifyWhen" and it keeps the current value of "notifyWhen"
  } else if (throttle === _constants.NOTIFICATION_THROTTLE_RULE) {
    return 'onActiveAlert';
  } else {
    return 'onThrottleInterval';
  }
};

/**
 * Given a throttle from a "security_solution" rule this will transform it into an "alerting" "throttle"
 * on their saved object.
 * @params throttle The throttle from a "security_solution" rule
 * @returns The "alerting" throttle
 */
exports.transformToNotifyWhen = transformToNotifyWhen;
const transformToAlertThrottle = throttle => {
  if (throttle == null || throttle === _constants.NOTIFICATION_THROTTLE_RULE || throttle === _constants.NOTIFICATION_THROTTLE_NO_ACTIONS) {
    return null;
  } else {
    return throttle;
  }
};

/**
 * Given a throttle from an "alerting" Saved Object (SO) this will transform it into a "security_solution"
 * throttle type. If given the "legacyRuleActions" but we detect that the rule for an unknown reason has actions
 * on it to which should not be typical but possible due to the split nature of the API's, this will prefer the
 * usage of the non-legacy version. Eventually the "legacyRuleActions" should be removed.
 * @param throttle The throttle from a  "alerting" Saved Object (SO)
 * @param legacyRuleActions Legacy "side car" rule actions that if it detects it being passed it in will transform using it.
 * @returns The "security_solution" throttle
 */
exports.transformToAlertThrottle = transformToAlertThrottle;
const transformFromAlertThrottle = (rule, legacyRuleActions) => {
  if (legacyRuleActions == null || rule.actions != null && rule.actions.length > 0) {
    if (rule.muteAll || rule.actions.length === 0) {
      return _constants.NOTIFICATION_THROTTLE_NO_ACTIONS;
    } else if (rule.notifyWhen === 'onActiveAlert' || rule.throttle == null && rule.notifyWhen == null) {
      return _constants.NOTIFICATION_THROTTLE_RULE;
    } else if (rule.throttle == null) {
      return _constants.NOTIFICATION_THROTTLE_NO_ACTIONS;
    } else {
      return rule.throttle;
    }
  } else {
    return legacyRuleActions.ruleThrottle;
  }
};

/**
 * Given a set of actions from an "alerting" Saved Object (SO) this will transform it into a "security_solution" alert action.
 * If this detects any legacy rule actions it will transform it. If both are sent in which is not typical but possible due to
 * the split nature of the API's this will prefer the usage of the non-legacy version. Eventually the "legacyRuleActions" should
 * be removed.
 * @param alertAction The alert action form a "alerting" Saved Object (SO).
 * @param legacyRuleActions Legacy "side car" rule actions that if it detects it being passed it in will transform using it.
 * @returns The actions of the RuleResponse
 */
exports.transformFromAlertThrottle = transformFromAlertThrottle;
const transformActions = (alertAction, legacyRuleActions) => {
  if (alertAction != null && alertAction.length !== 0) {
    return alertAction.map(action => (0, _transform_actions.transformAlertToRuleAction)(action));
  } else if (legacyRuleActions != null) {
    return legacyRuleActions.actions;
  } else {
    return [];
  }
};
exports.transformActions = transformActions;