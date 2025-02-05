"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.executionStatusFromError = executionStatusFromError;
exports.executionStatusFromState = executionStatusFromState;
exports.getRuleExecutionStatusPending = void 0;
exports.ruleExecutionStatusFromRaw = ruleExecutionStatusFromRaw;
exports.ruleExecutionStatusToRaw = ruleExecutionStatusToRaw;
var _types = require("../types");
var _error_with_reason = require("./error_with_reason");
var _errors = require("./errors");
var _common = require("../../common");
var _translations = require("../constants/translations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function executionStatusFromState(stateWithMetrics, lastExecutionDate) {
  var _stateWithMetrics$ale;
  const alertIds = Object.keys((_stateWithMetrics$ale = stateWithMetrics.alertInstances) !== null && _stateWithMetrics$ale !== void 0 ? _stateWithMetrics$ale : {});
  let status = alertIds.length === 0 ? _types.RuleExecutionStatusValues[0] : _types.RuleExecutionStatusValues[1];

  // Check for warning states
  let warning = null;
  // We only have a single warning field so prioritizing the alert circuit breaker over the actions circuit breaker
  if (stateWithMetrics.metrics.hasReachedAlertLimit) {
    status = _types.RuleExecutionStatusValues[5];
    warning = {
      reason: _types.RuleExecutionStatusWarningReasons.MAX_ALERTS,
      message: _translations.translations.taskRunner.warning.maxAlerts
    };
  } else if (stateWithMetrics.metrics.triggeredActionsStatus === _common.ActionsCompletion.PARTIAL) {
    status = _types.RuleExecutionStatusValues[5];
    warning = {
      reason: _types.RuleExecutionStatusWarningReasons.MAX_EXECUTABLE_ACTIONS,
      message: _translations.translations.taskRunner.warning.maxExecutableActions
    };
  }
  return {
    status: {
      lastExecutionDate: lastExecutionDate !== null && lastExecutionDate !== void 0 ? lastExecutionDate : new Date(),
      status,
      ...(warning ? {
        warning
      } : {})
    },
    metrics: stateWithMetrics.metrics
  };
}
function executionStatusFromError(error, lastExecutionDate) {
  return {
    status: {
      lastExecutionDate: lastExecutionDate !== null && lastExecutionDate !== void 0 ? lastExecutionDate : new Date(),
      status: 'error',
      error: {
        reason: (0, _error_with_reason.getReasonFromError)(error),
        message: (0, _errors.getEsErrorMessage)(error)
      }
    },
    metrics: null
  };
}
function ruleExecutionStatusToRaw({
  lastExecutionDate,
  lastDuration,
  status,
  error,
  warning
}) {
  return {
    lastExecutionDate: lastExecutionDate.toISOString(),
    lastDuration: lastDuration !== null && lastDuration !== void 0 ? lastDuration : 0,
    status,
    // explicitly setting to null (in case undefined) due to partial update concerns
    error: error !== null && error !== void 0 ? error : null,
    warning: warning !== null && warning !== void 0 ? warning : null
  };
}
function ruleExecutionStatusFromRaw(logger, ruleId, rawRuleExecutionStatus) {
  if (!rawRuleExecutionStatus) return undefined;
  const {
    lastExecutionDate,
    lastDuration,
    status = 'unknown',
    error,
    warning
  } = rawRuleExecutionStatus;
  let parsedDateMillis = lastExecutionDate ? Date.parse(lastExecutionDate) : Date.now();
  if (isNaN(parsedDateMillis)) {
    logger.debug(`invalid ruleExecutionStatus lastExecutionDate "${lastExecutionDate}" in raw rule ${ruleId}`);
    parsedDateMillis = Date.now();
  }
  const executionStatus = {
    status,
    lastExecutionDate: new Date(parsedDateMillis)
  };
  if (null != lastDuration) {
    executionStatus.lastDuration = lastDuration;
  }
  if (error) {
    executionStatus.error = error;
  }
  if (warning) {
    executionStatus.warning = warning;
  }
  return executionStatus;
}
const getRuleExecutionStatusPending = lastExecutionDate => ({
  status: 'pending',
  lastExecutionDate,
  error: null,
  warning: null
});
exports.getRuleExecutionStatusPending = getRuleExecutionStatusPending;