"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.agentExplorerRouteRepository = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _get_apm_event_client = require("../../lib/helpers/get_apm_event_client");
var _get_random_sampler = require("../../lib/helpers/get_random_sampler");
var _create_apm_server_route = require("../apm_routes/create_apm_server_route");
var _default_api_types = require("../default_api_types");
var _get_agents = require("./get_agents");
var _get_agent_instances = require("./get_agent_instances");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const agentExplorerRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/get_agents_per_service',
  options: {
    tags: ['access:apm']
  },
  params: t.type({
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, _default_api_types.probabilityRt, t.partial({
      serviceName: t.string,
      agentLanguage: t.string
    })])
  }),
  async handler(resources) {
    const {
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
      probability,
      serviceName,
      agentLanguage
    } = params.query;
    const [apmEventClient, randomSampler] = await Promise.all([(0, _get_apm_event_client.getApmEventClient)(resources), (0, _get_random_sampler.getRandomSampler)({
      security,
      request,
      probability
    })]);
    return (0, _get_agents.getAgents)({
      environment,
      serviceName,
      agentLanguage,
      kuery,
      apmEventClient,
      start,
      end,
      randomSampler
    });
  }
});
const agentExplorerInstanceRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/agent_instances',
  options: {
    tags: ['access:apm']
  },
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_default_api_types.environmentRt, _default_api_types.kueryRt, _default_api_types.rangeRt, _default_api_types.probabilityRt])
  }),
  async handler(resources) {
    const {
      params
    } = resources;
    const {
      environment,
      kuery,
      start,
      end
    } = params.query;
    const {
      serviceName
    } = params.path;
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    return {
      items: await (0, _get_agent_instances.getAgentInstances)({
        environment,
        serviceName,
        kuery,
        apmEventClient,
        start,
        end
      })
    };
  }
});
const agentExplorerRouteRepository = {
  ...agentExplorerRoute,
  ...agentExplorerInstanceRoute
};
exports.agentExplorerRouteRepository = agentExplorerRouteRepository;