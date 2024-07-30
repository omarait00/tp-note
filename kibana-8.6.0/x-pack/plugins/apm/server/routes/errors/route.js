"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorsRouteRepository = void 0;
var _ioTsUtils = require("@kbn/io-ts-utils");
var t = _interopRequireWildcard(require("io-ts"));
var _create_apm_server_route = require("../apm_routes/create_apm_server_route");
var _get_distribution = require("./distribution/get_distribution");
var _default_api_types = require("../default_api_types");
var _get_error_group_main_statistics = require("./get_error_groups/get_error_group_main_statistics");
var _get_error_group_detailed_statistics = require("./get_error_groups/get_error_group_detailed_statistics");
var _get_error_group_sample = require("./get_error_groups/get_error_group_sample");
var _comparison_rt = require("../../../common/comparison_rt");
var _get_top_erroneous_transactions = require("./erroneous_transactions/get_top_erroneous_transactions");
var _get_apm_event_client = require("../../lib/helpers/get_apm_event_client");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const errorsMainStatisticsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/errors/groups/main_statistics',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([t.partial({
      sortField: t.string,
      sortDirection: t.union([t.literal('asc'), t.literal('desc')])
    }), _default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      params
    } = resources;
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const {
      serviceName
    } = params.path;
    const {
      environment,
      kuery,
      sortField,
      sortDirection,
      start,
      end
    } = params.query;
    const errorGroups = await (0, _get_error_group_main_statistics.getErrorGroupMainStatistics)({
      environment,
      kuery,
      serviceName,
      sortField,
      sortDirection,
      apmEventClient,
      start,
      end
    });
    return {
      errorGroups
    };
  }
});
const errorsMainStatisticsByTransactionNameRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/errors/groups/main_statistics_by_transaction_name',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([t.type({
      transactionType: t.string,
      transactionName: t.string,
      maxNumberOfErrorGroups: _ioTsUtils.toNumberRt
    }), _default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      params
    } = resources;
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const {
      serviceName
    } = params.path;
    const {
      environment,
      kuery,
      start,
      end,
      transactionName,
      transactionType,
      maxNumberOfErrorGroups
    } = params.query;
    const errorGroups = await (0, _get_error_group_main_statistics.getErrorGroupMainStatistics)({
      environment,
      kuery,
      serviceName,
      apmEventClient,
      start,
      end,
      maxNumberOfErrorGroups,
      transactionName,
      transactionType
    });
    return {
      errorGroups
    };
  }
});
const errorsDetailedStatisticsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'POST /internal/apm/services/{serviceName}/errors/groups/detailed_statistics',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, _comparison_rt.offsetRt, t.type({
      numBuckets: _ioTsUtils.toNumberRt
    })]),
    body: t.type({
      groupIds: _ioTsUtils.jsonRt.pipe(t.array(t.string))
    })
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
      path: {
        serviceName
      },
      query: {
        environment,
        kuery,
        numBuckets,
        start,
        end,
        offset
      },
      body: {
        groupIds
      }
    } = params;
    return (0, _get_error_group_detailed_statistics.getErrorGroupPeriods)({
      environment,
      kuery,
      serviceName,
      apmEventClient,
      numBuckets,
      groupIds,
      start,
      end,
      offset
    });
  }
});
const errorGroupsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/errors/{groupId}',
  params: t.type({
    path: t.type({
      serviceName: t.string,
      groupId: t.string
    }),
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      params
    } = resources;
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const {
      serviceName,
      groupId
    } = params.path;
    const {
      environment,
      kuery,
      start,
      end
    } = params.query;
    return (0, _get_error_group_sample.getErrorGroupSample)({
      environment,
      groupId,
      kuery,
      serviceName,
      apmEventClient,
      start,
      end
    });
  }
});
const errorDistributionRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/errors/distribution',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([t.partial({
      groupId: t.string
    }), _default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, _comparison_rt.offsetRt])
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
      serviceName
    } = params.path;
    const {
      environment,
      kuery,
      groupId,
      start,
      end,
      offset
    } = params.query;
    return (0, _get_distribution.getErrorDistribution)({
      environment,
      kuery,
      serviceName,
      groupId,
      apmEventClient,
      start,
      end,
      offset
    });
  }
});
const topErroneousTransactionsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/errors/{groupId}/top_erroneous_transactions',
  params: t.type({
    path: t.type({
      serviceName: t.string,
      groupId: t.string
    }),
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, _comparison_rt.offsetRt, t.type({
      numBuckets: _ioTsUtils.toNumberRt
    })])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      params
    } = resources;
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const {
      path: {
        serviceName,
        groupId
      },
      query: {
        environment,
        kuery,
        numBuckets,
        start,
        end,
        offset
      }
    } = params;
    return await (0, _get_top_erroneous_transactions.getTopErroneousTransactionsPeriods)({
      environment,
      groupId,
      kuery,
      serviceName,
      apmEventClient,
      start,
      end,
      numBuckets,
      offset
    });
  }
});
const errorsRouteRepository = {
  ...errorsMainStatisticsRoute,
  ...errorsMainStatisticsByTransactionNameRoute,
  ...errorsDetailedStatisticsRoute,
  ...errorGroupsRoute,
  ...errorDistributionRoute,
  ...topErroneousTransactionsRoute
};
exports.errorsRouteRepository = errorsRouteRepository;