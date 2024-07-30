"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServerlessAgentMetricsCharts = getServerlessAgentMetricsCharts;
var _transactions = require("../../../lib/helpers/transactions");
var _with_apm_span = require("../../../utils/with_apm_span");
var _memory = require("../by_agent/shared/memory");
var _get_cold_start_count_chart = require("./get_cold_start_count_chart");
var _get_cold_start_duration_chart = require("./get_cold_start_duration_chart");
var _get_compute_usage_chart = require("./get_compute_usage_chart");
var _get_serverless_function_latency_chart = require("./get_serverless_function_latency_chart");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getServerlessAgentMetricsCharts({
  environment,
  kuery,
  config,
  apmEventClient,
  serviceName,
  start,
  end,
  serverlessId
}) {
  return (0, _with_apm_span.withApmSpan)('get_serverless_agent_metric_charts', async () => {
    const searchAggregatedTransactions = await (0, _transactions.getSearchTransactionsEvents)({
      config,
      apmEventClient,
      kuery,
      start,
      end
    });
    const options = {
      environment,
      kuery,
      apmEventClient,
      config,
      serviceName,
      start,
      end,
      serverlessId
    };
    return await Promise.all([(0, _get_serverless_function_latency_chart.getServerlessFunctionLatencyChart)({
      ...options,
      searchAggregatedTransactions
    }), (0, _memory.getMemoryChartData)(options), (0, _get_cold_start_duration_chart.getColdStartDurationChart)(options), (0, _get_cold_start_count_chart.getColdStartCountChart)(options), (0, _get_compute_usage_chart.getComputeUsageChart)(options)]);
  });
}