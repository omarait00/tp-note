"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMigrations860 = void 0;
var _utils = require("../utils");
var _types = require("../../../types");
var _monitoring = require("../../../lib/monitoring");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const succeededStatus = ['ok', 'active', 'succeeded'];
const warningStatus = ['warning'];
const failedStatus = ['error', 'failed'];
const getLastRun = attributes => {
  const {
    executionStatus
  } = attributes;
  const {
    status,
    warning,
    error
  } = executionStatus || {};
  let outcome;
  if (succeededStatus.includes(status)) {
    outcome = _types.RuleLastRunOutcomeValues[0];
  } else if (warningStatus.includes(status) || warning) {
    outcome = _types.RuleLastRunOutcomeValues[1];
  } else if (failedStatus.includes(status) || error) {
    outcome = _types.RuleLastRunOutcomeValues[2];
  }

  // Don't set last run if status is unknown or pending, let the
  // task runner do it instead
  if (!outcome) {
    return null;
  }
  return {
    outcome,
    outcomeMsg: (warning === null || warning === void 0 ? void 0 : warning.message) || (error === null || error === void 0 ? void 0 : error.message) || null,
    warning: (warning === null || warning === void 0 ? void 0 : warning.reason) || (error === null || error === void 0 ? void 0 : error.reason) || null,
    alertsCount: {}
  };
};
const getMonitoring = attributes => {
  const {
    executionStatus,
    monitoring
  } = attributes;
  if (!monitoring) {
    if (!executionStatus) {
      return null;
    }

    // monitoring now has data from executionStatus, therefore, we should migrate
    // these fields even if monitoring doesn't exist.
    const defaultMonitoring = (0, _monitoring.getDefaultMonitoring)(executionStatus.lastExecutionDate);
    if (executionStatus.lastDuration) {
      defaultMonitoring.run.last_run.metrics.duration = executionStatus.lastDuration;
    }
    return defaultMonitoring;
  }
  const {
    lastExecutionDate,
    lastDuration
  } = executionStatus;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const monitoringExecution = monitoring.execution;
  return {
    run: {
      ...monitoringExecution,
      last_run: {
        timestamp: lastExecutionDate,
        metrics: {
          ...(lastDuration ? {
            duration: lastDuration
          } : {})
        }
      }
    }
  };
};
function migrateLastRun(doc) {
  const {
    attributes
  } = doc;
  const lastRun = getLastRun(attributes);
  const monitoring = getMonitoring(attributes);
  return {
    ...doc,
    attributes: {
      ...attributes,
      ...(lastRun ? {
        lastRun
      } : {}),
      ...(monitoring ? {
        monitoring
      } : {})
    }
  };
}
const getMigrations860 = encryptedSavedObjects => (0, _utils.createEsoMigration)(encryptedSavedObjects, doc => true, (0, _utils.pipeMigrations)(migrateLastRun));
exports.getMigrations860 = getMigrations860;