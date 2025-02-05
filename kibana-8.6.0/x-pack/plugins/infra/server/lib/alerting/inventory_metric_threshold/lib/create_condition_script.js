"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createConditionScript = void 0;
var _metrics = require("../../../../../common/alerting/metrics");
var _convert_metric_value = require("./convert_metric_value");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createConditionScript = (conditionThresholds, comparator, metric) => {
  const threshold = conditionThresholds.map(n => (0, _convert_metric_value.convertMetricValue)(metric, n));
  if (comparator === _metrics.Comparator.BETWEEN && threshold.length === 2) {
    return {
      source: `params.value > params.threshold0 && params.value < params.threshold1 ? 1 : 0`,
      params: {
        threshold0: threshold[0],
        threshold1: threshold[1]
      }
    };
  }
  if (comparator === _metrics.Comparator.OUTSIDE_RANGE && threshold.length === 2) {
    return {
      source: `params.value < params.threshold0 && params.value > params.threshold1 ? 1 : 0`,
      params: {
        threshold0: threshold[0],
        threshold1: threshold[1]
      }
    };
  }
  return {
    source: `params.value ${comparator} params.threshold ? 1 : 0`,
    params: {
      threshold: threshold[0]
    }
  };
};
exports.createConditionScript = createConditionScript;