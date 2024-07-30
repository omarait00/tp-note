"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetDataViewsRoute = exports.getDataViews = void 0;
var _handle_errors = require("./util/handle_errors");
var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const getDataViews = async ({
  dataViewsService,
  usageCollection,
  counterName
}) => {
  usageCollection === null || usageCollection === void 0 ? void 0 : usageCollection.incrementCounter({
    counterName
  });
  return dataViewsService.getIdsWithTitle();
};
exports.getDataViews = getDataViews;
const getDataViewsRouteFactory = (path, serviceKey) => (router, getStartServices, usageCollection) => {
  router.get({
    path,
    validate: {}
  }, router.handleLegacyErrors((0, _handle_errors.handleErrors)(async (ctx, req, res) => {
    const core = await ctx.core;
    const savedObjectsClient = core.savedObjects.client;
    const elasticsearchClient = core.elasticsearch.client.asCurrentUser;
    const [,, {
      dataViewsServiceFactory
    }] = await getStartServices();
    const dataViewsService = await dataViewsServiceFactory(savedObjectsClient, elasticsearchClient, req);
    const dataViews = await getDataViews({
      dataViewsService,
      usageCollection,
      counterName: `${req.route.method} ${path}`
    });
    return res.ok({
      headers: {
        'content-type': 'application/json'
      },
      body: {
        [serviceKey]: dataViews
      }
    });
  })));
};
const registerGetDataViewsRoute = getDataViewsRouteFactory(_constants.SERVICE_PATH, _constants.SERVICE_KEY);
exports.registerGetDataViewsRoute = registerGetDataViewsRoute;