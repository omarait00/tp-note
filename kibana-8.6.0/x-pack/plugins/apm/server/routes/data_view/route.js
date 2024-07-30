"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataViewRouteRepository = void 0;
var _create_static_data_view = require("./create_static_data_view");
var _create_apm_server_route = require("../apm_routes/create_apm_server_route");
var _get_apm_data_view_title = require("./get_apm_data_view_title");
var _get_apm_indices = require("../settings/apm_indices/get_apm_indices");
var _get_apm_event_client = require("../../lib/helpers/get_apm_event_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const staticDataViewRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'POST /internal/apm/data_view/static',
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      context,
      plugins,
      request
    } = resources;
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const coreContext = await context.core;
    const dataViewStart = await plugins.dataViews.start();
    const dataViewService = await dataViewStart.dataViewsServiceFactory(coreContext.savedObjects.client, coreContext.elasticsearch.client.asCurrentUser, request, true);
    const res = await (0, _create_static_data_view.createStaticDataView)({
      dataViewService,
      resources,
      apmEventClient
    });
    return res;
  }
});
const dataViewTitleRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/data_view/title',
  options: {
    tags: ['access:apm']
  },
  handler: async ({
    context,
    config,
    logger
  }) => {
    const coreContext = await context.core;
    const apmIndicies = await (0, _get_apm_indices.getApmIndices)({
      savedObjectsClient: coreContext.savedObjects.client,
      config
    });
    const apmDataViewTitle = (0, _get_apm_data_view_title.getApmDataViewTitle)(apmIndicies);
    return {
      apmDataViewTitle
    };
  }
});
const dataViewRouteRepository = {
  ...staticDataViewRoute,
  ...dataViewTitleRoute
};
exports.dataViewRouteRepository = dataViewRouteRepository;