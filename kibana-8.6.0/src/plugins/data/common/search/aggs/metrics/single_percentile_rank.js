"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSinglePercentileRankMetricAgg = void 0;
var _i18n = require("@kbn/i18n");
var _single_percentile_rank_fn = require("./single_percentile_rank_fn");
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

const singlePercentileTitle = _i18n.i18n.translate('data.search.aggs.metrics.singlePercentileRankTitle', {
  defaultMessage: 'Percentile rank'
});
const getSinglePercentileRankMetricAgg = () => {
  return new _metric_agg_type.MetricAggType({
    name: _metric_agg_types.METRIC_TYPES.SINGLE_PERCENTILE_RANK,
    expressionName: _single_percentile_rank_fn.aggSinglePercentileRankFnName,
    dslName: 'percentile_ranks',
    title: singlePercentileTitle,
    valueType: 'number',
    makeLabel(aggConfig) {
      return _i18n.i18n.translate('data.search.aggs.metrics.singlePercentileRankLabel', {
        defaultMessage: 'Percentile rank of {field}',
        values: {
          field: aggConfig.getFieldDisplayName()
        }
      });
    },
    getValueBucketPath(aggConfig) {
      return `${aggConfig.id}.${aggConfig.params.value}`;
    },
    getSerializedFormat(agg) {
      return {
        id: 'percent'
      };
    },
    params: [{
      name: 'field',
      type: 'field',
      filterFieldTypes: [_.KBN_FIELD_TYPES.NUMBER, _.KBN_FIELD_TYPES.HISTOGRAM]
    }, {
      name: 'value',
      default: 0,
      write: (agg, output) => {
        output.params.values = [agg.params.value];
      }
    }],
    getValue(agg, bucket) {
      var _bucket$agg$id;
      let valueKey = String(agg.params.value);
      if (Number.isInteger(agg.params.value)) {
        valueKey += '.0';
      }
      const {
        values
      } = (_bucket$agg$id = bucket[agg.id]) !== null && _bucket$agg$id !== void 0 ? _bucket$agg$id : {};
      return values ? values[valueKey] / 100 : NaN;
    }
  });
};
exports.getSinglePercentileRankMetricAgg = getSinglePercentileRankMetricAgg;