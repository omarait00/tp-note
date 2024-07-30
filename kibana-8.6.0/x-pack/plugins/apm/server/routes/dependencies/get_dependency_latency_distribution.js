"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDependencyLatencyDistribution = getDependencyLatencyDistribution;
var _server = require("../../../../observability/server");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
var _event_outcome = require("../../../common/event_outcome");
var _latency_distribution_chart_types = require("../../../common/latency_distribution_chart_types");
var _get_overall_latency_distribution = require("../latency_distribution/get_overall_latency_distribution");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getDependencyLatencyDistribution({
  apmEventClient,
  dependencyName,
  spanName,
  kuery,
  environment,
  start,
  end,
  percentileThreshold
}) {
  const commonParams = {
    chartType: _latency_distribution_chart_types.LatencyDistributionChartType.dependencyLatency,
    apmEventClient,
    start,
    end,
    environment,
    kuery,
    percentileThreshold,
    searchMetrics: false
  };
  const commonQuery = {
    bool: {
      filter: [...(0, _server.termQuery)(_elasticsearch_fieldnames.SPAN_NAME, spanName), ...(0, _server.termQuery)(_elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE, dependencyName)]
    }
  };
  const [allSpansDistribution, failedSpansDistribution] = await Promise.all([(0, _get_overall_latency_distribution.getOverallLatencyDistribution)({
    ...commonParams,
    query: commonQuery
  }), (0, _get_overall_latency_distribution.getOverallLatencyDistribution)({
    ...commonParams,
    query: {
      bool: {
        filter: [commonQuery, ...(0, _server.termQuery)(_elasticsearch_fieldnames.EVENT_OUTCOME, _event_outcome.EventOutcome.failure)]
      }
    }
  })]);
  return {
    allSpansDistribution,
    failedSpansDistribution
  };
}