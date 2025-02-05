"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLabel = exports.convertToDateHistogramParams = exports.convertToDateHistogramColumn = void 0;
var _uuid = _interopRequireDefault(require("uuid"));
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const getLabel = (aggParams, fieldName) => {
  var _aggParams$customLabe;
  return aggParams && 'customLabel' in aggParams ? (_aggParams$customLabe = aggParams.customLabel) !== null && _aggParams$customLabe !== void 0 ? _aggParams$customLabe : fieldName : fieldName;
};
exports.getLabel = getLabel;
const convertToDateHistogramParams = (aggParams, dropEmptyRowsInDateHistogram) => {
  var _aggParams$interval;
  return {
    interval: (_aggParams$interval = aggParams.interval) !== null && _aggParams$interval !== void 0 ? _aggParams$interval : 'auto',
    dropPartials: aggParams.drop_partials,
    includeEmptyRows: !dropEmptyRowsInDateHistogram
  };
};
exports.convertToDateHistogramParams = convertToDateHistogramParams;
const convertToDateHistogramColumn = (aggId, aggParams, dataView, isSplit, dropEmptyRowsInDateHistogram) => {
  const dateFieldName = (0, _utils.getFieldNameFromField)(aggParams.field);
  if (!dateFieldName) {
    return null;
  }
  const dateField = dataView.getFieldByName(dateFieldName);
  if (!dateField) {
    return null;
  }
  const params = convertToDateHistogramParams(aggParams, dropEmptyRowsInDateHistogram);
  const label = getLabel(aggParams, dateFieldName);
  return {
    columnId: (0, _uuid.default)(),
    label,
    operationType: 'date_histogram',
    dataType: dateField.type,
    isBucketed: true,
    isSplit,
    sourceField: dateField.name,
    params,
    timeShift: aggParams.timeShift,
    meta: {
      aggId
    }
  };
};
exports.convertToDateHistogramColumn = convertToDateHistogramColumn;