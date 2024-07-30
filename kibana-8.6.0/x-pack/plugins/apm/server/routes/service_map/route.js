"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serviceMapRouteRepository = void 0;
var _boom = _interopRequireDefault(require("@hapi/boom"));
var t = _interopRequireWildcard(require("io-ts"));
var _lodash = require("lodash");
var _common = require("../../../../observability/common");
var _license_check = require("../../../common/license_check");
var _service_map = require("../../../common/service_map");
var _feature = require("../../feature");
var _transactions = require("../../lib/helpers/transactions");
var _get_ml_client = require("../../lib/helpers/get_ml_client");
var _get_service_map = require("./get_service_map");
var _get_service_map_dependency_node_info = require("./get_service_map_dependency_node_info");
var _get_service_map_service_node_info = require("./get_service_map_service_node_info");
var _create_apm_server_route = require("../apm_routes/create_apm_server_route");
var _default_api_types = require("../default_api_types");
var _get_service_group = require("../service_groups/get_service_group");
var _comparison_rt = require("../../../common/comparison_rt");
var _get_apm_event_client = require("../../lib/helpers/get_apm_event_client");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const serviceMapRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/service-map',
  params: t.type({
    query: t.intersection([t.partial({
      serviceName: t.string,
      serviceGroup: t.string
    }), _default_api_types.environmentRt, _default_api_types.rangeRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      config,
      context,
      params,
      logger
    } = resources;
    if (!config.serviceMapEnabled) {
      throw _boom.default.notFound();
    }
    const licensingContext = await context.licensing;
    if (!(0, _license_check.isActivePlatinumLicense)(licensingContext.license)) {
      throw _boom.default.forbidden(_service_map.invalidLicenseMessage);
    }
    (0, _feature.notifyFeatureUsage)({
      licensingPlugin: licensingContext,
      featureName: 'serviceMaps'
    });
    const {
      query: {
        serviceName,
        serviceGroup: serviceGroupId,
        environment,
        start,
        end
      }
    } = params;
    const {
      savedObjects: {
        client: savedObjectsClient
      },
      uiSettings: {
        client: uiSettingsClient
      }
    } = await context.core;
    const [mlClient, apmEventClient, serviceGroup, maxNumberOfServices] = await Promise.all([(0, _get_ml_client.getMlClient)(resources), (0, _get_apm_event_client.getApmEventClient)(resources), serviceGroupId ? (0, _get_service_group.getServiceGroup)({
      savedObjectsClient,
      serviceGroupId
    }) : Promise.resolve(null), uiSettingsClient.get(_common.apmServiceGroupMaxNumberOfServices)]);
    const serviceNames = (0, _lodash.compact)([serviceName]);
    const searchAggregatedTransactions = await (0, _transactions.getSearchTransactionsEvents)({
      apmEventClient,
      config,
      start,
      end,
      kuery: ''
    });
    return (0, _get_service_map.getServiceMap)({
      mlClient,
      config,
      apmEventClient,
      serviceNames,
      environment,
      searchAggregatedTransactions,
      logger,
      start,
      end,
      maxNumberOfServices,
      serviceGroup
    });
  }
});
const serviceMapServiceNodeRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/service-map/service/{serviceName}',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.rangeRt, _comparison_rt.offsetRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      config,
      context,
      params
    } = resources;
    if (!config.serviceMapEnabled) {
      throw _boom.default.notFound();
    }
    const licensingContext = await context.licensing;
    if (!(0, _license_check.isActivePlatinumLicense)(licensingContext.license)) {
      throw _boom.default.forbidden(_service_map.invalidLicenseMessage);
    }
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const {
      path: {
        serviceName
      },
      query: {
        environment,
        start,
        end,
        offset
      }
    } = params;
    const searchAggregatedTransactions = await (0, _transactions.getSearchTransactionsEvents)({
      apmEventClient,
      config,
      start,
      end,
      kuery: ''
    });
    const commonProps = {
      environment,
      apmEventClient,
      serviceName,
      searchAggregatedTransactions,
      start,
      end
    };
    const [currentPeriod, previousPeriod] = await Promise.all([(0, _get_service_map_service_node_info.getServiceMapServiceNodeInfo)(commonProps), offset ? (0, _get_service_map_service_node_info.getServiceMapServiceNodeInfo)({
      ...commonProps,
      offset
    }) : undefined]);
    return {
      currentPeriod,
      previousPeriod
    };
  }
});
const serviceMapDependencyNodeRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/service-map/dependency',
  params: t.type({
    query: t.intersection([t.type({
      dependencyName: t.string
    }), _default_api_types.environmentRt, _default_api_types.rangeRt, _comparison_rt.offsetRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      config,
      context,
      params
    } = resources;
    if (!config.serviceMapEnabled) {
      throw _boom.default.notFound();
    }
    const licensingContext = await context.licensing;
    if (!(0, _license_check.isActivePlatinumLicense)(licensingContext.license)) {
      throw _boom.default.forbidden(_service_map.invalidLicenseMessage);
    }
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const {
      query: {
        dependencyName,
        environment,
        start,
        end,
        offset
      }
    } = params;
    const commonProps = {
      environment,
      apmEventClient,
      dependencyName,
      start,
      end
    };
    const [currentPeriod, previousPeriod] = await Promise.all([(0, _get_service_map_dependency_node_info.getServiceMapDependencyNodeInfo)(commonProps), offset ? (0, _get_service_map_dependency_node_info.getServiceMapDependencyNodeInfo)({
      ...commonProps,
      offset
    }) : undefined]);
    return {
      currentPeriod,
      previousPeriod
    };
  }
});
const serviceMapRouteRepository = {
  ...serviceMapRoute,
  ...serviceMapServiceNodeRoute,
  ...serviceMapDependencyNodeRoute
};
exports.serviceMapRouteRepository = serviceMapRouteRepository;