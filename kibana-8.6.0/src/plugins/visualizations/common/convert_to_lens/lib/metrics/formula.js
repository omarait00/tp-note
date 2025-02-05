"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFormulaForPipelineAgg = exports.getFormulaForAgg = exports.addTimeRangeToFormula = void 0;
var _ = require("../../..");
var _constants = require("../../constants");
var _convert = require("../convert");
var _supported_metrics = require("../convert/supported_metrics");
var _utils = require("../utils");
var _constants2 = require("../convert/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const addTimeRangeToFormula = reducedTimeRange => {
  return reducedTimeRange ? `, reducedTimeRange='${reducedTimeRange}'` : '';
};
exports.addTimeRangeToFormula = addTimeRangeToFormula;
const PARENT_PIPELINE_OPS = [_constants.Operations.CUMULATIVE_SUM, _constants.Operations.DIFFERENCES, _constants.Operations.MOVING_AVERAGE];
const METRIC_OPS_WITHOUT_PARAMS = [_constants.Operations.AVERAGE, _constants.Operations.MAX, _constants.Operations.MIN, _constants.Operations.SUM, _constants.Operations.UNIQUE_COUNT, _constants.Operations.COUNT];
const isDataViewField = field => {
  if (field && typeof field === 'object') {
    return true;
  }
  return false;
};
const isValidAgg = (visType, agg, dataView) => {
  const aggregation = _supported_metrics.SUPPORTED_METRICS[agg.aggType];
  if (!aggregation) {
    return false;
  }
  if ((0, _convert.isMetricWithField)(agg)) {
    var _agg$aggParams, _agg$aggParams2;
    if (!((_agg$aggParams = agg.aggParams) !== null && _agg$aggParams !== void 0 && _agg$aggParams.field)) {
      return false;
    }
    const sourceField = (0, _utils.getFieldNameFromField)((_agg$aggParams2 = agg.aggParams) === null || _agg$aggParams2 === void 0 ? void 0 : _agg$aggParams2.field);
    const field = dataView.getFieldByName(sourceField);
    if (!(0, _.isFieldValid)(visType, field, aggregation)) {
      return false;
    }
  }
  return true;
};
const getFormulaForAggsWithoutParams = (visType, agg, dataView, selector, reducedTimeRange) => {
  const op = _supported_metrics.SUPPORTED_METRICS[agg.aggType];
  if (!isValidAgg(visType, agg, dataView) || !op) {
    return null;
  }
  const formula = (0, _supported_metrics.getFormulaFromMetric)(op);
  return `${formula}(${selector !== null && selector !== void 0 ? selector : ''}${addTimeRangeToFormula(reducedTimeRange)})`;
};
const getFormulaForPercentileRanks = (visType, agg, dataView, selector, reducedTimeRange) => {
  var _agg$aggId;
  const value = Number((_agg$aggId = agg.aggId) === null || _agg$aggId === void 0 ? void 0 : _agg$aggId.split('.')[1]);
  const op = _supported_metrics.SUPPORTED_METRICS[agg.aggType];
  if (!isValidAgg(visType, agg, dataView) || !op) {
    return null;
  }
  const formula = (0, _supported_metrics.getFormulaFromMetric)(op);
  return `${formula}(${selector}, value=${value}${addTimeRangeToFormula(reducedTimeRange)})`;
};
const getFormulaForPercentile = (visType, agg, dataView, selector, reducedTimeRange) => {
  var _agg$aggId2;
  const percentile = Number((_agg$aggId2 = agg.aggId) === null || _agg$aggId2 === void 0 ? void 0 : _agg$aggId2.split('.')[1]);
  const op = _supported_metrics.SUPPORTED_METRICS[agg.aggType];
  if (!isValidAgg(visType, agg, dataView) || !op) {
    return null;
  }
  const formula = (0, _supported_metrics.getFormulaFromMetric)(op);
  return `${formula}(${selector}, percentile=${percentile}${addTimeRangeToFormula(reducedTimeRange)})`;
};
const getFormulaForSubMetric = ({
  agg,
  dataView,
  aggs,
  visType
}) => {
  const op = _supported_metrics.SUPPORTED_METRICS[agg.aggType];
  if (!op) {
    return null;
  }
  if (PARENT_PIPELINE_OPS.includes(op.name) || _constants2.SIBLING_PIPELINE_AGGS.includes(agg.aggType)) {
    return getFormulaForPipelineAgg({
      agg: agg,
      aggs,
      dataView,
      visType
    });
  }
  if (METRIC_OPS_WITHOUT_PARAMS.includes(op.name)) {
    var _metricAgg$aggParams, _metricAgg$aggParams2;
    const metricAgg = agg;
    return getFormulaForAggsWithoutParams(visType, metricAgg, dataView, metricAgg.aggParams && 'field' in metricAgg.aggParams ? isDataViewField(metricAgg.aggParams.field) ? (_metricAgg$aggParams = metricAgg.aggParams) === null || _metricAgg$aggParams === void 0 ? void 0 : _metricAgg$aggParams.field.displayName : (_metricAgg$aggParams2 = metricAgg.aggParams) === null || _metricAgg$aggParams2 === void 0 ? void 0 : _metricAgg$aggParams2.field : undefined);
  }
  if (op.name === _constants.Operations.PERCENTILE_RANK) {
    var _percentileRanksAgg$a;
    const percentileRanksAgg = agg;
    return getFormulaForPercentileRanks(visType, percentileRanksAgg, dataView, (_percentileRanksAgg$a = percentileRanksAgg.aggParams) === null || _percentileRanksAgg$a === void 0 ? void 0 : _percentileRanksAgg$a.field);
  }
  return null;
};
const getFormulaForPipelineAgg = ({
  agg,
  dataView,
  aggs,
  visType
}) => {
  const {
    aggType
  } = agg;
  const supportedAgg = _supported_metrics.SUPPORTED_METRICS[aggType];
  if (!supportedAgg) {
    return null;
  }
  const metricAgg = (0, _utils.getMetricFromParentPipelineAgg)(agg, aggs);
  if (!metricAgg) {
    return null;
  }
  const subFormula = getFormulaForSubMetric({
    agg: metricAgg,
    aggs,
    dataView,
    visType
  });
  if (subFormula === null) {
    return null;
  }
  if (PARENT_PIPELINE_OPS.includes(supportedAgg.name)) {
    const formula = (0, _supported_metrics.getFormulaFromMetric)(supportedAgg);
    return `${formula}(${subFormula})`;
  }
  return subFormula;
};
exports.getFormulaForPipelineAgg = getFormulaForPipelineAgg;
const getFormulaForAgg = ({
  agg,
  aggs,
  dataView,
  visType
}) => {
  var _getFieldNameFromFiel4, _agg$aggParams6;
  if ((0, _utils.isPipeline)(agg)) {
    return getFormulaForPipelineAgg({
      agg,
      aggs,
      dataView,
      visType
    });
  }
  if ((0, _utils.isPercentileAgg)(agg)) {
    var _getFieldNameFromFiel, _agg$aggParams3;
    return getFormulaForPercentile(visType, agg, dataView, (_getFieldNameFromFiel = (0, _utils.getFieldNameFromField)((_agg$aggParams3 = agg.aggParams) === null || _agg$aggParams3 === void 0 ? void 0 : _agg$aggParams3.field)) !== null && _getFieldNameFromFiel !== void 0 ? _getFieldNameFromFiel : '');
  }
  if ((0, _utils.isPercentileRankAgg)(agg)) {
    var _getFieldNameFromFiel2, _agg$aggParams4;
    return getFormulaForPercentileRanks(visType, agg, dataView, (_getFieldNameFromFiel2 = (0, _utils.getFieldNameFromField)((_agg$aggParams4 = agg.aggParams) === null || _agg$aggParams4 === void 0 ? void 0 : _agg$aggParams4.field)) !== null && _getFieldNameFromFiel2 !== void 0 ? _getFieldNameFromFiel2 : '');
  }
  if ((0, _utils.isStdDevAgg)(agg) && agg.aggId) {
    var _getFieldNameFromFiel3, _agg$aggParams5;
    if (!isValidAgg(visType, agg, dataView)) {
      return null;
    }
    return (0, _convert.getStdDeviationFormula)(agg.aggId, (_getFieldNameFromFiel3 = (0, _utils.getFieldNameFromField)((_agg$aggParams5 = agg.aggParams) === null || _agg$aggParams5 === void 0 ? void 0 : _agg$aggParams5.field)) !== null && _getFieldNameFromFiel3 !== void 0 ? _getFieldNameFromFiel3 : '');
  }
  return getFormulaForAggsWithoutParams(visType, agg, dataView, (0, _convert.isMetricWithField)(agg) ? (_getFieldNameFromFiel4 = (0, _utils.getFieldNameFromField)((_agg$aggParams6 = agg.aggParams) === null || _agg$aggParams6 === void 0 ? void 0 : _agg$aggParams6.field)) !== null && _getFieldNameFromFiel4 !== void 0 ? _getFieldNameFromFiel4 : '' : '');
};
exports.getFormulaForAgg = getFormulaForAgg;