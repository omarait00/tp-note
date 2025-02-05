"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBucketSelector = void 0;
var _metrics = require("../../../../../common/alerting/metrics");
var _create_condition_script = require("./create_condition_script");
var _wrap_in_period = require("./wrap_in_period");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const EMPTY_SHOULD_WARN = {
  bucket_script: {
    buckets_path: {},
    script: '0'
  }
};
const createBucketSelector = (condition, alertOnGroupDisappear = false, groupBy, lastPeriodEnd) => {
  const hasGroupBy = groupBy != null;
  const hasWarn = condition.warningThreshold != null && condition.warningComparator != null;
  const isPercentile = [_metrics.Aggregators.P95, _metrics.Aggregators.P99].includes(condition.aggType);
  const isCount = condition.aggType === _metrics.Aggregators.COUNT;
  const isRate = condition.aggType === _metrics.Aggregators.RATE;
  const bucketPath = isCount ? 'currentPeriod>_count' : isRate ? `aggregatedValue` : isPercentile ? `currentPeriod>aggregatedValue[${condition.aggType === _metrics.Aggregators.P95 ? '95' : '99'}]` : 'currentPeriod>aggregatedValue';
  const shouldWarn = hasWarn ? {
    bucket_script: {
      buckets_path: {
        value: bucketPath
      },
      script: (0, _create_condition_script.createConditionScript)(condition.warningThreshold, condition.warningComparator)
    }
  } : EMPTY_SHOULD_WARN;
  const shouldTrigger = {
    bucket_script: {
      buckets_path: {
        value: bucketPath
      },
      script: (0, _create_condition_script.createConditionScript)(condition.threshold, condition.comparator)
    }
  };
  const aggs = {
    shouldWarn,
    shouldTrigger
  };
  if (hasGroupBy && alertOnGroupDisappear && lastPeriodEnd) {
    const wrappedPeriod = (0, _wrap_in_period.createLastPeriod)(lastPeriodEnd, condition);
    aggs.lastPeriod = wrappedPeriod.lastPeriod;
    aggs.missingGroup = {
      bucket_script: {
        buckets_path: {
          lastPeriod: 'lastPeriod>_count',
          currentPeriod: 'currentPeriod>_count'
        },
        script: 'params.lastPeriod > 0 && params.currentPeriod < 1 ? 1 : 0'
      }
    };
    aggs.newOrRecoveredGroup = {
      bucket_script: {
        buckets_path: {
          lastPeriod: 'lastPeriod>_count',
          currentPeriod: 'currentPeriod>_count'
        },
        script: 'params.lastPeriod < 1 && params.currentPeriod > 0 ? 1 : 0'
      }
    };
  }
  if (hasGroupBy) {
    const evalutionBucketPath = alertOnGroupDisappear && lastPeriodEnd ? {
      shouldWarn: 'shouldWarn',
      shouldTrigger: 'shouldTrigger',
      missingGroup: 'missingGroup',
      newOrRecoveredGroup: 'newOrRecoveredGroup'
    } : {
      shouldWarn: 'shouldWarn',
      shouldTrigger: 'shouldTrigger'
    };
    const evaluationScript = alertOnGroupDisappear && lastPeriodEnd ? '(params.missingGroup != null && params.missingGroup > 0) || (params.shouldWarn != null && params.shouldWarn > 0) || (params.shouldTrigger != null && params.shouldTrigger > 0) || (params.newOrRecoveredGroup != null && params.newOrRecoveredGroup > 0)' : '(params.shouldWarn != null && params.shouldWarn > 0) || (params.shouldTrigger != null && params.shouldTrigger > 0)';
    aggs.evaluation = {
      bucket_selector: {
        buckets_path: evalutionBucketPath,
        script: evaluationScript
      }
    };
  }
  return aggs;
};
exports.createBucketSelector = createBucketSelector;