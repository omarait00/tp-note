"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lastRunToRaw = exports.lastRunFromState = exports.lastRunFromError = void 0;
var _error_with_reason = require("./error_with_reason");
var _errors = require("./errors");
var _common = require("../../common");
var _types = require("../types");
var _translations = require("../constants/translations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const lastRunFromState = stateWithMetrics => {
  const {
    metrics
  } = stateWithMetrics;
  let outcome = _types.RuleLastRunOutcomeValues[0];
  // Check for warning states
  let warning = null;
  let outcomeMsg = null;

  // We only have a single warning field so prioritizing the alert circuit breaker over the actions circuit breaker
  if (metrics.hasReachedAlertLimit) {
    outcome = _types.RuleLastRunOutcomeValues[1];
    warning = _types.RuleExecutionStatusWarningReasons.MAX_ALERTS;
    outcomeMsg = _translations.translations.taskRunner.warning.maxAlerts;
  } else if (metrics.triggeredActionsStatus === _common.ActionsCompletion.PARTIAL) {
    outcome = _types.RuleLastRunOutcomeValues[1];
    warning = _types.RuleExecutionStatusWarningReasons.MAX_EXECUTABLE_ACTIONS;
    outcomeMsg = _translations.translations.taskRunner.warning.maxExecutableActions;
  }
  return {
    lastRun: {
      outcome,
      outcomeMsg: outcomeMsg || null,
      warning: warning || null,
      alertsCount: {
        active: metrics.numberOfActiveAlerts,
        new: metrics.numberOfNewAlerts,
        recovered: metrics.numberOfRecoveredAlerts,
        ignored: 0
      }
    },
    metrics
  };
};
exports.lastRunFromState = lastRunFromState;
const lastRunFromError = error => {
  return {
    lastRun: {
      outcome: _types.RuleLastRunOutcomeValues[2],
      warning: (0, _error_with_reason.getReasonFromError)(error),
      outcomeMsg: (0, _errors.getEsErrorMessage)(error),
      alertsCount: {}
    },
    metrics: null
  };
};
exports.lastRunFromError = lastRunFromError;
const lastRunToRaw = lastRun => {
  const {
    warning,
    alertsCount,
    outcomeMsg
  } = lastRun;
  return {
    ...lastRun,
    alertsCount: {
      active: alertsCount.active || 0,
      new: alertsCount.new || 0,
      recovered: alertsCount.recovered || 0,
      ignored: alertsCount.ignored || 0
    },
    warning: warning !== null && warning !== void 0 ? warning : null,
    outcomeMsg: outcomeMsg !== null && outcomeMsg !== void 0 ? outcomeMsg : null
  };
};
exports.lastRunToRaw = lastRunToRaw;