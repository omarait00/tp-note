"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.thresholdExecutor = void 0;
var _get_filter = require("../get_filter");
var _threshold = require("../threshold");
var _utils = require("../utils");
var _with_security_span = require("../../../../utils/with_security_span");
var _build_signal_history = require("../threshold/build_signal_history");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const thresholdExecutor = async ({
  inputIndex,
  runtimeMappings,
  completeRule,
  tuple,
  ruleExecutionLogger,
  services,
  version,
  startedAt,
  state,
  bulkCreate,
  wrapHits,
  ruleDataReader,
  primaryTimestamp,
  secondaryTimestamp,
  aggregatableTimestampField,
  exceptionFilter,
  unprocessedExceptions
}) => {
  const result = (0, _utils.createSearchAfterReturnType)();
  const ruleParams = completeRule.ruleParams;
  return (0, _with_security_span.withSecuritySpan)('thresholdExecutor', async () => {
    const exceptionsWarning = (0, _utils.getUnprocessedExceptionsWarnings)(unprocessedExceptions);
    if (exceptionsWarning) {
      result.warningMessages.push(exceptionsWarning);
    }

    // Get state or build initial state (on upgrade)
    const {
      signalHistory,
      searchErrors: previousSearchErrors
    } = state.initialized ? {
      signalHistory: state.signalHistory,
      searchErrors: []
    } : await (0, _threshold.getThresholdSignalHistory)({
      from: tuple.from.toISOString(),
      to: tuple.to.toISOString(),
      frameworkRuleId: completeRule.alertId,
      bucketByFields: ruleParams.threshold.field,
      ruleDataReader
    });
    if (state.initialized) {
      // Clean up any signal history that has fallen outside the window
      const toDelete = [];
      for (const [hash, entry] of Object.entries(signalHistory)) {
        if (entry.lastSignalTimestamp < tuple.from.valueOf()) {
          toDelete.push(hash);
        }
      }
      for (const hash of toDelete) {
        delete signalHistory[hash];
      }
    }

    // Eliminate dupes
    const bucketFilters = await (0, _threshold.getThresholdBucketFilters)({
      signalHistory,
      aggregatableTimestampField
    });

    // Combine dupe filter with other filters
    const esFilter = await (0, _get_filter.getFilter)({
      type: ruleParams.type,
      filters: ruleParams.filters ? ruleParams.filters.concat(bucketFilters) : bucketFilters,
      language: ruleParams.language,
      query: ruleParams.query,
      savedId: ruleParams.savedId,
      services,
      index: inputIndex,
      exceptionFilter
    });

    // Look for new events over threshold
    const {
      buckets,
      searchErrors,
      searchDurations
    } = await (0, _threshold.findThresholdSignals)({
      inputIndexPattern: inputIndex,
      from: tuple.from.toISOString(),
      to: tuple.to.toISOString(),
      maxSignals: tuple.maxSignals,
      services,
      ruleExecutionLogger,
      filter: esFilter,
      threshold: ruleParams.threshold,
      runtimeMappings,
      primaryTimestamp,
      secondaryTimestamp,
      aggregatableTimestampField
    });

    // Build and index new alerts

    const createResult = await (0, _threshold.bulkCreateThresholdSignals)({
      buckets,
      completeRule,
      filter: esFilter,
      services,
      inputIndexPattern: inputIndex,
      signalsIndex: ruleParams.outputIndex,
      startedAt,
      from: tuple.from.toDate(),
      signalHistory,
      bulkCreate,
      wrapHits,
      ruleExecutionLogger
    });
    (0, _utils.addToSearchAfterReturn)({
      current: result,
      next: createResult
    });
    result.errors.push(...previousSearchErrors);
    result.errors.push(...searchErrors);
    result.searchAfterTimes = searchDurations;
    const createdAlerts = createResult.createdItems.map(alert => {
      const {
        _id,
        _index,
        ...source
      } = alert;
      return {
        _id,
        _index,
        _source: {
          ...source
        }
      };
    });
    const newSignalHistory = (0, _build_signal_history.buildThresholdSignalHistory)({
      alerts: createdAlerts
    });
    return {
      ...result,
      state: {
        ...state,
        initialized: true,
        signalHistory: {
          ...signalHistory,
          ...newSignalHistory
        }
      }
    };
  });
};
exports.thresholdExecutor = thresholdExecutor;