"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPingHistogram = void 0;
var _get_query_string_filter = require("./search/get_query_string_filter");
var _helper = require("../helper");
var _constants = require("../../../../common/constants");
var _es_search = require("../../../../common/utils/es_search");
var _get_histogram_interval = require("../../../../common/lib/get_histogram_interval");
var _client_defaults = require("../../../../common/constants/client_defaults");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getPingHistogram = async ({
  uptimeEsClient,
  dateStart: from,
  dateEnd: to,
  filters,
  monitorId,
  bucketSize,
  query,
  timeZone
}) => {
  var _result$aggregations$, _result$aggregations, _result$aggregations$2;
  const boolFilters = filters ? JSON.parse(filters) : null;
  const additionalFilters = [];
  if (monitorId) {
    additionalFilters.push({
      match: {
        'monitor.id': monitorId
      }
    });
  }
  if (boolFilters) {
    additionalFilters.push(boolFilters);
  }
  const filter = (0, _helper.getFilterClause)(from, to, additionalFilters);
  const minInterval = (0, _get_histogram_interval.getHistogramInterval)(from, to, _constants.QUERY.DEFAULT_BUCKET_COUNT);
  if (query) {
    filter.push((0, _get_query_string_filter.getQueryStringFilter)(query));
  }
  const params = (0, _es_search.createEsQuery)({
    body: {
      query: {
        bool: {
          filter: [...filter, {
            exists: {
              field: 'summary'
            }
          }, _client_defaults.EXCLUDE_RUN_ONCE_FILTER]
        }
      },
      size: 0,
      aggs: {
        timeseries: {
          date_histogram: {
            field: '@timestamp',
            fixed_interval: bucketSize || minInterval + 'ms',
            missing: '0',
            time_zone: timeZone
          },
          aggs: {
            down: {
              sum: {
                field: 'summary.down'
              }
            },
            up: {
              sum: {
                field: 'summary.up'
              }
            }
          }
        }
      }
    }
  });
  const {
    body: result
  } = await uptimeEsClient.search(params, 'getPingsOverTime');
  const buckets = (_result$aggregations$ = result === null || result === void 0 ? void 0 : (_result$aggregations = result.aggregations) === null || _result$aggregations === void 0 ? void 0 : (_result$aggregations$2 = _result$aggregations.timeseries) === null || _result$aggregations$2 === void 0 ? void 0 : _result$aggregations$2.buckets) !== null && _result$aggregations$ !== void 0 ? _result$aggregations$ : [];
  const histogram = buckets.map(bucket => {
    const x = bucket.key;
    const downCount = bucket.down.value || 0;
    const upCount = bucket.up.value || 0;
    return {
      x,
      downCount,
      upCount,
      y: 1
    };
  });
  return {
    histogram,
    minInterval
  };
};
exports.getPingHistogram = getPingHistogram;