"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertToPercentileParams = exports.convertToPercentileColumn = void 0;
var _common = require("../../../../../data/common");
var _ = require("../..");
var _utils = require("../utils");
var _column = require("./column");
var _supported_metrics = require("./supported_metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const convertToPercentileParams = percentile => ({
  percentile
});
exports.convertToPercentileParams = convertToPercentileParams;
const isSinglePercentile = agg => {
  if (agg.aggType === _common.METRIC_TYPES.SINGLE_PERCENTILE) {
    return true;
  }
  return false;
};
const getPercent = agg => {
  if (isSinglePercentile(agg)) {
    var _agg$aggParams;
    return (_agg$aggParams = agg.aggParams) === null || _agg$aggParams === void 0 ? void 0 : _agg$aggParams.percentile;
  }
  const {
    aggParams,
    aggId
  } = agg;
  if (!aggParams || !aggId) {
    return null;
  }
  const {
    percents
  } = aggParams;
  const [, percentStr] = aggId.split('.');
  const percent = Number(percentStr);
  if (!percents || !percents.length || percentStr === '' || isNaN(percent)) {
    return null;
  }
  return percent;
};
const convertToPercentileColumn = ({
  visType,
  agg,
  dataView
}, {
  index,
  reducedTimeRange
} = {}) => {
  var _agg$aggParams2, _agg$aggParams3;
  const {
    aggParams,
    aggId
  } = agg;
  if (!aggParams || !aggId) {
    return null;
  }
  const percent = getPercent(agg);
  if (percent === null || percent === undefined) {
    return null;
  }
  const params = convertToPercentileParams(percent);
  const fieldName = (0, _utils.getFieldNameFromField)(agg === null || agg === void 0 ? void 0 : (_agg$aggParams2 = agg.aggParams) === null || _agg$aggParams2 === void 0 ? void 0 : _agg$aggParams2.field);
  if (!fieldName) {
    return null;
  }
  const field = dataView.getFieldByName(fieldName);
  if (!(0, _.isFieldValid)(visType, field, _supported_metrics.SUPPORTED_METRICS[agg.aggType])) {
    return null;
  }
  return {
    operationType: 'percentile',
    sourceField: field.name,
    ...(0, _column.createColumn)(agg, field, {
      reducedTimeRange
    }),
    params: {
      ...params,
      ...(0, _column.getFormat)()
    },
    label: (0, _utils.getLabelForPercentile)(agg),
    timeShift: (_agg$aggParams3 = agg.aggParams) === null || _agg$aggParams3 === void 0 ? void 0 : _agg$aggParams3.timeShift
  };
};
exports.convertToPercentileColumn = convertToPercentileColumn;