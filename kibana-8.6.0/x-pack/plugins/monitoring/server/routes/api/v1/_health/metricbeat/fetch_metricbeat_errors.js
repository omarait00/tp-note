"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchMetricbeatErrors = void 0;
var _types = require("../types");
var _metricbeat_errors_query = require("./metricbeat_errors_query");
var _build_metricbeat_errors = require("./build_metricbeat_errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const fetchMetricbeatErrors = async ({
  timeout,
  metricbeatIndex,
  timeRange,
  search,
  logger
}) => {
  const getMetricbeatErrors = async () => {
    var _aggregations$errors_, _aggregations$errors_2;
    const {
      aggregations,
      timed_out: timedOut
    } = await search({
      index: metricbeatIndex,
      body: (0, _metricbeat_errors_query.metricbeatErrorsQuery)({
        timeRange,
        timeout,
        products: [_types.MonitoredProduct.Beats, _types.MonitoredProduct.Elasticsearch, _types.MonitoredProduct.EnterpriseSearch, _types.MonitoredProduct.Kibana, _types.MonitoredProduct.Logstash]
      }),
      size: 0,
      ignore_unavailable: true
    });
    const buckets = (_aggregations$errors_ = aggregations === null || aggregations === void 0 ? void 0 : (_aggregations$errors_2 = aggregations.errors_aggregation) === null || _aggregations$errors_2 === void 0 ? void 0 : _aggregations$errors_2.buckets) !== null && _aggregations$errors_ !== void 0 ? _aggregations$errors_ : [];
    return {
      products: (0, _build_metricbeat_errors.buildMetricbeatErrors)(buckets),
      timedOut: Boolean(timedOut)
    };
  };
  try {
    const {
      products,
      timedOut
    } = await getMetricbeatErrors();
    return {
      products,
      execution: {
        timedOut,
        errors: []
      }
    };
  } catch (err) {
    logger.error(`fetchMetricbeatErrors: failed to fetch:\n${err.stack}`);
    return {
      execution: {
        timedOut: false,
        errors: [err.message]
      }
    };
  }
};
exports.fetchMetricbeatErrors = fetchMetricbeatErrors;