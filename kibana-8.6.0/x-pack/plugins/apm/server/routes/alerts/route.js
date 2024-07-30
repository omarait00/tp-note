"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alertsChartPreviewRouteRepository = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _get_transaction_duration_chart_preview = require("./rule_types/transaction_duration/get_transaction_duration_chart_preview");
var _get_error_count_chart_preview = require("./rule_types/error_count/get_error_count_chart_preview");
var _get_transaction_error_rate_chart_preview = require("./rule_types/transaction_error_rate/get_transaction_error_rate_chart_preview");
var _create_apm_server_route = require("../apm_routes/create_apm_server_route");
var _default_api_types = require("../default_api_types");
var _apm_rule_types = require("../../../common/rules/apm_rule_types");
var _get_apm_event_client = require("../../lib/helpers/get_apm_event_client");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const alertParamsRt = t.intersection([t.partial({
  aggregationType: t.union([t.literal(_apm_rule_types.AggregationType.Avg), t.literal(_apm_rule_types.AggregationType.P95), t.literal(_apm_rule_types.AggregationType.P99)]),
  serviceName: t.string,
  transactionType: t.string
}), _default_api_types.environmentRt, _default_api_types.rangeRt, t.type({
  interval: t.string
})]);
const transactionErrorRateChartPreview = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/rule_types/transaction_error_rate/chart_preview',
  params: t.type({
    query: alertParamsRt
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const {
      params,
      config
    } = resources;
    const {
      _inspect,
      ...alertParams
    } = params.query;
    const errorRateChartPreview = await (0, _get_transaction_error_rate_chart_preview.getTransactionErrorRateChartPreview)({
      config,
      apmEventClient,
      alertParams
    });
    return {
      errorRateChartPreview
    };
  }
});
const transactionErrorCountChartPreview = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/rule_types/error_count/chart_preview',
  params: t.type({
    query: alertParamsRt
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const {
      params
    } = resources;
    const {
      _inspect,
      ...alertParams
    } = params.query;
    const errorCountChartPreview = await (0, _get_error_count_chart_preview.getTransactionErrorCountChartPreview)({
      apmEventClient,
      alertParams
    });
    return {
      errorCountChartPreview
    };
  }
});
const transactionDurationChartPreview = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/rule_types/transaction_duration/chart_preview',
  params: t.type({
    query: alertParamsRt
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const {
      params,
      config
    } = resources;
    const {
      _inspect,
      ...alertParams
    } = params.query;
    const latencyChartPreview = await (0, _get_transaction_duration_chart_preview.getTransactionDurationChartPreview)({
      alertParams,
      config,
      apmEventClient
    });
    return {
      latencyChartPreview
    };
  }
});
const alertsChartPreviewRouteRepository = {
  ...transactionErrorRateChartPreview,
  ...transactionDurationChartPreview,
  ...transactionErrorCountChartPreview,
  ...transactionDurationChartPreview
};
exports.alertsChartPreviewRouteRepository = alertsChartPreviewRouteRepository;