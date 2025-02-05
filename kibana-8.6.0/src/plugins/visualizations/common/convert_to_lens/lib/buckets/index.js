"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBucketColumns = exports.convertBucketToColumns = void 0;
var _common = require("../../../../../data/common");
var _vis_schemas = require("../../../vis_schemas");
var _convert = require("../convert");
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const SUPPORTED_BUCKETS = [_common.BUCKET_TYPES.TERMS, _common.BUCKET_TYPES.DATE_HISTOGRAM, _common.BUCKET_TYPES.FILTERS, _common.BUCKET_TYPES.RANGE, _common.BUCKET_TYPES.HISTOGRAM];
const isSupportedBucketAgg = agg => {
  return SUPPORTED_BUCKETS.includes(agg.aggType);
};
const getBucketColumns = ({
  agg,
  dataView,
  metricColumns,
  aggs,
  visType
}, {
  label,
  isSplit = false,
  dropEmptyRowsInDateHistogram = false
}) => {
  var _agg$aggId, _agg$aggId2, _agg$aggId3;
  if (!agg.aggParams) {
    return null;
  }
  switch (agg.aggType) {
    case _common.BUCKET_TYPES.DATE_HISTOGRAM:
      return (0, _convert.convertToDateHistogramColumn)((_agg$aggId = agg.aggId) !== null && _agg$aggId !== void 0 ? _agg$aggId : '', agg.aggParams, dataView, isSplit, dropEmptyRowsInDateHistogram);
    case _common.BUCKET_TYPES.FILTERS:
      return (0, _convert.convertToFiltersColumn)((_agg$aggId2 = agg.aggId) !== null && _agg$aggId2 !== void 0 ? _agg$aggId2 : '', agg.aggParams, isSplit);
    case _common.BUCKET_TYPES.RANGE:
    case _common.BUCKET_TYPES.HISTOGRAM:
      return (0, _convert.convertToRangeColumn)((_agg$aggId3 = agg.aggId) !== null && _agg$aggId3 !== void 0 ? _agg$aggId3 : '', agg.aggParams, label, dataView, isSplit);
    case _common.BUCKET_TYPES.TERMS:
      const fieldName = (0, _utils.getFieldNameFromField)(agg.aggParams.field);
      if (!fieldName) {
        return null;
      }
      const field = dataView.getFieldByName(fieldName);
      if (!field) {
        return null;
      }
      if (field.type !== 'date') {
        var _agg$aggId4;
        return (0, _convert.convertToTermsColumn)((_agg$aggId4 = agg.aggId) !== null && _agg$aggId4 !== void 0 ? _agg$aggId4 : '', {
          agg,
          dataView,
          metricColumns,
          aggs,
          visType
        }, label, isSplit);
      } else {
        var _agg$aggId5;
        return (0, _convert.convertToDateHistogramColumn)((_agg$aggId5 = agg.aggId) !== null && _agg$aggId5 !== void 0 ? _agg$aggId5 : '', {
          field: fieldName
        }, dataView, isSplit, dropEmptyRowsInDateHistogram);
      }
  }
  return null;
};
exports.getBucketColumns = getBucketColumns;
const convertBucketToColumns = ({
  agg,
  dataView,
  metricColumns,
  aggs,
  visType
}, isSplit = false, dropEmptyRowsInDateHistogram = false) => {
  const currentAgg = (0, _utils.isSchemaConfig)(agg) ? agg : (0, _vis_schemas.convertToSchemaConfig)(agg);
  if (!currentAgg.aggParams || !isSupportedBucketAgg(currentAgg)) {
    return null;
  }
  return getBucketColumns({
    agg: currentAgg,
    dataView,
    metricColumns,
    aggs,
    visType
  }, {
    label: (0, _utils.getLabel)(currentAgg),
    isSplit,
    dropEmptyRowsInDateHistogram
  });
};
exports.convertBucketToColumns = convertBucketToColumns;