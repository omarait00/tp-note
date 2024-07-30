"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDurationField = getDurationField;
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
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
function getDurationField(chartType, searchMetrics) {
  switch (chartType) {
    case transactionLatency:
      if (searchMetrics) {
        return _elasticsearch_fieldnames.TRANSACTION_DURATION_HISTOGRAM;
      }
      return _elasticsearch_fieldnames.TRANSACTION_DURATION;
    case latencyCorrelations:
      return _elasticsearch_fieldnames.TRANSACTION_DURATION;
    case failedTransactionsCorrelations:
      return _elasticsearch_fieldnames.TRANSACTION_DURATION;
    case dependencyLatency:
      return _elasticsearch_fieldnames.SPAN_DURATION;
    default:
      return _elasticsearch_fieldnames.TRANSACTION_DURATION;
  }
}