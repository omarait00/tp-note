"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mobileRouteRepository = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _get_apm_event_client = require("../../lib/helpers/get_apm_event_client");
var _create_apm_server_route = require("../apm_routes/create_apm_server_route");
var _default_api_types = require("../default_api_types");
var _get_mobile_filters = require("./get_mobile_filters");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const mobileFilters = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/services/{serviceName}/mobile/filters',
  params: t.type({
    path: t.type({
      serviceName: t.string
    }),
    query: t.intersection([_default_api_types.kueryRt, _default_api_types.rangeRt, _default_api_types.environmentRt, t.partial({
      transactionType: t.string
    })])
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
      kuery,
      environment,
      start,
      end,
      transactionType
    } = params.query;
    const filters = await (0, _get_mobile_filters.getMobileFilters)({
      kuery,
      environment,
      transactionType,
      start,
      end,
      serviceName,
      apmEventClient
    });
    return {
      mobileFilters: filters
    };
  }
});
const mobileRouteRepository = {
  ...mobileFilters
};
exports.mobileRouteRepository = mobileRouteRepository;