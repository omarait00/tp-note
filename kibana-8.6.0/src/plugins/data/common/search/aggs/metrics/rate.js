"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRateMetricAgg = void 0;
var _i18n = require("@kbn/i18n");
var _rate_fn = require("./rate_fn");
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

const rateTitle = _i18n.i18n.translate('data.search.aggs.metrics.rateTitle', {
  defaultMessage: 'Rate'
});
const getRateMetricAgg = () => {
  return new _metric_agg_type.MetricAggType({
    name: _metric_agg_types.METRIC_TYPES.RATE,
    expressionName: _rate_fn.aggRateFnName,
    title: rateTitle,
    valueType: 'number',
    makeLabel: aggConfig => {
      return _i18n.i18n.translate('data.search.aggs.metrics.rateLabel', {
        defaultMessage: 'Rate of {field} per {unit}',
        values: {
          field: aggConfig.getFieldDisplayName(),
          unit: aggConfig.getParam('unit')
        }
      });
    },
    params: [{
      name: 'field',
      type: 'field',
      required: false,
      filterFieldTypes: [_.KBN_FIELD_TYPES.NUMBER, _.KBN_FIELD_TYPES.HISTOGRAM]
    }, {
      name: 'unit',
      type: 'string',
      displayName: _i18n.i18n.translate('data.search.aggs.metrics.rate.unit.displayName', {
        defaultMessage: 'Unit'
      }),
      required: true,
      options: [{
        text: _i18n.i18n.translate('data.search.aggs.metrics.rate.unit.second', {
          defaultMessage: 'Second'
        }),
        value: 'second'
      }, {
        text: _i18n.i18n.translate('data.search.aggs.metrics.rate.unit.minute', {
          defaultMessage: 'Minute'
        }),
        value: 'minute'
      }, {
        text: _i18n.i18n.translate('data.search.aggs.metrics.rate.unit.hour', {
          defaultMessage: 'Hour'
        }),
        value: 'hour'
      }, {
        text: _i18n.i18n.translate('data.search.aggs.metrics.rate.unit.day', {
          defaultMessage: 'Day'
        }),
        value: 'day'
      }, {
        text: _i18n.i18n.translate('data.search.aggs.metrics.rate.unit.week', {
          defaultMessage: 'Week'
        }),
        value: 'week'
      }, {
        text: _i18n.i18n.translate('data.search.aggs.metrics.rate.unit.month', {
          defaultMessage: 'Month'
        }),
        value: 'month'
      }, {
        text: _i18n.i18n.translate('data.search.aggs.metrics.rate.unit.quarter', {
          defaultMessage: 'Quarter'
        }),
        value: 'quarter'
      }, {
        text: _i18n.i18n.translate('data.search.aggs.metrics.rate.unit.year', {
          defaultMessage: 'Year'
        }),
        value: 'year'
      }]
    }]
  });
};
exports.getRateMetricAgg = getRateMetricAgg;