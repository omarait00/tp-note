"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertToRangeParams = exports.convertToRangeColumn = void 0;
var _uuid = _interopRequireDefault(require("uuid"));
var _constants = require("../../constants");
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const isHistogramAggParams = aggParams => {
  return aggParams && 'interval' in aggParams;
};
const convertToRangeParams = aggParams => {
  if (isHistogramAggParams(aggParams)) {
    var _aggParams$maxBars;
    return {
      type: _constants.RANGE_MODES.Histogram,
      maxBars: (_aggParams$maxBars = aggParams.maxBars) !== null && _aggParams$maxBars !== void 0 ? _aggParams$maxBars : 'auto',
      includeEmptyRows: aggParams.min_doc_count
    };
  } else {
    var _aggParams$ranges;
    return {
      type: _constants.RANGE_MODES.Range,
      maxBars: 'auto',
      ranges: (_aggParams$ranges = aggParams.ranges) === null || _aggParams$ranges === void 0 ? void 0 : _aggParams$ranges.map(range => {
        var _range$from, _range$to;
        return {
          label: range.label,
          from: (_range$from = range.from) !== null && _range$from !== void 0 ? _range$from : null,
          to: (_range$to = range.to) !== null && _range$to !== void 0 ? _range$to : null
        };
      })
    };
  }
};
exports.convertToRangeParams = convertToRangeParams;
const convertToRangeColumn = (aggId, aggParams, label, dataView, isSplit = false) => {
  const fieldName = (0, _utils.getFieldNameFromField)(aggParams.field);
  if (!fieldName) {
    return null;
  }
  const field = dataView.getFieldByName(fieldName);
  if (!field) {
    return null;
  }
  const params = convertToRangeParams(aggParams);
  return {
    columnId: (0, _uuid.default)(),
    label,
    operationType: 'range',
    dataType: field.type,
    isBucketed: true,
    isSplit,
    sourceField: field.name,
    params,
    timeShift: aggParams.timeShift,
    meta: {
      aggId
    }
  };
};
exports.convertToRangeColumn = convertToRangeColumn;