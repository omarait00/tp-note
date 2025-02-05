"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchDurationHistogramRangeSteps = void 0;
var _d3Scale = require("d3-scale");
var _is_finite_number = require("../../../../../observability/common/utils/is_finite_number");
var _get_common_correlations_query = require("./get_common_correlations_query");
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getHistogramRangeSteps = (min, max, steps) => {
  // A d3 based scale function as a helper to get equally distributed bins on a log scale.
  // We round the final values because the ES range agg we use won't accept numbers with decimals for `transaction.duration.us`.
  const logFn = (0, _d3Scale.scaleLog)().domain([min, max]).range([1, steps]);
  return [...Array(steps).keys()].map(logFn.invert).map(d => isNaN(d) ? 0 : Math.round(d));
};
const fetchDurationHistogramRangeSteps = async ({
  chartType,
  apmEventClient,
  start,
  end,
  environment,
  kuery,
  query,
  searchMetrics,
  durationMinOverride,
  durationMaxOverride
}) => {
  const steps = 100;
  if (durationMinOverride && durationMaxOverride) {
    return {
      durationMin: durationMinOverride,
      durationMax: durationMaxOverride,
      rangeSteps: getHistogramRangeSteps(durationMinOverride, durationMaxOverride, steps)
    };
  }
  const durationField = (0, _utils.getDurationField)(chartType, searchMetrics);

  // when using metrics data, ensure we filter by docs with the appropriate duration field
  const filteredQuery = searchMetrics ? {
    bool: {
      filter: [query, {
        exists: {
          field: durationField
        }
      }]
    }
  } : query;
  const resp = await apmEventClient.search('get_duration_histogram_range_steps', {
    apm: {
      events: [(0, _utils.getEventType)(chartType, searchMetrics)]
    },
    body: {
      track_total_hits: 1,
      size: 0,
      query: (0, _get_common_correlations_query.getCommonCorrelationsQuery)({
        start,
        end,
        environment,
        kuery,
        query: filteredQuery
      }),
      aggs: {
        duration_min: {
          min: {
            field: durationField
          }
        },
        duration_max: {
          max: {
            field: durationField
          }
        }
      }
    }
  });
  if (resp.hits.total.value === 0) {
    return {
      rangeSteps: getHistogramRangeSteps(0, 1, 100)
    };
  }
  if (!resp.aggregations || !((0, _is_finite_number.isFiniteNumber)(resp.aggregations.duration_min.value) && (0, _is_finite_number.isFiniteNumber)(resp.aggregations.duration_max.value))) {
    return {
      rangeSteps: []
    };
  }
  const durationMin = resp.aggregations.duration_min.value;
  const durationMax = resp.aggregations.duration_max.value * 2;
  return {
    durationMin,
    durationMax,
    rangeSteps: getHistogramRangeSteps(durationMin, durationMax, steps)
  };
};
exports.fetchDurationHistogramRangeSteps = fetchDurationHistogramRangeSteps;