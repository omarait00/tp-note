"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.latencyDistributionRouteRepository = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _ioTsUtils = require("@kbn/io-ts-utils");
var _server = require("../../../../observability/server");
var _get_overall_latency_distribution = require("./get_overall_latency_distribution");
var _transactions = require("../../lib/helpers/transactions");
var _create_apm_server_route = require("../apm_routes/create_apm_server_route");
var _default_api_types = require("../default_api_types");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
var _latency_distribution_chart_types = require("../../../common/latency_distribution_chart_types");
var _get_apm_event_client = require("../../lib/helpers/get_apm_event_client");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const latencyOverallTransactionDistributionRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'POST /internal/apm/latency/overall_distribution/transactions',
  params: t.type({
    body: t.intersection([t.partial({
      serviceName: t.string,
      transactionName: t.string,
      transactionType: t.string,
      termFilters: t.array(t.type({
        fieldName: t.string,
        fieldValue: t.union([t.string, _ioTsUtils.toNumberRt])
      })),
      durationMin: _ioTsUtils.toNumberRt,
      durationMax: _ioTsUtils.toNumberRt
    }), _default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, t.type({
      percentileThreshold: _ioTsUtils.toNumberRt,
      chartType: _latency_distribution_chart_types.latencyDistributionChartTypeRt
    })])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    var _termFilters$flatMap;
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const {
      environment,
      kuery,
      serviceName,
      transactionType,
      transactionName,
      start,
      end,
      percentileThreshold,
      durationMin,
      durationMax,
      termFilters,
      chartType
    } = resources.params.body;

    // only the transaction latency distribution chart can use metrics data
    const searchAggregatedTransactions = chartType === _latency_distribution_chart_types.LatencyDistributionChartType.transactionLatency ? await (0, _transactions.getSearchTransactionsEvents)({
      config: resources.config,
      apmEventClient,
      kuery,
      start,
      end
    }) : false;
    return (0, _get_overall_latency_distribution.getOverallLatencyDistribution)({
      apmEventClient,
      chartType,
      environment,
      kuery,
      start,
      end,
      query: {
        bool: {
          filter: [...(0, _server.termQuery)(_elasticsearch_fieldnames.SERVICE_NAME, serviceName), ...(0, _server.termQuery)(_elasticsearch_fieldnames.TRANSACTION_TYPE, transactionType), ...(0, _server.termQuery)(_elasticsearch_fieldnames.TRANSACTION_NAME, transactionName), ...((_termFilters$flatMap = termFilters === null || termFilters === void 0 ? void 0 : termFilters.flatMap(fieldValuePair => (0, _server.termQuery)(fieldValuePair.fieldName, fieldValuePair.fieldValue))) !== null && _termFilters$flatMap !== void 0 ? _termFilters$flatMap : [])]
        }
      },
      percentileThreshold,
      durationMinOverride: durationMin,
      durationMaxOverride: durationMax,
      searchMetrics: searchAggregatedTransactions
    });
  }
});
const latencyDistributionRouteRepository = latencyOverallTransactionDistributionRoute;
exports.latencyDistributionRouteRepository = latencyDistributionRouteRepository;