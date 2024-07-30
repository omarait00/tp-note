"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initSyntheticsServer = void 0;
var _rxjs = require("rxjs");
var _create_route_with_auth = require("./routes/create_route_with_auth");
var _synthetics_route_wrapper = require("./synthetics_route_wrapper");
var _requests = require("./legacy_uptime/lib/requests");
var _routes = require("./routes");
var _domains = require("./legacy_uptime/lib/domains");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const initSyntheticsServer = (server, syntheticsMonitorClient, plugins) => {
  const libs = {
    requests: _requests.uptimeRequests,
    license: _domains.licenseCheck
  };
  _routes.syntheticsAppRestApiRoutes.forEach(route => {
    const {
      method,
      options,
      handler,
      validate,
      path
    } = (0, _synthetics_route_wrapper.syntheticsRouteWrapper)((0, _create_route_with_auth.createSyntheticsRouteWithAuth)(libs, route), server, syntheticsMonitorClient);
    const routeDefinition = {
      path,
      validate,
      options
    };
    switch (method) {
      case 'GET':
        server.router.get(routeDefinition, handler);
        break;
      case 'POST':
        server.router.post(routeDefinition, handler);
        break;
      case 'PUT':
        server.router.put(routeDefinition, handler);
        break;
      case 'DELETE':
        server.router.delete(routeDefinition, handler);
        break;
      default:
        throw new Error(`Handler for method ${method} is not defined`);
    }
  });
  _routes.syntheticsAppStreamingApiRoutes.forEach(route => {
    const {
      method,
      streamHandler,
      path,
      options
    } = (0, _synthetics_route_wrapper.syntheticsRouteWrapper)((0, _create_route_with_auth.createSyntheticsRouteWithAuth)(libs, route), server, syntheticsMonitorClient);
    plugins.bfetch.addStreamingResponseRoute(path, (request, context) => {
      return {
        getResponseStream: ({
          data
        }) => {
          const subject = new _rxjs.Subject();
          if (streamHandler) {
            streamHandler(context, request, subject);
          }
          return subject;
        }
      };
    }, method, server.router, options);
  });
};
exports.initSyntheticsServer = initSyntheticsServer;