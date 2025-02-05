"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchDurationCorrelationWithHistogram = fetchDurationCorrelationWithHistogram;
var _server = require("../../../../../observability/server");
var _constants = require("../../../../common/correlations/constants");
var _fetch_duration_correlation = require("./fetch_duration_correlation");
var _fetch_duration_ranges = require("./fetch_duration_ranges");
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function fetchDurationCorrelationWithHistogram({
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
  histogramRangeSteps,
  totalDocCount,
  fieldValuePair
}) {
  const searchMetrics = false; // latency correlations does not search metrics documents
  const eventType = (0, _utils.getEventType)(chartType, searchMetrics);
  const queryWithFieldValuePair = {
    bool: {
      filter: [query, ...(0, _server.termQuery)(fieldValuePair.fieldName, fieldValuePair.fieldValue)]
    }
  };
  const {
    correlation,
    ksTest
  } = await (0, _fetch_duration_correlation.fetchDurationCorrelation)({
    apmEventClient,
    eventType,
    start,
    end,
    environment,
    kuery,
    query: queryWithFieldValuePair,
    expectations,
    fractions,
    ranges,
    totalDocCount
  });
  if (correlation !== null && ksTest !== null && !isNaN(ksTest)) {
    if (correlation > _constants.CORRELATION_THRESHOLD && ksTest < _constants.KS_TEST_THRESHOLD) {
      const {
        durationRanges: histogram
      } = await (0, _fetch_duration_ranges.fetchDurationRanges)({
        apmEventClient,
        chartType,
        start,
        end,
        environment,
        kuery,
        query: queryWithFieldValuePair,
        rangeSteps: histogramRangeSteps,
        searchMetrics
      });
      return {
        ...fieldValuePair,
        correlation,
        ksTest,
        histogram
      };
    } else {
      return {
        ...fieldValuePair,
        correlation,
        ksTest
      };
    }
  }
  return undefined;
}