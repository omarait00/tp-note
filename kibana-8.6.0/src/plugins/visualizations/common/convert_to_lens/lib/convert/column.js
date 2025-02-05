"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFormat = exports.createColumn = exports.createAggregationId = void 0;
var _uuid = _interopRequireDefault(require("uuid"));
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const createAggregationId = agg => `${agg.aggId}`;
exports.createAggregationId = createAggregationId;
const getFormat = () => {
  return {};
};
exports.getFormat = getFormat;
const createColumn = (agg, field, {
  isBucketed = false,
  isSplit = false,
  reducedTimeRange
} = {}) => {
  var _ref, _agg$aggParams;
  return {
    columnId: (0, _uuid.default)(),
    dataType: (_ref = field === null || field === void 0 ? void 0 : field.type) !== null && _ref !== void 0 ? _ref : 'number',
    label: (0, _utils.getLabel)(agg),
    isBucketed,
    isSplit,
    reducedTimeRange,
    timeShift: (_agg$aggParams = agg.aggParams) === null || _agg$aggParams === void 0 ? void 0 : _agg$aggParams.timeShift,
    meta: {
      aggId: createAggregationId(agg)
    }
  };
};
exports.createColumn = createColumn;