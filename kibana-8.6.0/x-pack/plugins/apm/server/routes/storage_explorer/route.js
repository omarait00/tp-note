"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.storageExplorerRouteRepository = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _i18n = require("@kbn/i18n");
var _environment_filter_values = require("../../../common/environment_filter_values");
var _create_apm_server_route = require("../apm_routes/create_apm_server_route");
var _transactions = require("../../lib/helpers/transactions");
var _storage_explorer_types = require("../../../common/storage_explorer_types");
var _get_service_statistics = require("./get_service_statistics");
var _default_api_types = require("../default_api_types");
var _get_storage_details_per_service = require("./get_storage_details_per_service");
var _get_random_sampler = require("../../lib/helpers/get_random_sampler");
var _get_size_timeseries = require("./get_size_timeseries");
var _has_storage_explorer_privileges = require("./has_storage_explorer_privileges");
var _get_summary_statistics = require("./get_summary_statistics");
var _get_apm_event_client = require("../../lib/helpers/get_apm_event_client");
var _is_cross_cluster_search = require("./is_cross_cluster_search");
var _get_sorted_and_filtered_services = require("../services/get_services/get_sorted_and_filtered_services");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const storageExplorerRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/storage_explorer',
  options: {
    tags: ['access:apm']
  },
  params: t.type({
    query: t.intersection([_storage_explorer_types.indexLifecyclePhaseRt, _default_api_types.probabilityRt, _default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt])
  }),
  handler: async resources => {
    const {
      config,
      params,
      context,
      request,
      plugins: {
        security
      }
    } = resources;
    const {
      query: {
        indexLifecyclePhase,
        probability,
        environment,
        kuery,
        start,
        end
      }
    } = params;
    const [apmEventClient, randomSampler] = await Promise.all([(0, _get_apm_event_client.getApmEventClient)(resources), (0, _get_random_sampler.getRandomSampler)({
      security,
      request,
      probability
    })]);
    const searchAggregatedTransactions = await (0, _transactions.getSearchTransactionsEvents)({
      apmEventClient,
      config,
      kuery
    });
    const serviceStatistics = await (0, _get_service_statistics.getServiceStatistics)({
      apmEventClient,
      context,
      indexLifecyclePhase,
      randomSampler,
      environment,
      kuery,
      start,
      end,
      searchAggregatedTransactions
    });
    return {
      serviceStatistics
    };
  }
});
const storageExplorerServiceDetailsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/storage_details',
  options: {
    tags: ['access:apm']
  },
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_storage_explorer_types.indexLifecyclePhaseRt, _default_api_types.probabilityRt, _default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt])
  }),
  handler: async resources => {
    const {
      params,
      context,
      request,
      plugins: {
        security
      }
    } = resources;
    const {
      path: {
        serviceName
      },
      query: {
        indexLifecyclePhase,
        probability,
        environment,
        kuery,
        start,
        end
      }
    } = params;
    const [apmEventClient, randomSampler] = await Promise.all([(0, _get_apm_event_client.getApmEventClient)(resources), (0, _get_random_sampler.getRandomSampler)({
      security,
      request,
      probability
    })]);
    const [processorEventStats, indicesStats] = await Promise.all([(0, _get_storage_details_per_service.getStorageDetailsPerProcessorEvent)({
      apmEventClient,
      context,
      indexLifecyclePhase,
      randomSampler,
      environment,
      kuery,
      start,
      end,
      serviceName
    }), (0, _get_storage_details_per_service.getStorageDetailsPerIndex)({
      apmEventClient,
      context,
      indexLifecyclePhase,
      randomSampler,
      environment,
      kuery,
      start,
      end,
      serviceName
    })]);
    return {
      processorEventStats,
      indicesStats
    };
  }
});
const storageChartRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/storage_chart',
  options: {
    tags: ['access:apm']
  },
  params: t.type({
    query: t.intersection([_storage_explorer_types.indexLifecyclePhaseRt, _default_api_types.probabilityRt, _default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt])
  }),
  handler: async resources => {
    const {
      config,
      params,
      context,
      request,
      plugins: {
        security
      }
    } = resources;
    const {
      query: {
        indexLifecyclePhase,
        probability,
        environment,
        kuery,
        start,
        end
      }
    } = params;
    const [apmEventClient, randomSampler] = await Promise.all([(0, _get_apm_event_client.getApmEventClient)(resources), (0, _get_random_sampler.getRandomSampler)({
      security,
      request,
      probability
    })]);
    const searchAggregatedTransactions = await (0, _transactions.getSearchTransactionsEvents)({
      apmEventClient,
      config,
      kuery
    });
    const storageTimeSeries = await (0, _get_size_timeseries.getSizeTimeseries)({
      searchAggregatedTransactions,
      indexLifecyclePhase,
      randomSampler,
      environment,
      kuery,
      start,
      end,
      apmEventClient,
      context
    });
    return {
      storageTimeSeries
    };
  }
});
const storageExplorerPrivilegesRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/storage_explorer/privileges',
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      plugins: {
        security
      },
      context
    } = resources;
    if (!security) {
      throw _boom.default.internal(SECURITY_REQUIRED_MESSAGE);
    }
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const hasPrivileges = await (0, _has_storage_explorer_privileges.hasStorageExplorerPrivileges)({
      context,
      apmEventClient
    });
    return {
      hasPrivileges
    };
  }
});
const storageExplorerSummaryStatsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/storage_explorer_summary_stats',
  options: {
    tags: ['access:apm']
  },
  params: t.type({
    query: t.intersection([_storage_explorer_types.indexLifecyclePhaseRt, _default_api_types.probabilityRt, _default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt])
  }),
  handler: async resources => {
    const {
      config,
      params,
      context,
      request,
      plugins: {
        security
      }
    } = resources;
    const {
      query: {
        indexLifecyclePhase,
        probability,
        environment,
        kuery,
        start,
        end
      }
    } = params;
    const [apmEventClient, randomSampler] = await Promise.all([(0, _get_apm_event_client.getApmEventClient)(resources), (0, _get_random_sampler.getRandomSampler)({
      security,
      request,
      probability
    })]);
    const searchAggregatedTransactions = await (0, _transactions.getSearchTransactionsEvents)({
      apmEventClient,
      config,
      kuery
    });
    const [mainSummaryStats, tracesPerMinute] = await Promise.all([(0, _get_summary_statistics.getMainSummaryStats)({
      apmEventClient,
      context,
      indexLifecyclePhase,
      randomSampler,
      start,
      end,
      environment,
      kuery
    }), (0, _get_summary_statistics.getTracesPerMinute)({
      apmEventClient,
      indexLifecyclePhase,
      start,
      end,
      environment,
      kuery,
      searchAggregatedTransactions
    })]);
    return {
      ...mainSummaryStats,
      tracesPerMinute
    };
  }
});
const storageExplorerIsCrossClusterSearchRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/storage_explorer/is_cross_cluster_search',
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    return {
      isCrossClusterSearch: (0, _is_cross_cluster_search.isCrossClusterSearch)(apmEventClient)
    };
  }
});
const storageExplorerGetServices = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/storage_explorer/get_services',
  options: {
    tags: ['access:apm']
  },
  params: t.type({
    query: t.intersection([_storage_explorer_types.indexLifecyclePhaseRt, _default_api_types.environmentRt, _default_api_types.kueryRt])
  }),
  handler: async resources => {
    const {
      query: {
        environment,
        kuery,
        indexLifecyclePhase
      }
    } = resources.params;
    if (kuery || indexLifecyclePhase !== _storage_explorer_types.IndexLifecyclePhaseSelectOption.All || environment !== _environment_filter_values.ENVIRONMENT_ALL.value) {
      return {
        services: []
      };
    }
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const services = await (0, _get_sorted_and_filtered_services.getServiceNamesFromTermsEnum)({
      apmEventClient,
      environment,
      maxNumberOfServices: 500
    });
    return {
      services: services.map(serviceName => ({
        serviceName
      }))
    };
  }
});
const storageExplorerRouteRepository = {
  ...storageExplorerRoute,
  ...storageExplorerServiceDetailsRoute,
  ...storageChartRoute,
  ...storageExplorerPrivilegesRoute,
  ...storageExplorerSummaryStatsRoute,
  ...storageExplorerIsCrossClusterSearchRoute,
  ...storageExplorerGetServices
};
exports.storageExplorerRouteRepository = storageExplorerRouteRepository;
const SECURITY_REQUIRED_MESSAGE = _i18n.i18n.translate('xpack.apm.api.storageExplorer.securityRequired', {
  defaultMessage: 'Security plugin is required'
});