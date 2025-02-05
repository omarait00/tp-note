"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServerlessFunctionLatencyChart = getServerlessFunctionLatencyChart;
var _i18n = require("@kbn/i18n");
var _uiTheme = require("@kbn/ui-theme");
var _server = require("../../../../../observability/server");
var _lodash = require("lodash");
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
var _latency_aggregation_types = require("../../../../common/latency_aggregation_types");
var _is_finite_number = require("../../../../common/utils/is_finite_number");
var _viz_colors = require("../../../../common/viz_colors");
var _get_latency_charts = require("../../transactions/get_latency_charts");
var _fetch_and_transform_metrics = require("../fetch_and_transform_metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const billedDurationAvg = {
  title: _i18n.i18n.translate('xpack.apm.agentMetrics.serverless.billedDurationAvg', {
    defaultMessage: 'Billed Duration'
  })
};
const chartBase = {
  title: _i18n.i18n.translate('xpack.apm.agentMetrics.serverless.avgDuration', {
    defaultMessage: 'Lambda Duration'
  }),
  key: 'avg_duration',
  type: 'linemark',
  yUnit: 'time',
  series: {},
  description: _i18n.i18n.translate('xpack.apm.agentMetrics.serverless.avgDuration.description', {
    defaultMessage: 'Transaction duration is the time spent processing and responding to a request. If the request is queued it will not be contribute to the transaction duration but will contribute the overall billed duration'
  })
};
async function getServerlessLantecySeries({
  environment,
  kuery,
  apmEventClient,
  serviceName,
  start,
  end,
  serverlessId,
  searchAggregatedTransactions
}) {
  var _transactionLatency$o;
  const transactionLatency = await (0, _get_latency_charts.getLatencyTimeseries)({
    environment,
    kuery,
    serviceName,
    apmEventClient,
    searchAggregatedTransactions,
    latencyAggregationType: _latency_aggregation_types.LatencyAggregationType.avg,
    start,
    end,
    serverlessId
  });
  return [{
    title: _i18n.i18n.translate('xpack.apm.agentMetrics.serverless.transactionDuration', {
      defaultMessage: 'Transaction Duration'
    }),
    key: 'transaction_duration',
    type: 'linemark',
    color: (0, _viz_colors.getVizColorForIndex)(1, _uiTheme.euiLightVars),
    overallValue: (_transactionLatency$o = transactionLatency.overallAvgDuration) !== null && _transactionLatency$o !== void 0 ? _transactionLatency$o : 0,
    data: transactionLatency.latencyTimeseries
  }];
}
async function getServerlessFunctionLatencyChart({
  environment,
  kuery,
  config,
  apmEventClient,
  serviceName,
  start,
  end,
  serverlessId,
  searchAggregatedTransactions
}) {
  const options = {
    environment,
    kuery,
    config,
    apmEventClient,
    serviceName,
    start,
    end
  };
  const [billedDurationMetrics, serverlessDurationSeries] = await Promise.all([(0, _fetch_and_transform_metrics.fetchAndTransformMetrics)({
    ...options,
    chartBase: {
      ...chartBase,
      series: {
        billedDurationAvg
      }
    },
    aggs: {
      billedDurationAvg: {
        avg: {
          field: _elasticsearch_fieldnames.FAAS_BILLED_DURATION
        }
      }
    },
    additionalFilters: [{
      exists: {
        field: _elasticsearch_fieldnames.FAAS_BILLED_DURATION
      }
    }, ...(0, _server.termQuery)(_elasticsearch_fieldnames.FAAS_ID, serverlessId), ...(0, _server.termQuery)(_elasticsearch_fieldnames.METRICSET_NAME, 'app')],
    operationName: 'get_billed_duration'
  }), getServerlessLantecySeries({
    ...options,
    serverlessId,
    searchAggregatedTransactions
  })]);
  const series = [];
  const [billedDurationSeries] = billedDurationMetrics.series;
  if (billedDurationSeries) {
    var _billedDurationSeries;
    const data = (_billedDurationSeries = billedDurationSeries.data) === null || _billedDurationSeries === void 0 ? void 0 : _billedDurationSeries.map(({
      x,
      y
    }) => ({
      x,
      // Billed duration is stored in ms, convert it to microseconds so it uses the same unit as the other chart
      y: (0, _is_finite_number.isFiniteNumber)(y) ? y * 1000 : y
    }));
    series.push({
      ...billedDurationSeries,
      // Billed duration is stored in ms, convert it to microseconds
      overallValue: billedDurationSeries.overallValue * 1000,
      data: data || []
    });
  }
  if (!(0, _lodash.isEmpty)(serverlessDurationSeries[0].data)) {
    series.push(...serverlessDurationSeries);
  }
  return {
    ...billedDurationMetrics,
    series
  };
}