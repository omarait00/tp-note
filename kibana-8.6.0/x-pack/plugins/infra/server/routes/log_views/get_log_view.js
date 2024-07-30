"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGetLogViewRoute = void 0;
var _log_views = require("../../../common/http_api/log_views");
var _runtime_types = require("../../../common/runtime_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const initGetLogViewRoute = ({
  framework,
  getStartServices
}) => {
  framework.registerRoute({
    method: 'get',
    path: _log_views.LOG_VIEW_URL,
    validate: {
      params: (0, _runtime_types.createValidationFunction)(_log_views.getLogViewRequestParamsRT)
    }
  }, async (_requestContext, request, response) => {
    const {
      logViewId
    } = request.params;
    const {
      logViews
    } = (await getStartServices())[2];
    const logViewsClient = logViews.getScopedClient(request);
    try {
      const logView = await logViewsClient.getLogView(logViewId);
      return response.ok({
        body: _log_views.getLogViewResponsePayloadRT.encode({
          data: logView
        })
      });
    } catch (error) {
      var _error$statusCode, _error$message;
      return response.customError({
        statusCode: (_error$statusCode = error.statusCode) !== null && _error$statusCode !== void 0 ? _error$statusCode : 500,
        body: {
          message: (_error$message = error.message) !== null && _error$message !== void 0 ? _error$message : 'An unexpected error occurred'
        }
      });
    }
  });
};
exports.initGetLogViewRoute = initGetLogViewRoute;