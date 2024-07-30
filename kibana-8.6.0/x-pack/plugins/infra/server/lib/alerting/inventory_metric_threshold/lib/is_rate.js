"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isRate = exports.isMetricRate = exports.isInterfaceRateAgg = exports.isCustomMetricRate = void 0;
var _lodash = require("lodash");
var _types = require("../../../../../common/inventory_models/types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const isMetricRate = metric => {
  if (!_types.MetricsUIAggregationRT.is(metric)) {
    return false;
  }
  const values = Object.values(metric);
  return values.some(agg => _types.ESDerivativeAggRT.is(agg)) && values.some(agg => _types.ESBasicMetricAggRT.is(agg) && (0, _lodash.has)(agg, 'max'));
};
exports.isMetricRate = isMetricRate;
const isCustomMetricRate = customMetric => {
  return customMetric.aggregation === 'rate';
};
exports.isCustomMetricRate = isCustomMetricRate;
const isInterfaceRateAgg = metric => {
  if (!_types.MetricsUIAggregationRT.is(metric)) {
    return false;
  }
  const values = Object.values(metric);
  return values.some(agg => _types.ESTermsWithAggregationRT.is(agg)) && values.some(agg => _types.ESSumBucketAggRT.is(agg));
};
exports.isInterfaceRateAgg = isInterfaceRateAgg;
const isRate = (metric, customMetric) => {
  return isMetricRate(metric) || isInterfaceRateAgg(metric) || customMetric && isCustomMetricRate(customMetric);
};
exports.isRate = isRate;