"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertToOtherParentPipelineAggColumns = exports.convertToMovingAverageParams = exports.convertToCumulativeSumAggColumn = void 0;
var _common = require("../../../../../data/common");
var _metrics = require("../metrics");
var _column = require("./column");
var _formula = require("./formula");
var _metric = require("./metric");
var _supported_metrics = require("./supported_metrics");
var _constants = require("./constants");
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const convertToMovingAverageParams = agg => {
  var _window;
  return {
    window: (_window = agg.aggParams.window) !== null && _window !== void 0 ? _window : 0
  };
};
exports.convertToMovingAverageParams = convertToMovingAverageParams;
const convertToOtherParentPipelineAggColumns = ({
  agg,
  dataView,
  aggs,
  visType
}, reducedTimeRange) => {
  var _agg$aggParams;
  const {
    aggType
  } = agg;
  const op = _supported_metrics.SUPPORTED_METRICS[aggType];
  if (!op) {
    return null;
  }
  const metric = (0, _utils.getMetricFromParentPipelineAgg)(agg, aggs);
  if (!metric) {
    return null;
  }
  const subAgg = _supported_metrics.SUPPORTED_METRICS[metric.aggType];
  if (!subAgg) {
    return null;
  }
  if (_constants.SIBLING_PIPELINE_AGGS.includes(metric.aggType)) {
    return null;
  }
  if (_constants.PIPELINE_AGGS.includes(metric.aggType)) {
    const formula = (0, _metrics.getFormulaForPipelineAgg)({
      agg,
      aggs,
      dataView,
      visType
    });
    if (!formula) {
      return null;
    }
    return (0, _formula.createFormulaColumn)(formula, agg);
  }
  const subMetric = (0, _metrics.convertMetricToColumns)({
    agg: metric,
    dataView,
    aggs,
    visType
  });
  if (subMetric === null) {
    return null;
  }
  return [{
    operationType: op.name,
    references: [subMetric[0].columnId],
    ...(0, _column.createColumn)(agg),
    params: {},
    timeShift: (_agg$aggParams = agg.aggParams) === null || _agg$aggParams === void 0 ? void 0 : _agg$aggParams.timeShift
  }, subMetric[0]];
};
exports.convertToOtherParentPipelineAggColumns = convertToOtherParentPipelineAggColumns;
const convertToCumulativeSumAggColumn = ({
  agg,
  dataView,
  aggs,
  visType
}, reducedTimeRange) => {
  const {
    aggParams,
    aggType
  } = agg;
  if (!aggParams) {
    return null;
  }
  const metric = (0, _utils.getMetricFromParentPipelineAgg)(agg, aggs);
  if (!metric) {
    return null;
  }
  const subAgg = _supported_metrics.SUPPORTED_METRICS[metric.aggType];
  if (!subAgg) {
    return null;
  }
  if (_constants.SIBLING_PIPELINE_AGGS.includes(metric.aggType)) {
    return null;
  }
  if (metric.aggType === _common.METRIC_TYPES.COUNT || subAgg.name === 'sum') {
    var _agg$aggParams2;
    // create column for sum or count
    const subMetric = (0, _metric.convertMetricAggregationColumnWithoutSpecialParams)(subAgg, {
      agg: metric,
      dataView,
      visType
    }, reducedTimeRange);
    if (subMetric === null) {
      return null;
    }
    const op = _supported_metrics.SUPPORTED_METRICS[aggType];
    if (!op) {
      return null;
    }
    return [{
      operationType: op.name,
      ...(0, _column.createColumn)(agg),
      references: [subMetric === null || subMetric === void 0 ? void 0 : subMetric.columnId],
      params: {},
      timeShift: (_agg$aggParams2 = agg.aggParams) === null || _agg$aggParams2 === void 0 ? void 0 : _agg$aggParams2.timeShift
    }, subMetric];
  } else {
    const formula = (0, _metrics.getFormulaForPipelineAgg)({
      agg,
      aggs,
      dataView,
      visType
    });
    if (!formula) {
      return null;
    }
    return (0, _formula.createFormulaColumn)(formula, agg);
  }
};
exports.convertToCumulativeSumAggColumn = convertToCumulativeSumAggColumn;