"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.traceRouteRepository = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _ioTsUtils = require("@kbn/io-ts-utils");
var _trace_explorer = require("../../../common/trace_explorer");
var _transactions = require("../../lib/helpers/transactions");
var _create_apm_server_route = require("../apm_routes/create_apm_server_route");
var _default_api_types = require("../default_api_types");
var _get_transaction = require("../transactions/get_transaction");
var _get_transaction_by_trace = require("../transactions/get_transaction_by_trace");
var _get_top_traces_primary_stats = require("./get_top_traces_primary_stats");
var _get_trace_items = require("./get_trace_items");
var _get_trace_samples_by_query = require("./get_trace_samples_by_query");
var _get_random_sampler = require("../../lib/helpers/get_random_sampler");
var _get_apm_event_client = require("../../lib/helpers/get_apm_event_client");
var _get_aggregated_critical_path = require("./get_aggregated_critical_path");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const tracesRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/traces',
  params: t.type({
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, _default_api_types.probabilityRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      config,
      params,
      request,
      plugins: {
        security
      }
    } = resources;
    const {
      environment,
      kuery,
      start,
      end,
      probability
    } = params.query;
    const [apmEventClient, randomSampler] = await Promise.all([(0, _get_apm_event_client.getApmEventClient)(resources), (0, _get_random_sampler.getRandomSampler)({
      security,
      request,
      probability
    })]);
    const searchAggregatedTransactions = await (0, _transactions.getSearchTransactionsEvents)({
      apmEventClient,
      config,
      kuery,
      start,
      end
    });
    return await (0, _get_top_traces_primary_stats.getTopTracesPrimaryStats)({
      environment,
      kuery,
      apmEventClient,
      searchAggregatedTransactions,
      start,
      end,
      randomSampler
    });
  }
});
const tracesByIdRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/traces/{traceId}',
  params: t.type({
    path: t.type({
      traceId: t.string
    }),
    query: _default_api_types.rangeRt
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
      traceId
    } = params.path;
    const {
      start,
      end
    } = params.query;
    return (0, _get_trace_items.getTraceItems)(traceId, config, apmEventClient, start, end);
  }
});
const rootTransactionByTraceIdRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/traces/{traceId}/root_transaction',
  params: t.type({
    path: t.type({
      traceId: t.string
    })
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      params
    } = resources;
    const {
      traceId
    } = params.path;
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    return (0, _get_transaction_by_trace.getRootTransactionByTraceId)(traceId, apmEventClient);
  }
});
const transactionByIdRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/transactions/{transactionId}',
  params: t.type({
    path: t.type({
      transactionId: t.string
    })
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      params
    } = resources;
    const {
      transactionId
    } = params.path;
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    return {
      transaction: await (0, _get_transaction.getTransaction)({
        transactionId,
        apmEventClient
      })
    };
  }
});
const findTracesRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/traces/find',
  params: t.type({
    query: t.intersection([_default_api_types.rangeRt, _default_api_types.environmentRt, t.type({
      query: t.string,
      type: t.union([t.literal(_trace_explorer.TraceSearchType.kql), t.literal(_trace_explorer.TraceSearchType.eql)])
    })])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      start,
      end,
      environment,
      query,
      type
    } = resources.params.query;
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    return {
      traceSamples: await (0, _get_trace_samples_by_query.getTraceSamplesByQuery)({
        apmEventClient,
        start,
        end,
        environment,
        query,
        type
      })
    };
  }
});
const aggregatedCriticalPathRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'POST /internal/apm/traces/aggregated_critical_path',
  params: t.type({
    body: t.intersection([t.type({
      traceIds: t.array(t.string),
      serviceName: t.union([_ioTsUtils.nonEmptyStringRt, t.null]),
      transactionName: t.union([_ioTsUtils.nonEmptyStringRt, t.null])
    }), _default_api_types.rangeRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      params: {
        body: {
          traceIds,
          start,
          end,
          serviceName,
          transactionName
        }
      }
    } = resources;
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    return (0, _get_aggregated_critical_path.getAggregatedCriticalPath)({
      traceIds,
      start,
      end,
      apmEventClient,
      serviceName,
      transactionName,
      logger: resources.logger
    });
  }
});
const traceRouteRepository = {
  ...tracesByIdRoute,
  ...tracesRoute,
  ...rootTransactionByTraceIdRoute,
  ...transactionByIdRoute,
  ...findTracesRoute,
  ...aggregatedCriticalPathRoute
};
exports.traceRouteRepository = traceRouteRepository;