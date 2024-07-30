"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateMonitoring = exports.getExecutionDurationPercentiles = exports.getDefaultMonitoring = exports.convertMonitoringFromRawAndVerify = exports.INITIAL_METRICS = void 0;
var _statsLite = _interopRequireDefault(require("stats-lite"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const INITIAL_METRICS = {
  total_search_duration_ms: null,
  total_indexing_duration_ms: null,
  total_alerts_detected: null,
  total_alerts_created: null,
  gap_duration_s: null
};
exports.INITIAL_METRICS = INITIAL_METRICS;
const getDefaultMonitoring = timestamp => {
  return {
    run: {
      history: [],
      calculated_metrics: {
        success_ratio: 0
      },
      last_run: {
        timestamp,
        metrics: INITIAL_METRICS
      }
    }
  };
};
exports.getDefaultMonitoring = getDefaultMonitoring;
const getExecutionDurationPercentiles = history => {
  const durationSamples = history.reduce((duration, historyItem) => {
    if (typeof historyItem.duration === 'number') {
      return [...duration, historyItem.duration];
    }
    return duration;
  }, []);
  if (durationSamples.length) {
    return {
      p50: _statsLite.default.percentile(durationSamples, 0.5),
      p95: _statsLite.default.percentile(durationSamples, 0.95),
      p99: _statsLite.default.percentile(durationSamples, 0.99)
    };
  }
  return {};
};

// Immutably updates the monitoring object with timestamp and duration.
// Used when converting from and between raw monitoring object
exports.getExecutionDurationPercentiles = getExecutionDurationPercentiles;
const updateMonitoring = ({
  monitoring,
  timestamp,
  duration
}) => {
  const {
    run
  } = monitoring;
  const {
    last_run: lastRun,
    ...rest
  } = run;
  const {
    metrics = INITIAL_METRICS
  } = lastRun;
  return {
    run: {
      last_run: {
        timestamp,
        metrics: {
          ...metrics,
          duration
        }
      },
      ...rest
    }
  };
};
exports.updateMonitoring = updateMonitoring;
const convertMonitoringFromRawAndVerify = (logger, ruleId, monitoring) => {
  if (!monitoring) {
    return undefined;
  }
  const lastRunDate = monitoring.run.last_run.timestamp;
  let parsedDateMillis = lastRunDate ? Date.parse(lastRunDate) : Date.now();
  if (isNaN(parsedDateMillis)) {
    logger.debug(`invalid monitoring last_run.timestamp "${lastRunDate}" in raw rule ${ruleId}`);
    parsedDateMillis = Date.now();
  }
  return updateMonitoring({
    monitoring,
    timestamp: new Date(parsedDateMillis).toISOString(),
    duration: monitoring.run.last_run.metrics.duration
  });
};
exports.convertMonitoringFromRawAndVerify = convertMonitoringFromRawAndVerify;