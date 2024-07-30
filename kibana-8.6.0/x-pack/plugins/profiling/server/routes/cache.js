"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCacheExecutablesRoute = registerCacheExecutablesRoute;
exports.registerCacheStackFramesRoute = registerCacheStackFramesRoute;
var _common = require("../../common");
var _handle_route_error_handler = require("../utils/handle_route_error_handler");
var _stacktrace = require("./stacktrace");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerCacheExecutablesRoute({
  router,
  logger
}) {
  const paths = (0, _common.getRoutePaths)();
  router.delete({
    path: paths.CacheExecutables,
    validate: {}
  }, async (context, request, response) => {
    try {
      logger.info(`clearing executable cache`);
      const numDeleted = (0, _stacktrace.clearExecutableCache)();
      logger.info(`removed ${numDeleted} executables from cache`);
      return response.ok({});
    } catch (error) {
      return (0, _handle_route_error_handler.handleRouteHandlerError)({
        error,
        logger,
        response
      });
    }
  });
}
function registerCacheStackFramesRoute({
  router,
  logger
}) {
  const paths = (0, _common.getRoutePaths)();
  router.delete({
    path: paths.CacheStackFrames,
    validate: {}
  }, async (context, request, response) => {
    try {
      logger.info(`clearing stackframe cache`);
      const numDeleted = (0, _stacktrace.clearStackFrameCache)();
      logger.info(`removed ${numDeleted} stackframes from cache`);
      return response.ok({});
    } catch (error) {
      return (0, _handle_route_error_handler.handleRouteHandlerError)({
        error,
        logger,
        response
      });
    }
  });
}