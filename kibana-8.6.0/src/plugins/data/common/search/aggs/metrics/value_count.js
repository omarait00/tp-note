"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getValueCountMetricAgg = void 0;
var _i18n = require("@kbn/i18n");
var _value_count_fn = require("./value_count_fn");
var _metric_agg_type = require("./metric_agg_type");
var _metric_agg_types = require("./metric_agg_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const valueCountTitle = _i18n.i18n.translate('data.search.aggs.metrics.valueCountTitle', {
  defaultMessage: 'Value Count'
});
const getValueCountMetricAgg = () => new _metric_agg_type.MetricAggType({
  name: _metric_agg_types.METRIC_TYPES.VALUE_COUNT,
  valueType: 'number',
  expressionName: _value_count_fn.aggValueCountFnName,
  title: valueCountTitle,
  enableEmptyAsNull: true,
  makeLabel(aggConfig) {
    return _i18n.i18n.translate('data.search.aggs.metrics.valueCountLabel', {
      defaultMessage: 'Value count of {field}',
      values: {
        field: aggConfig.getFieldDisplayName()
      }
    });
  },
  getSerializedFormat(agg) {
    return {
      id: 'number'
    };
  },
  params: [{
    name: 'field',
    type: 'field'
  }]
});
exports.getValueCountMetricAgg = getValueCountMetricAgg;