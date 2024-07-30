"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serviceGroupRouteRepository = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _common = require("../../../../observability/common");
var _create_apm_server_route = require("../apm_routes/create_apm_server_route");
var _default_api_types = require("../default_api_types");
var _get_service_groups = require("./get_service_groups");
var _get_service_group = require("./get_service_group");
var _save_service_group = require("./save_service_group");
var _delete_service_group = require("./delete_service_group");
var _lookup_services = require("./lookup_services");
var _service_groups = require("../../../common/service_groups");
var _get_services_counts = require("./get_services_counts");
var _get_apm_event_client = require("../../lib/helpers/get_apm_event_client");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const serviceGroupsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/service-groups',
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      context
    } = resources;
    const {
      savedObjects: {
        client: savedObjectsClient
      }
    } = await context.core;
    const serviceGroups = await (0, _get_service_groups.getServiceGroups)({
      savedObjectsClient
    });
    return {
      serviceGroups
    };
  }
});
const serviceGroupsWithServiceCountRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/service_groups/services_count',
  params: t.type({
    query: _default_api_types.rangeRt
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      context,
      params
    } = resources;
    const {
      savedObjects: {
        client: savedObjectsClient
      }
    } = await context.core;
    const {
      query: {
        start,
        end
      }
    } = params;
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const serviceGroups = await (0, _get_service_groups.getServiceGroups)({
      savedObjectsClient
    });
    return {
      servicesCounts: await (0, _get_services_counts.getServicesCounts)({
        apmEventClient,
        serviceGroups,
        start,
        end
      })
    };
  }
});
const serviceGroupRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/service-group',
  params: t.type({
    query: t.type({
      serviceGroup: t.string
    })
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      context,
      params
    } = resources;
    const {
      savedObjects: {
        client: savedObjectsClient
      }
    } = await context.core;
    const serviceGroup = await (0, _get_service_group.getServiceGroup)({
      savedObjectsClient,
      serviceGroupId: params.query.serviceGroup
    });
    return {
      serviceGroup
    };
  }
});
const serviceGroupSaveRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'POST /internal/apm/service-group',
  params: t.type({
    query: t.union([t.partial({
      serviceGroupId: t.string
    }), t.undefined]),
    body: t.type({
      groupName: t.string,
      kuery: t.string,
      description: t.union([t.string, t.undefined]),
      color: t.union([t.string, t.undefined])
    })
  }),
  options: {
    tags: ['access:apm', 'access:apm_write']
  },
  handler: async resources => {
    const {
      context,
      params
    } = resources;
    const {
      serviceGroupId
    } = params.query;
    const {
      savedObjects: {
        client: savedObjectsClient
      }
    } = await context.core;
    const {
      isValidFields,
      isValidSyntax,
      message
    } = (0, _service_groups.validateServiceGroupKuery)(params.body.kuery);
    if (!(isValidFields && isValidSyntax)) {
      throw _boom.default.badRequest(message);
    }
    await (0, _save_service_group.saveServiceGroup)({
      savedObjectsClient,
      serviceGroupId,
      serviceGroup: params.body
    });
  }
});
const serviceGroupDeleteRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'DELETE /internal/apm/service-group',
  params: t.type({
    query: t.type({
      serviceGroupId: t.string
    })
  }),
  options: {
    tags: ['access:apm', 'access:apm_write']
  },
  handler: async resources => {
    const {
      context,
      params
    } = resources;
    const {
      serviceGroupId
    } = params.query;
    const savedObjectsClient = (await context.core).savedObjects.client;
    await (0, _delete_service_group.deleteServiceGroup)({
      savedObjectsClient,
      serviceGroupId
    });
  }
});
const serviceGroupServicesRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/service-group/services',
  params: t.type({
    query: t.intersection([_default_api_types.rangeRt, t.partial(_default_api_types.kueryRt.props)])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      params,
      context
    } = resources;
    const {
      kuery = '',
      start,
      end
    } = params.query;
    const {
      uiSettings: {
        client: uiSettingsClient
      }
    } = await context.core;
    const [apmEventClient, maxNumberOfServices] = await Promise.all([(0, _get_apm_event_client.getApmEventClient)(resources), uiSettingsClient.get(_common.apmServiceGroupMaxNumberOfServices)]);
    const items = await (0, _lookup_services.lookupServices)({
      apmEventClient,
      kuery,
      start,
      end,
      maxNumberOfServices
    });
    return {
      items
    };
  }
});
const serviceGroupRouteRepository = {
  ...serviceGroupsRoute,
  ...serviceGroupRoute,
  ...serviceGroupSaveRoute,
  ...serviceGroupDeleteRoute,
  ...serviceGroupServicesRoute,
  ...serviceGroupsWithServiceCountRoute
};
exports.serviceGroupRouteRepository = serviceGroupRouteRepository;