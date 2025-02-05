"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMedianMetricAgg = void 0;
var _i18n = require("@kbn/i18n");
var _median_fn = require("./median_fn");
var _metric_agg_type = require("./metric_agg_type");
var _metric_agg_types = require("./metric_agg_types");
var _ = require("../../..");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const medianTitle = _i18n.i18n.translate('data.search.aggs.metrics.medianTitle', {
  defaultMessage: 'Median'
});
const getMedianMetricAgg = () => {
  return new _metric_agg_type.MetricAggType({
    name: _metric_agg_types.METRIC_TYPES.MEDIAN,
    expressionName: _median_fn.aggMedianFnName,
    dslName: 'percentiles',
    title: medianTitle,
    valueType: 'number',
    makeLabel(aggConfig) {
      return _i18n.i18n.translate('data.search.aggs.metrics.medianLabel', {
        defaultMessage: 'Median {field}',
        values: {
          field: aggConfig.getFieldDisplayName()
        }
      });
    },
    getValueBucketPath(aggConfig) {
      return `${aggConfig.id}.50`;
    },
    params: [{
      name: 'field',
      type: 'field',
      filterFieldTypes: [_.KBN_FIELD_TYPES.NUMBER, _.KBN_FIELD_TYPES.DATE, _.KBN_FIELD_TYPES.HISTOGRAM]
    }, {
      name: 'percents',
      default: [50],
      shouldShow: () => false,
      serialize: () => undefined
    }],
    getValue(agg, bucket) {
      var _bucket$agg$id;
      return (_bucket$agg$id = bucket[agg.id]) === null || _bucket$agg$id === void 0 ? void 0 : _bucket$agg$id.values['50.0'];
    }
  });
};
exports.getMedianMetricAgg = getMedianMetricAgg;