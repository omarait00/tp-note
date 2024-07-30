"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceInventorySearchSource = getServiceInventorySearchSource;
var _transactions = require("./transactions");
var _service_metrics = require("./service_metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getServiceInventorySearchSource({
  config,
  serviceMetricsEnabled,
  apmEventClient,
  start,
  end,
  kuery
}) {
  const commonProps = {
    apmEventClient,
    kuery,
    start,
    end
  };
  const [searchAggregatedTransactions, searchAggregatedServiceMetrics] = await Promise.all([(0, _transactions.getSearchTransactionsEvents)({
    ...commonProps,
    config
  }), (0, _service_metrics.getSearchServiceMetrics)({
    ...commonProps,
    serviceMetricsEnabled
  })]);
  return {
    searchAggregatedTransactions,
    searchAggregatedServiceMetrics
  };
}