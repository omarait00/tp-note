"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertToTermsParams = exports.convertToTermsColumn = void 0;
var _uuid = _interopRequireDefault(require("uuid"));
var _utils = require("../utils");
var _vis_schemas = require("../../../vis_schemas");
var _metrics = require("../metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const getOrderByWithAgg = ({
  agg,
  dataView,
  aggs,
  visType,
  metricColumns
}) => {
  if (!agg.aggParams) {
    return null;
  }
  if (agg.aggParams.orderBy === '_key') {
    return {
      orderBy: {
        type: 'alphabetical'
      }
    };
  }
  if (agg.aggParams.orderBy === 'custom') {
    if (!agg.aggParams.orderAgg) {
      return null;
    }
    const orderMetricColumn = (0, _metrics.convertMetricToColumns)({
      agg: (0, _vis_schemas.convertToSchemaConfig)(agg.aggParams.orderAgg),
      dataView,
      aggs,
      visType
    });
    if (!orderMetricColumn) {
      return null;
    }
    return {
      orderBy: {
        type: 'custom'
      },
      orderAgg: orderMetricColumn[0]
    };
  }
  const orderAgg = metricColumns.find(column => {
    if ((0, _utils.isColumnWithMeta)(column)) {
      var _agg$aggParams;
      return column.meta.aggId === ((_agg$aggParams = agg.aggParams) === null || _agg$aggParams === void 0 ? void 0 : _agg$aggParams.orderBy);
    }
    return false;
  });
  if (!orderAgg) {
    return null;
  }
  return {
    orderBy: {
      type: 'column',
      columnId: orderAgg.columnId
    },
    orderAgg
  };
};
const filterOutEmptyValues = values => {
  if (typeof values === 'string') {
    return Boolean(values) ? [values] : [];
  }
  return values.filter(v => {
    if (typeof v === 'string') {
      return Boolean(v);
    }
    return true;
  });
};
const convertToTermsParams = ({
  agg,
  dataView,
  aggs,
  metricColumns,
  visType
}) => {
  var _agg$aggParams$size, _agg$aggParams$order$, _agg$aggParams$order;
  if (!agg.aggParams) {
    return null;
  }
  const orderByWithAgg = getOrderByWithAgg({
    agg,
    dataView,
    aggs,
    metricColumns,
    visType
  });
  if (orderByWithAgg === null) {
    return null;
  }
  const exclude = agg.aggParams.exclude ? filterOutEmptyValues(agg.aggParams.exclude) : [];
  const include = agg.aggParams.include ? filterOutEmptyValues(agg.aggParams.include) : [];
  return {
    size: (_agg$aggParams$size = agg.aggParams.size) !== null && _agg$aggParams$size !== void 0 ? _agg$aggParams$size : 10,
    include,
    exclude,
    includeIsRegex: Boolean(include.length && agg.aggParams.includeIsRegex),
    excludeIsRegex: Boolean(exclude.length && agg.aggParams.excludeIsRegex),
    otherBucket: agg.aggParams.otherBucket,
    orderDirection: (_agg$aggParams$order$ = (_agg$aggParams$order = agg.aggParams.order) === null || _agg$aggParams$order === void 0 ? void 0 : _agg$aggParams$order.value) !== null && _agg$aggParams$order$ !== void 0 ? _agg$aggParams$order$ : 'desc',
    parentFormat: {
      id: 'terms'
    },
    missingBucket: agg.aggParams.missingBucket,
    ...orderByWithAgg
  };
};
exports.convertToTermsParams = convertToTermsParams;
const convertToTermsColumn = (aggId, {
  agg,
  dataView,
  aggs,
  metricColumns,
  visType
}, label, isSplit) => {
  var _agg$aggParams2, _getFieldNameFromFiel, _agg$aggParams3, _ref, _agg$aggParams4;
  if (!((_agg$aggParams2 = agg.aggParams) !== null && _agg$aggParams2 !== void 0 && _agg$aggParams2.field)) {
    return null;
  }
  const sourceField = (_getFieldNameFromFiel = (0, _utils.getFieldNameFromField)((_agg$aggParams3 = agg.aggParams) === null || _agg$aggParams3 === void 0 ? void 0 : _agg$aggParams3.field)) !== null && _getFieldNameFromFiel !== void 0 ? _getFieldNameFromFiel : 'document';
  const field = dataView.getFieldByName(sourceField);
  if (!field) {
    return null;
  }
  const params = convertToTermsParams({
    agg,
    dataView,
    aggs,
    metricColumns,
    visType
  });
  if (!params) {
    return null;
  }
  return {
    columnId: (0, _uuid.default)(),
    operationType: 'terms',
    label,
    dataType: (_ref = field.type) !== null && _ref !== void 0 ? _ref : undefined,
    sourceField: field.name,
    isBucketed: true,
    isSplit,
    params: {
      ...params
    },
    timeShift: (_agg$aggParams4 = agg.aggParams) === null || _agg$aggParams4 === void 0 ? void 0 : _agg$aggParams4.timeShift,
    meta: {
      aggId
    }
  };
};
exports.convertToTermsColumn = convertToTermsColumn;