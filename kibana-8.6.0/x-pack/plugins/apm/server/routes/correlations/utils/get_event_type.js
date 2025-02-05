"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEventType = getEventType;
var _common = require("../../../../../observability/common");
var _latency_distribution_chart_types = require("../../../../common/latency_distribution_chart_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const {
  transactionLatency,
  latencyCorrelations,
  failedTransactionsCorrelations,
  dependencyLatency
} = _latency_distribution_chart_types.LatencyDistributionChartType;
function getEventType(chartType, searchMetrics) {
  switch (chartType) {
    case transactionLatency:
      if (searchMetrics) {
        return _common.ProcessorEvent.metric;
      }
      return _common.ProcessorEvent.transaction;
    case latencyCorrelations:
      return _common.ProcessorEvent.transaction;
    case failedTransactionsCorrelations:
      return _common.ProcessorEvent.transaction;
    case dependencyLatency:
      return _common.ProcessorEvent.span;
    default:
      return _common.ProcessorEvent.transaction;
  }
}