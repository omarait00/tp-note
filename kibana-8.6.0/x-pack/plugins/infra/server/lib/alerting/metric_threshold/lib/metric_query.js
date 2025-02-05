"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getElasticsearchMetricQuery = exports.createBaseFilters = exports.calculateCurrentTimeframe = void 0;
var _moment = _interopRequireDefault(require("moment"));
var _metrics = require("../../../../../common/alerting/metrics");
var _utils = require("../../common/utils");
var _create_bucket_selector = require("./create_bucket_selector");
var _create_percentile_aggregation = require("./create_percentile_aggregation");
var _create_rate_aggregation = require("./create_rate_aggregation");
var _wrap_in_period = require("./wrap_in_period");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getParsedFilterQuery = filterQuery => {
  if (!filterQuery) return [];
  return [JSON.parse(filterQuery)];
};
const calculateCurrentTimeframe = (metricParams, timeframe) => ({
  ...timeframe,
  start: (0, _moment.default)(timeframe.end).subtract(metricParams.aggType === _metrics.Aggregators.RATE ? metricParams.timeSize * 2 : metricParams.timeSize, metricParams.timeUnit).valueOf()
});
exports.calculateCurrentTimeframe = calculateCurrentTimeframe;
const createBaseFilters = (metricParams, timeframe, filterQuery) => {
  const {
    metric
  } = metricParams;
  const rangeFilters = [{
    range: {
      '@timestamp': {
        gte: (0, _moment.default)(timeframe.start).toISOString(),
        lte: (0, _moment.default)(timeframe.end).toISOString()
      }
    }
  }];
  const metricFieldFilters = metric ? [{
    exists: {
      field: metric
    }
  }] : [];
  const parsedFilterQuery = getParsedFilterQuery(filterQuery);
  return [...rangeFilters, ...metricFieldFilters, ...parsedFilterQuery];
};
exports.createBaseFilters = createBaseFilters;
const getElasticsearchMetricQuery = (metricParams, timeframe, compositeSize, alertOnGroupDisappear, lastPeriodEnd, groupBy, filterQuery, afterKey, fieldsExisted) => {
  const {
    metric,
    aggType
  } = metricParams;
  if (aggType === _metrics.Aggregators.COUNT && metric) {
    throw new Error('Cannot aggregate document count with a metric');
  }
  if (aggType !== _metrics.Aggregators.COUNT && !metric) {
    throw new Error('Can only aggregate without a metric if using the document count aggregator');
  }

  // We need to make a timeframe that represents the current timeframe as oppose
  // to the total timeframe (which includes the last period).
  const currentTimeframe = calculateCurrentTimeframe(metricParams, timeframe);
  const metricAggregations = aggType === _metrics.Aggregators.COUNT ? {} : aggType === _metrics.Aggregators.RATE ? (0, _create_rate_aggregation.createRateAggsBuckets)(currentTimeframe, 'aggregatedValue', metric) : aggType === _metrics.Aggregators.P95 || aggType === _metrics.Aggregators.P99 ? (0, _create_percentile_aggregation.createPercentileAggregation)(aggType, metric) : {
    aggregatedValue: {
      [aggType]: {
        field: metric
      }
    }
  };
  const bucketSelectorAggregations = (0, _create_bucket_selector.createBucketSelector)(metricParams, alertOnGroupDisappear, groupBy, lastPeriodEnd);
  const rateAggBucketScript = metricParams.aggType === _metrics.Aggregators.RATE ? (0, _create_rate_aggregation.createRateAggsBucketScript)(currentTimeframe, 'aggregatedValue') : {};
  const currentPeriod = (0, _wrap_in_period.wrapInCurrentPeriod)(currentTimeframe, metricAggregations);
  const containerContextAgg = (0, _utils.shouldTermsAggOnContainer)(groupBy) && fieldsExisted && fieldsExisted[_utils.termsAggField[_utils.KUBERNETES_POD_UID]] ? {
    containerContext: {
      terms: {
        field: _utils.termsAggField[_utils.KUBERNETES_POD_UID],
        size: _utils.NUMBER_OF_DOCUMENTS
      },
      aggs: {
        container: {
          top_hits: {
            size: 1,
            _source: {
              includes: ['container.*']
            }
          }
        }
      }
    }
  } : void 0;
  const includesList = ['host.*', 'labels.*', 'tags', 'cloud.*', 'orchestrator.*'];
  const excludesList = ['host.cpu.*', 'host.disk.*', 'host.network.*'];
  if (!containerContextAgg) includesList.push('container.*');
  const additionalContextAgg = (0, _utils.hasAdditionalContext)(groupBy, _utils.validGroupByForContext) ? {
    additionalContext: {
      top_hits: {
        size: 1,
        _source: {
          includes: includesList,
          excludes: excludesList
        }
      }
    }
  } : void 0;
  const aggs = groupBy ? {
    groupings: {
      composite: {
        size: compositeSize,
        sources: Array.isArray(groupBy) ? groupBy.map((field, index) => ({
          [`groupBy${index}`]: {
            terms: {
              field
            }
          }
        })) : [{
          groupBy0: {
            terms: {
              field: groupBy
            }
          }
        }]
      },
      aggs: {
        ...currentPeriod,
        ...rateAggBucketScript,
        ...bucketSelectorAggregations,
        ...additionalContextAgg,
        ...containerContextAgg
      }
    }
  } : {
    all: {
      filters: {
        filters: {
          all: {
            match_all: {}
          }
        }
      },
      aggs: {
        ...currentPeriod,
        ...rateAggBucketScript,
        ...bucketSelectorAggregations
      }
    }
  };
  if (aggs.groupings && afterKey) {
    aggs.groupings.composite.after = afterKey;
  }
  const baseFilters = createBaseFilters(metricParams, timeframe, filterQuery);
  return {
    track_total_hits: true,
    query: {
      bool: {
        filter: baseFilters
      }
    },
    size: 0,
    aggs
  };
};
exports.getElasticsearchMetricQuery = getElasticsearchMetricQuery;