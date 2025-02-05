"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMetricWithField = exports.convertMetricAggregationColumnWithoutSpecialParams = void 0;
var _common = require("../../../../../data/common");
var _constants = require("../../constants");
var _column = require("./column");
var _utils = require("../utils");
var _utils2 = require("../../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const SUPPORTED_METRICS_AGGS_WITHOUT_PARAMS = [_constants.Operations.AVERAGE, _constants.Operations.COUNT, _constants.Operations.UNIQUE_COUNT, _constants.Operations.MAX, _constants.Operations.MIN, _constants.Operations.MEDIAN, _constants.Operations.SUM];
const isSupportedAggregationWithoutParams = agg => {
  return SUPPORTED_METRICS_AGGS_WITHOUT_PARAMS.includes(agg);
};
const isMetricWithField = agg => {
  return agg.aggType !== _common.METRIC_TYPES.COUNT;
};
exports.isMetricWithField = isMetricWithField;
const convertMetricAggregationColumnWithoutSpecialParams = (aggregation, {
  visType,
  agg,
  dataView
}, reducedTimeRange) => {
  var _agg$aggParams2;
  if (!isSupportedAggregationWithoutParams(aggregation.name)) {
    return null;
  }
  let sourceField;
  if (isMetricWithField(agg)) {
    var _getFieldNameFromFiel, _agg$aggParams;
    sourceField = (_getFieldNameFromFiel = (0, _utils.getFieldNameFromField)((_agg$aggParams = agg.aggParams) === null || _agg$aggParams === void 0 ? void 0 : _agg$aggParams.field)) !== null && _getFieldNameFromFiel !== void 0 ? _getFieldNameFromFiel : 'document';
  } else {
    sourceField = 'document';
  }
  const field = dataView.getFieldByName(sourceField);
  if (!(0, _utils2.isFieldValid)(visType, field, aggregation)) {
    return null;
  }
  const column = (0, _column.createColumn)(agg, field, {
    reducedTimeRange
  });
  return {
    operationType: aggregation.name,
    sourceField,
    ...column,
    dataType: [_constants.Operations.COUNT, _constants.Operations.UNIQUE_COUNT].includes(aggregation.name) ? 'number' : column.dataType,
    params: {
      ...(0, _column.getFormat)()
    },
    timeShift: (_agg$aggParams2 = agg.aggParams) === null || _agg$aggParams2 === void 0 ? void 0 : _agg$aggParams2.timeShift
  };
};
exports.convertMetricAggregationColumnWithoutSpecialParams = convertMetricAggregationColumnWithoutSpecialParams;