"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDateHistogramBucketAgg = void 0;
exports.isDateHistogramBucketAggConfig = isDateHistogramBucketAggConfig;
var _lodash = require("lodash");
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _i18n = require("@kbn/i18n");
var _ = require("../../..");
var _expressions = require("../../expressions");
var _interval_options = require("./_interval_options");
var _date_histogram = require("./create_filter/date_histogram");
var _bucket_agg_type = require("./bucket_agg_type");
var _bucket_agg_types = require("./bucket_agg_types");
var _date_histogram_fn = require("./date_histogram_fn");
var _time_buckets = require("./lib/time_buckets");
var _agg_params = require("../agg_params");
var _metric_agg_type = require("../metrics/metric_agg_type");
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const updateTimeBuckets = (agg, calculateBounds, customBuckets) => {
  const bounds = agg.params.timeRange && (agg.fieldIsTimeField() || (0, _interval_options.isAutoInterval)(agg.params.interval)) ? calculateBounds(agg.params.timeRange) : undefined;
  const buckets = customBuckets || agg.buckets;
  buckets.setBounds(bounds);
  buckets.setInterval(agg.params.interval);
};
function isDateHistogramBucketAggConfig(agg) {
  return Boolean(agg.buckets);
}
const getDateHistogramBucketAgg = ({
  calculateBounds,
  aggExecutionContext,
  getConfig
}) => new _bucket_agg_type.BucketAggType({
  name: _bucket_agg_types.BUCKET_TYPES.DATE_HISTOGRAM,
  expressionName: _date_histogram_fn.aggDateHistogramFnName,
  title: _i18n.i18n.translate('data.search.aggs.buckets.dateHistogramTitle', {
    defaultMessage: 'Date Histogram'
  }),
  ordered: {
    date: true
  },
  makeLabel(agg) {
    let output = {};
    if (this.params) {
      output = (0, _agg_params.writeParams)(this.params, agg);
    }
    const field = agg.getFieldDisplayName();
    return _i18n.i18n.translate('data.search.aggs.buckets.dateHistogramLabel', {
      defaultMessage: '{fieldName} per {intervalDescription}',
      values: {
        fieldName: field,
        intervalDescription: output.metricScaleText || output.bucketInterval.description
      }
    });
  },
  createFilter: _date_histogram.createFilterDateHistogram,
  decorateAggConfig() {
    let buckets;
    return {
      buckets: {
        configurable: true,
        get() {
          if (buckets) return buckets;
          buckets = new _time_buckets.TimeBuckets({
            'histogram:maxBars': getConfig(_.UI_SETTINGS.HISTOGRAM_MAX_BARS),
            'histogram:barTarget': getConfig(_.UI_SETTINGS.HISTOGRAM_BAR_TARGET),
            dateFormat: getConfig('dateFormat'),
            'dateFormat:scaled': getConfig('dateFormat:scaled')
          });
          updateTimeBuckets(this, calculateBounds, buckets);
          return buckets;
        }
      }
    };
  },
  getSerializedFormat(agg) {
    return {
      id: 'date',
      params: {
        pattern: agg.buckets.getScaledDateFormat()
      }
    };
  },
  getShiftedKey(agg, key, timeShift) {
    const tz = (0, _utils.inferTimeZone)(agg.params, agg.getIndexPattern(), 'date_histogram', getConfig, aggExecutionContext);
    return _momentTimezone.default.tz(key, tz).add(timeShift).valueOf();
  },
  splitForTimeShift(agg, aggs) {
    var _aggs$timeFields;
    return aggs.hasTimeShifts() && Boolean((_aggs$timeFields = aggs.timeFields) === null || _aggs$timeFields === void 0 ? void 0 : _aggs$timeFields.includes(agg.fieldName()));
  },
  getTimeShiftInterval(agg) {
    const {
      useNormalizedEsInterval
    } = agg.params;
    const interval = agg.buckets.getInterval(useNormalizedEsInterval);
    return interval;
  },
  params: [{
    name: 'field',
    type: 'field',
    filterFieldTypes: [_.KBN_FIELD_TYPES.DATE, _.KBN_FIELD_TYPES.DATE_RANGE],
    default(agg) {
      var _agg$getIndexPattern$, _agg$getIndexPattern, _agg$getIndexPattern$2;
      return (_agg$getIndexPattern$ = (_agg$getIndexPattern = agg.getIndexPattern()).getTimeField) === null || _agg$getIndexPattern$ === void 0 ? void 0 : (_agg$getIndexPattern$2 = _agg$getIndexPattern$.call(_agg$getIndexPattern)) === null || _agg$getIndexPattern$2 === void 0 ? void 0 : _agg$getIndexPattern$2.name;
    },
    onChange(agg) {
      if ((0, _interval_options.isAutoInterval)((0, _lodash.get)(agg, 'params.interval')) && !agg.fieldIsTimeField()) {
        delete agg.params.interval;
      }
    }
  }, {
    name: 'timeRange',
    default: null,
    write: _lodash.noop,
    toExpressionAst: _expressions.timerangeToAst
  }, {
    name: 'useNormalizedEsInterval',
    default: true,
    write: _lodash.noop
  }, {
    name: 'extendToTimeRange',
    default: false,
    write: _lodash.noop
  }, {
    name: 'scaleMetricValues',
    default: false,
    write: _lodash.noop,
    advanced: true
  }, {
    name: 'interval',
    deserialize(state, agg) {
      // For upgrading from 7.0.x to 7.1.x - intervals are now stored as key of options or custom value
      if (state === 'custom') {
        return (0, _lodash.get)(agg, 'params.customInterval');
      }
      const interval = (0, _lodash.find)(_interval_options.intervalOptions, {
        val: state
      });

      // For upgrading from 4.0.x to 4.1.x - intervals are now stored as 'y' instead of 'year',
      // but this maps the old values to the new values
      if (!interval && state === 'year') {
        return 'y';
      }
      return state;
    },
    default: _interval_options.autoInterval,
    options: _interval_options.intervalOptions,
    write(agg, output, aggs) {
      var _agg$params$field, _agg$params$field$fix;
      updateTimeBuckets(agg, calculateBounds);
      const {
        useNormalizedEsInterval,
        scaleMetricValues
      } = agg.params;
      const interval = agg.buckets.getInterval(useNormalizedEsInterval);
      output.bucketInterval = interval;
      if (interval.expression === '0ms') {
        // We are hitting this code a couple of times while configuring in editor
        // with an interval of 0ms because the overall time range has not yet been
        // set. Since 0ms is not a valid ES interval, we cannot pass it through dateHistogramInterval
        // below, since it would throw an exception. So in the cases we still have an interval of 0ms
        // here we simply skip the rest of the method and never write an interval into the DSL, since
        // this DSL will anyway not be used before we're passing this code with an actual interval.
        return;
      }
      const shouldForceFixedInterval = (_agg$params$field = agg.params.field) === null || _agg$params$field === void 0 ? void 0 : (_agg$params$field$fix = _agg$params$field.fixedInterval) === null || _agg$params$field$fix === void 0 ? void 0 : _agg$params$field$fix.length;
      output.params = {
        ...output.params,
        ...(0, _utils.dateHistogramInterval)(interval.expression, shouldForceFixedInterval)
      };
      const scaleMetrics = scaleMetricValues && interval.scaled && interval.scale && interval.scale < 1;
      if (scaleMetrics && aggs) {
        const metrics = aggs.aggs.filter(a => (0, _metric_agg_type.isMetricAggType)(a.type));
        const all = (0, _lodash.every)(metrics, a => {
          const {
            type
          } = a;
          if ((0, _metric_agg_type.isMetricAggType)(type)) {
            return type.isScalable();
          }
        });
        if (all) {
          var _interval$preScaled;
          output.metricScale = interval.scale;
          output.metricScaleText = ((_interval$preScaled = interval.preScaled) === null || _interval$preScaled === void 0 ? void 0 : _interval$preScaled.description) || '';
        }
      }
    }
  }, {
    name: 'used_interval',
    default: _interval_options.autoInterval,
    shouldShow() {
      return false;
    },
    write: () => {},
    serialize(val, agg) {
      if (!agg) return undefined;
      const {
        useNormalizedEsInterval
      } = agg.params;
      const interval = agg.buckets.getInterval(useNormalizedEsInterval);
      return interval.expression;
    },
    toExpressionAst: () => undefined
  }, {
    name: 'time_zone',
    default: undefined,
    // We don't ever want this parameter to be serialized out (when saving or to URLs)
    // since we do all the logic handling it "on the fly" in the `write` method, to prevent
    // time_zones being persisted into saved_objects
    serialize: _lodash.noop,
    write(agg, output) {
      var _agg$params$field2, _agg$params$field2$ti;
      const tz = (0, _utils.inferTimeZone)(agg.params, agg.getIndexPattern(), 'date_histogram', getConfig, aggExecutionContext);
      const shouldForceTimeZone = (_agg$params$field2 = agg.params.field) === null || _agg$params$field2 === void 0 ? void 0 : (_agg$params$field2$ti = _agg$params$field2.timeZone) === null || _agg$params$field2$ti === void 0 ? void 0 : _agg$params$field2$ti.includes('UTC');
      output.params.time_zone = shouldForceTimeZone ? 'UTC' : tz;
    }
  }, {
    name: 'used_timezone',
    shouldShow() {
      return false;
    },
    write: () => {},
    serialize(val, agg) {
      if (!agg) return undefined;
      return (0, _utils.inferTimeZone)(agg.params, agg.getIndexPattern(), 'date_histogram', getConfig, aggExecutionContext);
    },
    toExpressionAst: () => undefined
  }, {
    name: 'drop_partials',
    default: false,
    write: _lodash.noop,
    shouldShow: agg => {
      const field = agg.params.field;
      return field && field.name && field.name === agg.getIndexPattern().timeFieldName;
    }
  }, {
    name: 'format'
  }, {
    name: 'min_doc_count',
    default: 1
  }, {
    name: 'extended_bounds',
    default: {},
    write(agg, output) {
      const val = agg.params.extended_bounds;
      const tz = (0, _utils.inferTimeZone)(agg.params, agg.getIndexPattern(), 'date_histogram', getConfig, aggExecutionContext);
      if (val.min != null || val.max != null) {
        output.params.extended_bounds = {
          min: _momentTimezone.default.tz(val.min, tz).valueOf(),
          max: _momentTimezone.default.tz(val.max, tz).valueOf()
        };
        return;
      }
      if (agg.params.extendToTimeRange && agg.buckets.hasBounds() && !agg.aggConfigs.hasTimeShifts()) {
        var _bucketBounds$min, _bucketBounds$max;
        const bucketBounds = agg.buckets.getBounds();
        output.params.extended_bounds = (0, _lodash.omitBy)({
          min: (_bucketBounds$min = bucketBounds.min) === null || _bucketBounds$min === void 0 ? void 0 : _bucketBounds$min.valueOf(),
          max: (_bucketBounds$max = bucketBounds.max) === null || _bucketBounds$max === void 0 ? void 0 : _bucketBounds$max.valueOf()
        }, _lodash.isNil);
      }
    },
    toExpressionAst: _expressions.extendedBoundsToAst
  }]
});
exports.getDateHistogramBucketAgg = getDateHistogramBucketAgg;