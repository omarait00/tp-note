"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serviceRouteRepository = exports.serviceInstancesMetadataDetails = exports.serviceDependenciesRoute = exports.serviceDependenciesBreakdownRoute = void 0;
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _ioTsUtils = require("@kbn/io-ts-utils");
var t = _interopRequireWildcard(require("io-ts"));
var _lodash = require("lodash");
var _server = require("../../../../ml/server");
var _annotations = require("../../../../observability/common/annotations");
var _common = require("../../../../observability/common");
var _latency_aggregation_types = require("../../../common/latency_aggregation_types");
var _transactions = require("../../lib/helpers/transactions");
var _get_service_inventory_search_source = require("../../lib/helpers/get_service_inventory_search_source");
var _get_ml_client = require("../../lib/helpers/get_ml_client");
var _annotations2 = require("./annotations");
var _get_services = require("./get_services");
var _get_service_agent = require("./get_service_agent");
var _get_service_dependencies = require("./get_service_dependencies");
var _get_service_instance_metadata_details = require("./get_service_instance_metadata_details");
var _main_statistics = require("./get_service_instances/main_statistics");
var _get_service_metadata_details = require("./get_service_metadata_details");
var _get_service_metadata_icons = require("./get_service_metadata_icons");
var _get_service_node_metadata = require("./get_service_node_metadata");
var _get_service_transaction_types = require("./get_service_transaction_types");
var _get_throughput = require("./get_throughput");
var _with_apm_span = require("../../utils/with_apm_span");
var _create_apm_server_route = require("../apm_routes/create_apm_server_route");
var _default_api_types = require("../default_api_types");
var _offset_previous_period_coordinate = require("../../../common/utils/offset_previous_period_coordinate");
var _get_service_overview_container_metadata = require("./get_service_overview_container_metadata");
var _get_service_instance_container_metadata = require("./get_service_instance_container_metadata");
var _get_services_detailed_statistics = require("./get_services_detailed_statistics");
var _get_service_dependencies_breakdown = require("./get_service_dependencies_breakdown");
var _get_anomaly_timeseries = require("../../lib/anomaly_detection/get_anomaly_timeseries");
var _detailed_statistics = require("./get_service_instances/detailed_statistics");
var _anomaly_detection = require("../../../common/anomaly_detection");
var _get_sorted_and_filtered_services = require("./get_services/get_sorted_and_filtered_services");
var _service_health_status = require("../../../common/service_health_status");
var _get_service_group = require("../service_groups/get_service_group");
var _comparison_rt = require("../../../common/comparison_rt");
var _get_random_sampler = require("../../lib/helpers/get_random_sampler");
var _create_infra_metrics_client = require("../../lib/helpers/create_es_client/create_infra_metrics_client/create_infra_metrics_client");
var _get_apm_event_client = require("../../lib/helpers/get_apm_event_client");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const servicesRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services',
  params: t.type({
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, t.partial({
      serviceGroup: t.string
    }), _default_api_types.probabilityRt])
  }),
  options: {
    tags: ['access:apm']
  },
  async handler(resources) {
    const {
      config,
      context,
      params,
      logger,
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
      serviceGroup: serviceGroupId,
      probability
    } = params.query;
    const savedObjectsClient = (await context.core).savedObjects.client;
    const [mlClient, apmEventClient, serviceGroup, randomSampler] = await Promise.all([(0, _get_ml_client.getMlClient)(resources), (0, _get_apm_event_client.getApmEventClient)(resources), serviceGroupId ? (0, _get_service_group.getServiceGroup)({
      savedObjectsClient,
      serviceGroupId
    }) : Promise.resolve(null), (0, _get_random_sampler.getRandomSampler)({
      security,
      request,
      probability
    })]);
    const {
      searchAggregatedTransactions,
      searchAggregatedServiceMetrics
    } = await (0, _get_service_inventory_search_source.getServiceInventorySearchSource)({
      serviceMetricsEnabled: false,
      // Disable serviceMetrics for 8.5 & 8.6
      config,
      apmEventClient,
      kuery,
      start,
      end
    });
    return (0, _get_services.getServices)({
      environment,
      kuery,
      mlClient,
      apmEventClient,
      searchAggregatedTransactions,
      searchAggregatedServiceMetrics,
      logger,
      start,
      end,
      serviceGroup,
      randomSampler
    });
  }
});
const servicesDetailedStatisticsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'POST /internal/apm/services/detailed_statistics',
  params: t.type({
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, _comparison_rt.offsetRt, _default_api_types.probabilityRt]),
    body: t.type({
      serviceNames: _ioTsUtils.jsonRt.pipe(t.array(t.string))
    })
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
      offset,
      start,
      end,
      probability
    } = params.query;
    const {
      serviceNames
    } = params.body;
    const [apmEventClient, randomSampler] = await Promise.all([(0, _get_apm_event_client.getApmEventClient)(resources), (0, _get_random_sampler.getRandomSampler)({
      security,
      request,
      probability
    })]);
    const {
      searchAggregatedTransactions,
      searchAggregatedServiceMetrics
    } = await (0, _get_service_inventory_search_source.getServiceInventorySearchSource)({
      serviceMetricsEnabled: false,
      // Disable serviceMetrics for 8.5 & 8.6
      config,
      apmEventClient,
      kuery,
      start,
      end
    });
    if (!serviceNames.length) {
      throw _boom.default.badRequest(`serviceNames cannot be empty`);
    }
    return (0, _get_services_detailed_statistics.getServicesDetailedStatistics)({
      environment,
      kuery,
      apmEventClient,
      searchAggregatedTransactions,
      searchAggregatedServiceMetrics,
      offset,
      serviceNames,
      start,
      end,
      randomSampler
    });
  }
});
const serviceMetadataDetailsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/metadata/details',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: _default_api_types.rangeRt
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    var _serviceMetadataDetai;
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const infraMetricsClient = (0, _create_infra_metrics_client.createInfraMetricsClient)(resources);
    const {
      params,
      config
    } = resources;
    const {
      serviceName
    } = params.path;
    const {
      start,
      end
    } = params.query;
    const searchAggregatedTransactions = await (0, _transactions.getSearchTransactionsEvents)({
      apmEventClient,
      config,
      start,
      end,
      kuery: ''
    });
    const serviceMetadataDetails = await (0, _get_service_metadata_details.getServiceMetadataDetails)({
      serviceName,
      apmEventClient,
      searchAggregatedTransactions,
      start,
      end
    });
    if (serviceMetadataDetails !== null && serviceMetadataDetails !== void 0 && (_serviceMetadataDetai = serviceMetadataDetails.container) !== null && _serviceMetadataDetai !== void 0 && _serviceMetadataDetai.ids) {
      const containerMetadata = await (0, _get_service_overview_container_metadata.getServiceOverviewContainerMetadata)({
        infraMetricsClient,
        containerIds: serviceMetadataDetails.container.ids,
        start,
        end
      });
      return (0, _lodash.mergeWith)(serviceMetadataDetails, containerMetadata);
    }
    return serviceMetadataDetails;
  }
});
const serviceMetadataIconsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/metadata/icons',
  params: t.type({
    path: t.type({
      serviceName: t.string
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
      serviceName
    } = params.path;
    const {
      start,
      end
    } = params.query;
    const searchAggregatedTransactions = await (0, _transactions.getSearchTransactionsEvents)({
      apmEventClient,
      config,
      start,
      end,
      kuery: ''
    });
    return (0, _get_service_metadata_icons.getServiceMetadataIcons)({
      serviceName,
      apmEventClient,
      searchAggregatedTransactions,
      start,
      end
    });
  }
});
const serviceAgentRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/agent',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: _default_api_types.rangeRt
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
      start,
      end
    } = params.query;
    return (0, _get_service_agent.getServiceAgent)({
      serviceName,
      apmEventClient,
      start,
      end
    });
  }
});
const serviceTransactionTypesRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/transaction_types',
  params: t.type({
    path: t.type({
      serviceName: t.string
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
      serviceName
    } = params.path;
    const {
      start,
      end
    } = params.query;
    return (0, _get_service_transaction_types.getServiceTransactionTypes)({
      serviceName,
      apmEventClient,
      searchAggregatedTransactions: await (0, _transactions.getSearchTransactionsEvents)({
        apmEventClient,
        config,
        start,
        end,
        kuery: ''
      }),
      start,
      end
    });
  }
});
const serviceNodeMetadataRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/node/{serviceNodeName}/metadata',
  params: t.type({
    path: t.type({
      serviceName: t.string,
      serviceNodeName: t.string
    }),
    query: t.intersection([_default_api_types.kueryRt, _default_api_types.rangeRt, _default_api_types.environmentRt])
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
      serviceName,
      serviceNodeName
    } = params.path;
    const {
      kuery,
      start,
      end,
      environment
    } = params.query;
    return (0, _get_service_node_metadata.getServiceNodeMetadata)({
      kuery,
      apmEventClient,
      serviceName,
      serviceNodeName,
      start,
      end,
      environment
    });
  }
});
const serviceAnnotationsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /api/apm/services/{serviceName}/annotation/search',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.rangeRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const {
      params,
      plugins,
      context,
      request,
      logger,
      config
    } = resources;
    const {
      serviceName
    } = params.path;
    const {
      environment,
      start,
      end
    } = params.query;
    const esClient = (await context.core).elasticsearch.client;
    const {
      observability
    } = plugins;
    const [annotationsClient, searchAggregatedTransactions] = await Promise.all([observability ? (0, _with_apm_span.withApmSpan)('get_scoped_annotations_client', () => observability.setup.getScopedAnnotationsClient(context, request)) : undefined, (0, _transactions.getSearchTransactionsEvents)({
      apmEventClient,
      config,
      start,
      end,
      kuery: ''
    })]);
    return (0, _annotations2.getServiceAnnotations)({
      environment,
      apmEventClient,
      searchAggregatedTransactions,
      serviceName,
      annotationsClient,
      client: esClient.asCurrentUser,
      logger,
      start,
      end
    });
  }
});
const serviceAnnotationsCreateRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'POST /api/apm/services/{serviceName}/annotation',
  options: {
    tags: ['access:apm', 'access:apm_write']
  },
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    body: t.intersection([t.type({
      '@timestamp': _ioTsUtils.isoToEpochRt,
      service: t.intersection([t.type({
        version: t.string
      }), t.partial({
        environment: t.string
      })])
    }), t.partial({
      message: t.string,
      tags: t.array(t.string)
    })])
  }),
  handler: async resources => {
    const {
      request,
      context,
      plugins: {
        observability
      },
      params
    } = resources;
    const annotationsClient = observability ? await (0, _with_apm_span.withApmSpan)('get_scoped_annotations_client', () => observability.setup.getScopedAnnotationsClient(context, request)) : undefined;
    if (!annotationsClient) {
      throw _boom.default.notFound();
    }
    const {
      body,
      path
    } = params;
    return (0, _with_apm_span.withApmSpan)('create_annotation', () => {
      var _body$tags;
      return annotationsClient.create({
        message: body.service.version,
        ...body,
        '@timestamp': new Date(body['@timestamp']).toISOString(),
        annotation: {
          type: 'deployment'
        },
        service: {
          ...body.service,
          name: path.serviceName
        },
        tags: (0, _lodash.uniq)(['apm'].concat((_body$tags = body.tags) !== null && _body$tags !== void 0 ? _body$tags : []))
      });
    });
  }
});
const serviceThroughputRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/throughput',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([t.type({
      transactionType: t.string
    }), t.partial({
      transactionName: t.string
    }), t.intersection([_default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, _comparison_rt.offsetRt])])
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
      serviceName
    } = params.path;
    const {
      environment,
      kuery,
      transactionType,
      transactionName,
      offset,
      start,
      end
    } = params.query;
    const searchAggregatedTransactions = await (0, _transactions.getSearchTransactionsEvents)({
      config,
      apmEventClient,
      kuery,
      start,
      end
    });
    const commonProps = {
      environment,
      kuery,
      searchAggregatedTransactions,
      serviceName,
      apmEventClient,
      transactionType,
      transactionName
    };
    const [currentPeriod, previousPeriod] = await Promise.all([(0, _get_throughput.getThroughput)({
      ...commonProps,
      start,
      end
    }), offset ? (0, _get_throughput.getThroughput)({
      ...commonProps,
      start,
      end,
      offset
    }) : []]);
    return {
      currentPeriod,
      previousPeriod: (0, _offset_previous_period_coordinate.offsetPreviousPeriodCoordinates)({
        currentPeriodTimeseries: currentPeriod,
        previousPeriodTimeseries: previousPeriod
      })
    };
  }
});
const serviceInstancesMainStatisticsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/service_overview_instances/main_statistics',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([t.type({
      latencyAggregationType: _latency_aggregation_types.latencyAggregationTypeRt,
      transactionType: t.string
    }), _comparison_rt.offsetRt, _default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt])
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
      serviceName
    } = params.path;
    const {
      environment,
      kuery,
      transactionType,
      latencyAggregationType,
      offset,
      start,
      end
    } = params.query;
    const searchAggregatedTransactions = await (0, _transactions.getSearchTransactionsEvents)({
      config,
      apmEventClient,
      kuery,
      start,
      end
    });
    const [currentPeriod, previousPeriod] = await Promise.all([(0, _main_statistics.getServiceInstancesMainStatistics)({
      environment,
      kuery,
      latencyAggregationType,
      serviceName,
      apmEventClient,
      transactionType,
      searchAggregatedTransactions,
      start,
      end
    }), ...(offset ? [(0, _main_statistics.getServiceInstancesMainStatistics)({
      environment,
      kuery,
      latencyAggregationType,
      serviceName,
      apmEventClient,
      transactionType,
      searchAggregatedTransactions,
      start,
      end,
      offset
    })] : [])]);
    return {
      currentPeriod,
      previousPeriod
    };
  }
});
const serviceInstancesDetailedStatisticsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/service_overview_instances/detailed_statistics',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([t.type({
      latencyAggregationType: _latency_aggregation_types.latencyAggregationTypeRt,
      transactionType: t.string,
      serviceNodeIds: _ioTsUtils.jsonRt.pipe(t.array(t.string)),
      numBuckets: _ioTsUtils.toNumberRt
    }), _default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, _comparison_rt.offsetRt])
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
      serviceName
    } = params.path;
    const {
      environment,
      kuery,
      transactionType,
      offset,
      serviceNodeIds,
      numBuckets,
      latencyAggregationType,
      start,
      end
    } = params.query;
    const searchAggregatedTransactions = await (0, _transactions.getSearchTransactionsEvents)({
      apmEventClient,
      config,
      kuery,
      start,
      end
    });
    return (0, _detailed_statistics.getServiceInstancesDetailedStatisticsPeriods)({
      environment,
      kuery,
      latencyAggregationType,
      serviceName,
      apmEventClient,
      transactionType,
      searchAggregatedTransactions,
      numBuckets,
      serviceNodeIds,
      offset,
      start,
      end
    });
  }
});
const serviceInstancesMetadataDetails = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/service_overview_instances/details/{serviceNodeName}',
  params: t.type({
    path: t.type({
      serviceName: t.string,
      serviceNodeName: t.string
    }),
    query: _default_api_types.rangeRt
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    var _serviceInstanceMetad;
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const infraMetricsClient = (0, _create_infra_metrics_client.createInfraMetricsClient)(resources);
    const {
      params
    } = resources;
    const {
      serviceName,
      serviceNodeName
    } = params.path;
    const {
      start,
      end
    } = params.query;
    const serviceInstanceMetadataDetails = await (0, _get_service_instance_metadata_details.getServiceInstanceMetadataDetails)({
      apmEventClient,
      serviceName,
      serviceNodeName,
      start,
      end
    });
    if (serviceInstanceMetadataDetails !== null && serviceInstanceMetadataDetails !== void 0 && (_serviceInstanceMetad = serviceInstanceMetadataDetails.container) !== null && _serviceInstanceMetad !== void 0 && _serviceInstanceMetad.id) {
      const containerMetadata = await (0, _get_service_instance_container_metadata.getServiceInstanceContainerMetadata)({
        infraMetricsClient,
        containerId: serviceInstanceMetadataDetails.container.id,
        start,
        end
      });
      return (0, _lodash.mergeWith)(serviceInstanceMetadataDetails, containerMetadata);
    }
    return serviceInstanceMetadataDetails;
  }
});
exports.serviceInstancesMetadataDetails = serviceInstancesMetadataDetails;
const serviceDependenciesRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/dependencies',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([t.type({
      numBuckets: _ioTsUtils.toNumberRt
    }), _default_api_types.environmentRt, _default_api_types.rangeRt, _comparison_rt.offsetRt])
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
      numBuckets,
      start,
      end,
      offset
    } = params.query;
    const opts = {
      apmEventClient,
      start,
      end,
      serviceName,
      environment,
      numBuckets
    };
    const [currentPeriod, previousPeriod] = await Promise.all([(0, _get_service_dependencies.getServiceDependencies)(opts), ...(offset ? [(0, _get_service_dependencies.getServiceDependencies)({
      ...opts,
      offset
    })] : [[]])]);
    return {
      serviceDependencies: currentPeriod.map(item => {
        const {
          stats,
          ...rest
        } = item;
        const previousPeriodItem = previousPeriod.find(prevItem => item.location.id === prevItem.location.id);
        return {
          ...rest,
          currentStats: stats,
          previousStats: (previousPeriodItem === null || previousPeriodItem === void 0 ? void 0 : previousPeriodItem.stats) || null
        };
      })
    };
  }
});
exports.serviceDependenciesRoute = serviceDependenciesRoute;
const serviceDependenciesBreakdownRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/dependencies/breakdown',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.rangeRt, _default_api_types.kueryRt])
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
      start,
      end,
      kuery
    } = params.query;
    const breakdown = await (0, _get_service_dependencies_breakdown.getServiceDependenciesBreakdown)({
      apmEventClient,
      start,
      end,
      serviceName,
      environment,
      kuery
    });
    return {
      breakdown
    };
  }
});
exports.serviceDependenciesBreakdownRoute = serviceDependenciesBreakdownRoute;
const serviceAnomalyChartsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/anomaly_charts',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_default_api_types.rangeRt, _default_api_types.environmentRt, t.type({
      transactionType: t.string
    })])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const mlClient = await (0, _get_ml_client.getMlClient)(resources);
    if (!mlClient) {
      throw _boom.default.notImplemented(_anomaly_detection.ML_ERRORS.ML_NOT_AVAILABLE);
    }
    const {
      path: {
        serviceName
      },
      query: {
        start,
        end,
        transactionType,
        environment
      }
    } = resources.params;
    try {
      const allAnomalyTimeseries = await (0, _get_anomaly_timeseries.getAnomalyTimeseries)({
        serviceName,
        transactionType,
        start,
        end,
        mlClient,
        logger: resources.logger,
        environment
      });
      return {
        allAnomalyTimeseries
      };
    } catch (error) {
      if (error instanceof _server.UnknownMLCapabilitiesError || error instanceof _server.InsufficientMLCapabilities || error instanceof _server.MLPrivilegesUninitialized) {
        throw _boom.default.forbidden(error.message);
      }
      throw error;
    }
  }
});
const sortedAndFilteredServicesRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/sorted_and_filtered_services',
  options: {
    tags: ['access:apm']
  },
  params: t.type({
    query: t.intersection([_default_api_types.rangeRt, _default_api_types.environmentRt, _default_api_types.kueryRt, t.partial({
      serviceGroup: t.string
    })])
  }),
  handler: async resources => {
    const {
      query: {
        start,
        end,
        environment,
        kuery,
        serviceGroup: serviceGroupId
      }
    } = resources.params;
    if (kuery) {
      return {
        services: []
      };
    }
    const {
      savedObjects: {
        client: savedObjectsClient
      },
      uiSettings: {
        client: uiSettingsClient
      }
    } = await resources.context.core;
    const [mlClient, apmEventClient, serviceGroup, maxNumberOfServices] = await Promise.all([(0, _get_ml_client.getMlClient)(resources), (0, _get_apm_event_client.getApmEventClient)(resources), serviceGroupId ? (0, _get_service_group.getServiceGroup)({
      savedObjectsClient,
      serviceGroupId
    }) : Promise.resolve(null), uiSettingsClient.get(_common.apmServiceGroupMaxNumberOfServices)]);
    return {
      services: await (0, _get_sorted_and_filtered_services.getSortedAndFilteredServices)({
        mlClient,
        apmEventClient,
        start,
        end,
        environment,
        logger: resources.logger,
        serviceGroup,
        maxNumberOfServices
      })
    };
  }
});
const serviceRouteRepository = {
  ...servicesRoute,
  ...servicesDetailedStatisticsRoute,
  ...serviceMetadataDetailsRoute,
  ...serviceMetadataIconsRoute,
  ...serviceAgentRoute,
  ...serviceTransactionTypesRoute,
  ...serviceNodeMetadataRoute,
  ...serviceAnnotationsRoute,
  ...serviceAnnotationsCreateRoute,
  ...serviceInstancesMetadataDetails,
  ...serviceThroughputRoute,
  ...serviceInstancesMainStatisticsRoute,
  ...serviceInstancesDetailedStatisticsRoute,
  ...serviceDependenciesRoute,
  ...serviceDependenciesBreakdownRoute,
  ...serviceAnomalyChartsRoute,
  ...sortedAndFilteredServicesRoute
};
exports.serviceRouteRepository = serviceRouteRepository;