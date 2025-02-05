"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchSignificantCorrelations = void 0;
var _lodash = require("lodash");
var _server = require("../../../../../observability/server");
var _latency_distribution_chart_types = require("../../../../common/latency_distribution_chart_types");
var _utils = require("../utils");
var _fetch_duration_percentiles = require("./fetch_duration_percentiles");
var _fetch_duration_correlation_with_histogram = require("./fetch_duration_correlation_with_histogram");
var _fetch_duration_fractions = require("./fetch_duration_fractions");
var _fetch_duration_histogram_range_steps = require("./fetch_duration_histogram_range_steps");
var _fetch_duration_ranges = require("./fetch_duration_ranges");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const fetchSignificantCorrelations = async ({
  apmEventClient,
  start,
  end,
  environment,
  kuery,
  query,
  durationMinOverride,
  durationMaxOverride,
  fieldValuePairs
}) => {
  // Create an array of ranges [2, 4, 6, ..., 98]
  const percentileAggregationPercents = (0, _lodash.range)(2, 100, 2);
  const chartType = _latency_distribution_chart_types.LatencyDistributionChartType.latencyCorrelations;
  const searchMetrics = false; // latency correlations does not search metrics documents
  const eventType = (0, _utils.getEventType)(chartType, searchMetrics);
  const {
    percentiles: percentilesRecords
  } = await (0, _fetch_duration_percentiles.fetchDurationPercentiles)({
    apmEventClient,
    chartType,
    start,
    end,
    environment,
    kuery,
    query,
    percents: percentileAggregationPercents,
    searchMetrics
  });

  // We need to round the percentiles values
  // because the queries we're using based on it
  // later on wouldn't allow numbers with decimals.
  const percentiles = Object.values(percentilesRecords).map(Math.round);
  const {
    expectations,
    ranges
  } = (0, _utils.computeExpectationsAndRanges)(percentiles);
  const {
    fractions,
    totalDocCount
  } = await (0, _fetch_duration_fractions.fetchDurationFractions)({
    apmEventClient,
    eventType,
    start,
    end,
    environment,
    kuery,
    query,
    ranges
  });
  const {
    rangeSteps
  } = await (0, _fetch_duration_histogram_range_steps.fetchDurationHistogramRangeSteps)({
    apmEventClient,
    chartType,
    start,
    end,
    environment,
    kuery,
    query,
    searchMetrics,
    durationMinOverride,
    durationMaxOverride
  });
  const {
    fulfilled,
    rejected
  } = (0, _utils.splitAllSettledPromises)(await Promise.allSettled(fieldValuePairs.map(fieldValuePair => (0, _fetch_duration_correlation_with_histogram.fetchDurationCorrelationWithHistogram)({
    apmEventClient,
    chartType,
    start,
    end,
    environment,
    kuery,
    query,
    expectations,
    ranges,
    fractions,
    histogramRangeSteps: rangeSteps,
    totalDocCount,
    fieldValuePair
  }))));
  const latencyCorrelations = fulfilled.filter(d => d && 'histogram' in d);
  let fallbackResult = latencyCorrelations.length > 0 ? undefined : fulfilled.filter(d => !(d !== null && d !== void 0 && d.histogram)).reduce((d, result) => {
    if ((d === null || d === void 0 ? void 0 : d.correlation) !== undefined) {
      if (!result) {
        result = (d === null || d === void 0 ? void 0 : d.correlation) > 0 ? d : undefined;
      } else {
        if (d.correlation > 0 && d.ksTest > result.ksTest && d.correlation > result.correlation) {
          result = d;
        }
      }
    }
    return result;
  }, undefined);
  if (latencyCorrelations.length === 0 && fallbackResult) {
    const {
      fieldName,
      fieldValue
    } = fallbackResult;
    const {
      durationRanges: histogram
    } = await (0, _fetch_duration_ranges.fetchDurationRanges)({
      apmEventClient,
      chartType,
      start,
      end,
      environment,
      kuery,
      query: {
        bool: {
          filter: [query, ...(0, _server.termQuery)(fieldName, fieldValue)]
        }
      },
      rangeSteps,
      searchMetrics
    });
    if (fallbackResult) {
      fallbackResult = {
        ...fallbackResult,
        histogram
      };
    }
  }
  const index = apmEventClient.indices[eventType];
  const ccsWarning = rejected.length > 0 && index.includes(':');
  return {
    latencyCorrelations,
    ccsWarning,
    totalDocCount,
    fallbackResult
  };
};
exports.fetchSignificantCorrelations = fetchSignificantCorrelations;