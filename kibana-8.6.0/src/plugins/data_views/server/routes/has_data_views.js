"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerHasDataViewsRoute = void 0;
var _has_user_data_view = require("../has_user_data_view");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const registerHasDataViewsRoute = router => {
  router.get({
    path: '/internal/data_views/has_data_views',
    validate: {}
  }, async (ctx, req, res) => {
    const core = await ctx.core;
    const savedObjectsClient = core.savedObjects.client;
    const elasticsearchClient = core.elasticsearch.client.asCurrentUser;
    const dataViews = await (0, _has_user_data_view.getDataViews)({
      esClient: elasticsearchClient,
      soClient: savedObjectsClient
    });
    const hasUserDataViewResult = await (0, _has_user_data_view.hasUserDataView)({
      esClient: elasticsearchClient,
      soClient: savedObjectsClient
    }, dataViews);
    const response = {
      hasDataView: dataViews.total > 0,
      hasUserDataView: hasUserDataViewResult
    };
    return res.ok({
      body: response
    });
  });
};
exports.registerHasDataViewsRoute = registerHasDataViewsRoute;