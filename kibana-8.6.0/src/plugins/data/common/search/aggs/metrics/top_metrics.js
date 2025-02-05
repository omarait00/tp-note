"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTopMetricsMetricAgg = void 0;
var _lodash = _interopRequireDefault(require("lodash"));
var _i18n = require("@kbn/i18n");
var _top_metrics_fn = require("./top_metrics_fn");
var _metric_agg_type = require("./metric_agg_type");
var _metric_agg_types = require("./metric_agg_types");
var _2 = require("../../..");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const getTopMetricsMetricAgg = () => {
  return new _metric_agg_type.MetricAggType({
    name: _metric_agg_types.METRIC_TYPES.TOP_METRICS,
    expressionName: _top_metrics_fn.aggTopMetricsFnName,
    title: _i18n.i18n.translate('data.search.aggs.metrics.topMetricsTitle', {
      defaultMessage: 'Top metrics'
    }),
    makeLabel(aggConfig) {
      const isDescOrder = aggConfig.getParam('sortOrder').value === 'desc';
      const size = aggConfig.getParam('size');
      const field = aggConfig.getParam('field');
      const sortField = aggConfig.getParam('sortField');
      if (isDescOrder) {
        if (size > 1) {
          var _sortField$displayNam;
          return _i18n.i18n.translate('data.search.aggs.metrics.topMetrics.descWithSizeLabel', {
            defaultMessage: `Last {size} "{fieldName}" values by "{sortField}"`,
            values: {
              size,
              fieldName: field === null || field === void 0 ? void 0 : field.displayName,
              sortField: (_sortField$displayNam = sortField === null || sortField === void 0 ? void 0 : sortField.displayName) !== null && _sortField$displayNam !== void 0 ? _sortField$displayNam : '_score'
            }
          });
        } else {
          var _sortField$displayNam2;
          return _i18n.i18n.translate('data.search.aggs.metrics.topMetrics.descNoSizeLabel', {
            defaultMessage: `Last "{fieldName}" value by "{sortField}"`,
            values: {
              fieldName: field === null || field === void 0 ? void 0 : field.displayName,
              sortField: (_sortField$displayNam2 = sortField === null || sortField === void 0 ? void 0 : sortField.displayName) !== null && _sortField$displayNam2 !== void 0 ? _sortField$displayNam2 : '_score'
            }
          });
        }
      } else {
        if (size > 1) {
          var _sortField$displayNam3;
          return _i18n.i18n.translate('data.search.aggs.metrics.topMetrics.ascWithSizeLabel', {
            defaultMessage: `First {size} "{fieldName}" values by "{sortField}"`,
            values: {
              size,
              fieldName: field === null || field === void 0 ? void 0 : field.displayName,
              sortField: (_sortField$displayNam3 = sortField === null || sortField === void 0 ? void 0 : sortField.displayName) !== null && _sortField$displayNam3 !== void 0 ? _sortField$displayNam3 : '_score'
            }
          });
        } else {
          var _sortField$displayNam4;
          return _i18n.i18n.translate('data.search.aggs.metrics.topMetrics.ascNoSizeLabel', {
            defaultMessage: `First "{fieldName}" value by "{sortField}"`,
            values: {
              fieldName: field === null || field === void 0 ? void 0 : field.displayName,
              sortField: (_sortField$displayNam4 = sortField === null || sortField === void 0 ? void 0 : sortField.displayName) !== null && _sortField$displayNam4 !== void 0 ? _sortField$displayNam4 : '_score'
            }
          });
        }
      }
    },
    params: [{
      name: 'field',
      type: 'field',
      scriptable: false,
      filterFieldTypes: [_2.KBN_FIELD_TYPES.STRING, _2.KBN_FIELD_TYPES.IP, _2.KBN_FIELD_TYPES.BOOLEAN, _2.KBN_FIELD_TYPES.NUMBER, _2.KBN_FIELD_TYPES.DATE],
      write(agg, output) {
        const field = agg.getParam('field');
        output.params.metrics = {
          field: field.name
        };
      }
    }, {
      name: 'size',
      default: 1
    }, {
      name: 'sortField',
      type: 'field',
      scriptable: false,
      filterFieldTypes: [_2.KBN_FIELD_TYPES.NUMBER, _2.KBN_FIELD_TYPES.DATE],
      default(agg) {
        return agg.getIndexPattern().timeFieldName;
      },
      write: _lodash.default.noop // prevent default write, it is handled below
    }, {
      name: 'sortOrder',
      type: 'optioned',
      default: 'desc',
      options: [{
        text: _i18n.i18n.translate('data.search.aggs.metrics.topMetrics.descendingLabel', {
          defaultMessage: 'Descending'
        }),
        value: 'desc'
      }, {
        text: _i18n.i18n.translate('data.search.aggs.metrics.topMetrics.ascendingLabel', {
          defaultMessage: 'Ascending'
        }),
        value: 'asc'
      }],
      write(agg, output) {
        const sortField = agg.params.sortField;
        const sortOrder = agg.params.sortOrder;
        if (sortField && sortOrder) {
          output.params.sort = {
            [sortField.name]: sortOrder.value
          };
        } else {
          output.params.sort = '_score';
        }
      }
    }],
    // override is needed to support top_metrics as an orderAgg of terms agg
    getValueBucketPath(agg) {
      const field = agg.getParam('field').name;
      return `${agg.id}[${field}]`;
    },
    getValue(agg, aggregate) {
      var _aggregate$agg$id$top, _aggregate$agg$id;
      const metricFieldName = agg.getParam('field').name;
      const results = (_aggregate$agg$id$top = (_aggregate$agg$id = aggregate[agg.id]) === null || _aggregate$agg$id === void 0 ? void 0 : _aggregate$agg$id.top.map(result => result.metrics[metricFieldName])) !== null && _aggregate$agg$id$top !== void 0 ? _aggregate$agg$id$top : [];
      if (results.length === 0) return null;
      if (results.length === 1) return results[0];
      return results;
    }
  });
};
exports.getTopMetricsMetricAgg = getTopMetricsMetricAgg;