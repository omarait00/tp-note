"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServicesDetailedStatistics = getServicesDetailedStatistics;
var _get_service_transaction_detailed_statistics = require("./get_service_transaction_detailed_statistics");
var _get_service_aggregated_transaction_detailed_statistics = require("./get_service_aggregated_transaction_detailed_statistics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getServicesDetailedStatistics({
  serviceNames,
  environment,
  kuery,
  apmEventClient,
  searchAggregatedTransactions,
  searchAggregatedServiceMetrics,
  offset,
  start,
  end,
  randomSampler
}) {
  const commonProps = {
    serviceNames,
    environment,
    kuery,
    apmEventClient,
    start,
    end,
    randomSampler,
    offset
  };
  return searchAggregatedServiceMetrics ? (0, _get_service_aggregated_transaction_detailed_statistics.getServiceAggregatedDetailedStatsPeriods)({
    ...commonProps,
    searchAggregatedServiceMetrics
  }) : (0, _get_service_transaction_detailed_statistics.getServiceDetailedStatsPeriods)({
    ...commonProps,
    searchAggregatedTransactions
  });
}