"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.labsRouteRepository = void 0;
var _server = require("../../../../../observability/server");
var _create_apm_server_route = require("../../apm_routes/create_apm_server_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getLabsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/settings/labs',
  options: {
    tags: ['access:apm']
  },
  handler: async () => {
    const labsItems = Object.entries(_server.uiSettings).filter(([key, value]) => value.showInLabs).map(([key]) => key);
    return {
      labsItems
    };
  }
});
const labsRouteRepository = getLabsRoute;
exports.labsRouteRepository = labsRouteRepository;