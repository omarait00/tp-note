"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dependencisRouteRepository = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _ioTsUtils = require("@kbn/io-ts-utils");
var _default_api_types = require("../default_api_types");
var _create_apm_server_route = require("../apm_routes/create_apm_server_route");
var _get_metadata_for_dependency = require("./get_metadata_for_dependency");
var _get_latency_charts_for_dependency = require("./get_latency_charts_for_dependency");
var _get_top_dependencies = require("./get_top_dependencies");
var _get_upstream_services_for_dependency = require("./get_upstream_services_for_dependency");
var _get_throughput_charts_for_dependency = require("./get_throughput_charts_for_dependency");
var _get_error_rate_charts_for_dependency = require("./get_error_rate_charts_for_dependency");
var _comparison_rt = require("../../../common/comparison_rt");
var _get_top_dependency_operations = require("./get_top_dependency_operations");
var _get_dependency_latency_distribution = require("./get_dependency_latency_distribution");
var _get_top_dependency_spans = require("./get_top_dependency_spans");
var _get_apm_event_client = require("../../lib/helpers/get_apm_event_client");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const topDependenciesRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/dependencies/top_dependencies',
  params: t.intersection([t.type({
    query: t.intersection([_default_api_types.rangeRt, _default_api_types.environmentRt, _default_api_types.kueryRt, t.type({
      numBuckets: _ioTsUtils.toNumberRt
    })])
  }), t.partial({
    query: _comparison_rt.offsetRt
  })]),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const {
      environment,
      offset,
      numBuckets,
      kuery,
      start,
      end
    } = resources.params.query;
    const opts = {
      apmEventClient,
      start,
      end,
      numBuckets,
      environment,
      kuery
    };
    const [currentDependencies, previousDependencies] = await Promise.all([(0, _get_top_dependencies.getTopDependencies)(opts), offset ? (0, _get_top_dependencies.getTopDependencies)({
      ...opts,
      offset
    }) : Promise.resolve([])]);
    return {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      dependencies: currentDependencies.map(dependency => {
        var _prev$stats;
        const {
          stats,
          ...rest
        } = dependency;
        const prev = previousDependencies.find(item => item.location.id === dependency.location.id);
        return {
          ...rest,
          currentStats: stats,
          previousStats: (_prev$stats = prev === null || prev === void 0 ? void 0 : prev.stats) !== null && _prev$stats !== void 0 ? _prev$stats : null
        };
      })
    };
  }
});
const upstreamServicesForDependencyRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/dependencies/upstream_services',
  params: t.intersection([t.type({
    query: t.intersection([t.type({
      dependencyName: t.string
    }), _default_api_types.rangeRt, t.type({
      numBuckets: _ioTsUtils.toNumberRt
    })])
  }), t.partial({
    query: t.intersection([_default_api_types.environmentRt, _comparison_rt.offsetRt, _default_api_types.kueryRt])
  })]),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const {
      query: {
        dependencyName,
        environment,
        offset,
        numBuckets,
        kuery,
        start,
        end
      }
    } = resources.params;
    const opts = {
      dependencyName,
      apmEventClient,
      start,
      end,
      numBuckets,
      environment,
      kuery
    };
    const [currentServices, previousServices] = await Promise.all([(0, _get_upstream_services_for_dependency.getUpstreamServicesForDependency)(opts), offset ? (0, _get_upstream_services_for_dependency.getUpstreamServicesForDependency)({
      ...opts,
      offset
    }) : Promise.resolve([])]);
    return {
      services: currentServices.map(service => {
        var _prev$stats2;
        const {
          stats,
          ...rest
        } = service;
        const prev = previousServices.find(item => item.location.id === service.location.id);
        return {
          ...rest,
          currentStats: stats,
          previousStats: (_prev$stats2 = prev === null || prev === void 0 ? void 0 : prev.stats) !== null && _prev$stats2 !== void 0 ? _prev$stats2 : null
        };
      })
    };
  }
});
const dependencyMetadataRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/dependencies/metadata',
  params: t.type({
    query: t.intersection([t.type({
      dependencyName: t.string
    }), _default_api_types.rangeRt])
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
      dependencyName,
      start,
      end
    } = params.query;
    const metadata = await (0, _get_metadata_for_dependency.getMetadataForDependency)({
      dependencyName,
      apmEventClient,
      start,
      end
    });
    return {
      metadata
    };
  }
});
const dependencyLatencyChartsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/dependencies/charts/latency',
  params: t.type({
    query: t.intersection([t.type({
      dependencyName: t.string,
      spanName: t.string,
      searchServiceDestinationMetrics: _ioTsUtils.toBooleanRt
    }), _default_api_types.rangeRt, _default_api_types.kueryRt, _default_api_types.environmentRt, _comparison_rt.offsetRt])
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
      dependencyName,
      searchServiceDestinationMetrics,
      spanName,
      kuery,
      environment,
      offset,
      start,
      end
    } = params.query;
    const [currentTimeseries, comparisonTimeseries] = await Promise.all([(0, _get_latency_charts_for_dependency.getLatencyChartsForDependency)({
      dependencyName,
      spanName,
      searchServiceDestinationMetrics,
      apmEventClient,
      start,
      end,
      kuery,
      environment
    }), offset ? (0, _get_latency_charts_for_dependency.getLatencyChartsForDependency)({
      dependencyName,
      spanName,
      searchServiceDestinationMetrics,
      apmEventClient,
      start,
      end,
      kuery,
      environment,
      offset
    }) : null]);
    return {
      currentTimeseries,
      comparisonTimeseries
    };
  }
});
const dependencyThroughputChartsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/dependencies/charts/throughput',
  params: t.type({
    query: t.intersection([t.type({
      dependencyName: t.string,
      spanName: t.string,
      searchServiceDestinationMetrics: _ioTsUtils.toBooleanRt
    }), _default_api_types.rangeRt, _default_api_types.kueryRt, _default_api_types.environmentRt, _comparison_rt.offsetRt])
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
      dependencyName,
      searchServiceDestinationMetrics,
      spanName,
      kuery,
      environment,
      offset,
      start,
      end
    } = params.query;
    const [currentTimeseries, comparisonTimeseries] = await Promise.all([(0, _get_throughput_charts_for_dependency.getThroughputChartsForDependency)({
      dependencyName,
      spanName,
      apmEventClient,
      start,
      end,
      kuery,
      environment,
      searchServiceDestinationMetrics
    }), offset ? (0, _get_throughput_charts_for_dependency.getThroughputChartsForDependency)({
      dependencyName,
      spanName,
      apmEventClient,
      start,
      end,
      kuery,
      environment,
      offset,
      searchServiceDestinationMetrics
    }) : null]);
    return {
      currentTimeseries,
      comparisonTimeseries
    };
  }
});
const dependencyFailedTransactionRateChartsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/dependencies/charts/error_rate',
  params: t.type({
    query: t.intersection([t.type({
      dependencyName: t.string,
      spanName: t.string,
      searchServiceDestinationMetrics: _ioTsUtils.toBooleanRt
    }), _default_api_types.rangeRt, _default_api_types.kueryRt, _default_api_types.environmentRt, _comparison_rt.offsetRt])
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
      dependencyName,
      spanName,
      searchServiceDestinationMetrics,
      kuery,
      environment,
      offset,
      start,
      end
    } = params.query;
    const [currentTimeseries, comparisonTimeseries] = await Promise.all([(0, _get_error_rate_charts_for_dependency.getErrorRateChartsForDependency)({
      dependencyName,
      spanName,
      apmEventClient,
      start,
      end,
      kuery,
      environment,
      searchServiceDestinationMetrics
    }), offset ? (0, _get_error_rate_charts_for_dependency.getErrorRateChartsForDependency)({
      dependencyName,
      spanName,
      apmEventClient,
      start,
      end,
      kuery,
      environment,
      offset,
      searchServiceDestinationMetrics
    }) : null]);
    return {
      currentTimeseries,
      comparisonTimeseries
    };
  }
});
const dependencyOperationsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/dependencies/operations',
  options: {
    tags: ['access:apm']
  },
  params: t.type({
    query: t.intersection([_default_api_types.rangeRt, _default_api_types.environmentRt, _default_api_types.kueryRt, _comparison_rt.offsetRt, t.type({
      dependencyName: t.string,
      searchServiceDestinationMetrics: _ioTsUtils.toBooleanRt
    })])
  }),
  handler: async resources => {
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const {
      query: {
        dependencyName,
        start,
        end,
        environment,
        kuery,
        offset,
        searchServiceDestinationMetrics
      }
    } = resources.params;
    const operations = await (0, _get_top_dependency_operations.getTopDependencyOperations)({
      apmEventClient,
      dependencyName,
      start,
      end,
      offset,
      environment,
      kuery,
      searchServiceDestinationMetrics
    });
    return {
      operations
    };
  }
});
const dependencyLatencyDistributionChartsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/dependencies/charts/distribution',
  params: t.type({
    query: t.intersection([t.type({
      dependencyName: t.string,
      spanName: t.string,
      percentileThreshold: _ioTsUtils.toNumberRt
    }), _default_api_types.rangeRt, _default_api_types.kueryRt, _default_api_types.environmentRt])
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
      dependencyName,
      spanName,
      percentileThreshold,
      kuery,
      environment,
      start,
      end
    } = params.query;
    return (0, _get_dependency_latency_distribution.getDependencyLatencyDistribution)({
      apmEventClient,
      dependencyName,
      spanName,
      percentileThreshold,
      kuery,
      environment,
      start,
      end
    });
  }
});
const topDependencySpansRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/dependencies/operations/spans',
  options: {
    tags: ['access:apm']
  },
  params: t.type({
    query: t.intersection([_default_api_types.rangeRt, _default_api_types.environmentRt, _default_api_types.kueryRt, t.type({
      dependencyName: t.string,
      spanName: t.string
    }), t.partial({
      sampleRangeFrom: _ioTsUtils.toNumberRt,
      sampleRangeTo: _ioTsUtils.toNumberRt
    })])
  }),
  handler: async resources => {
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const {
      query: {
        dependencyName,
        spanName,
        start,
        end,
        environment,
        kuery,
        sampleRangeFrom,
        sampleRangeTo
      }
    } = resources.params;
    const spans = await (0, _get_top_dependency_spans.getTopDependencySpans)({
      apmEventClient,
      dependencyName,
      spanName,
      start,
      end,
      environment,
      kuery,
      sampleRangeFrom,
      sampleRangeTo
    });
    return {
      spans
    };
  }
});
const dependencisRouteRepository = {
  ...topDependenciesRoute,
  ...upstreamServicesForDependencyRoute,
  ...dependencyMetadataRoute,
  ...dependencyLatencyChartsRoute,
  ...dependencyThroughputChartsRoute,
  ...dependencyFailedTransactionRateChartsRoute,
  ...dependencyOperationsRoute,
  ...dependencyLatencyDistributionChartsRoute,
  ...topDependencySpansRoute
};
exports.dependencisRouteRepository = dependencisRouteRepository;