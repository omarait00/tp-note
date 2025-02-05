"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertToLastValueColumn = void 0;
var _common = require("../../../../../data/common");
var _utils = require("../../utils");
var _utils2 = require("../utils");
var _column = require("./column");
var _supported_metrics = require("./supported_metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const convertToLastValueParams = agg => {
  return {
    sortField: agg.aggParams.sortField.name,
    showArrayValues: agg.aggType === _common.METRIC_TYPES.TOP_HITS
  };
};
const convertToLastValueColumn = ({
  visType,
  agg,
  dataView
}, reducedTimeRange) => {
  var _aggParams$sortOrder, _agg$aggParams, _field$name;
  const {
    aggParams
  } = agg;
  if (aggParams !== null && aggParams !== void 0 && aggParams.size && Number(aggParams === null || aggParams === void 0 ? void 0 : aggParams.size) !== 1 || (aggParams === null || aggParams === void 0 ? void 0 : (_aggParams$sortOrder = aggParams.sortOrder) === null || _aggParams$sortOrder === void 0 ? void 0 : _aggParams$sortOrder.value) !== 'desc') {
    return null;
  }
  const fieldName = (0, _utils2.getFieldNameFromField)(agg.aggParams.field);
  if (!fieldName) {
    return null;
  }
  const field = dataView.getFieldByName(fieldName);
  if (!(0, _utils.isFieldValid)(visType, field, _supported_metrics.SUPPORTED_METRICS[agg.aggType])) {
    return null;
  }
  if (!((_agg$aggParams = agg.aggParams) !== null && _agg$aggParams !== void 0 && _agg$aggParams.sortField)) {
    return null;
  }
  return {
    operationType: 'last_value',
    sourceField: (_field$name = field.name) !== null && _field$name !== void 0 ? _field$name : 'document',
    ...(0, _column.createColumn)(agg, field, {
      reducedTimeRange
    }),
    params: {
      ...convertToLastValueParams(agg),
      ...(0, _column.getFormat)()
    }
  };
};
exports.convertToLastValueColumn = convertToLastValueColumn;