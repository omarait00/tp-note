"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syntheticsRouteWrapper = void 0;
var _coreHttpRouterServerInternal = require("@kbn/core-http-router-server-internal");
var _common = require("../../observability/common");
var _lib = require("./legacy_uptime/lib/lib");
var _service_api_key = require("./legacy_uptime/lib/saved_objects/service_api_key");
var _constants = require("../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const syntheticsRouteWrapper = (uptimeRoute, server, syntheticsMonitorClient) => {
  var _uptimeRoute$options;
  return {
    ...uptimeRoute,
    options: {
      tags: ['access:uptime-read', ...(uptimeRoute !== null && uptimeRoute !== void 0 && uptimeRoute.writeAccess ? ['access:uptime-write'] : [])],
      ...((_uptimeRoute$options = uptimeRoute.options) !== null && _uptimeRoute$options !== void 0 ? _uptimeRoute$options : {})
    },
    streamHandler: async (context, request, subject) => {
      var _server$config$servic;
      const coreContext = await context.core;
      const {
        client: esClient
      } = coreContext.elasticsearch;
      const savedObjectsClient = coreContext.savedObjects.getClient({
        includedHiddenTypes: [_service_api_key.syntheticsServiceApiKey.name]
      });

      // specifically needed for the synthetics service api key generation
      server.authSavedObjectsClient = savedObjectsClient;
      const isInspectorEnabled = await coreContext.uiSettings.client.get(_common.enableInspectEsQueries);
      const uptimeEsClient = (0, _lib.createUptimeESClient)({
        request,
        savedObjectsClient,
        isInspectorEnabled,
        esClient: esClient.asCurrentUser
      });
      server.uptimeEsClient = uptimeEsClient;
      if ((isInspectorEnabled || server.isDev) && ((_server$config$servic = server.config.service) === null || _server$config$servic === void 0 ? void 0 : _server$config$servic.username) !== 'localKibanaIntegrationTestsUser') {
        _lib.inspectableEsQueriesMap.set(request, []);
      }
      const res = await uptimeRoute.handler({
        uptimeEsClient,
        savedObjectsClient,
        context,
        request,
        server,
        syntheticsMonitorClient,
        subject
      });
      return res;
    },
    handler: async (context, request, response) => {
      var _server$config$servic2;
      const coreContext = await context.core;
      const {
        client: esClient
      } = coreContext.elasticsearch;
      const savedObjectsClient = coreContext.savedObjects.getClient({
        includedHiddenTypes: [_service_api_key.syntheticsServiceApiKey.name]
      });

      // specifically needed for the synthetics service api key generation
      server.authSavedObjectsClient = savedObjectsClient;
      const isInspectorEnabled = await coreContext.uiSettings.client.get(_common.enableInspectEsQueries);
      const uptimeEsClient = (0, _lib.createUptimeESClient)({
        request,
        savedObjectsClient,
        isInspectorEnabled,
        esClient: esClient.asCurrentUser
      });
      server.uptimeEsClient = uptimeEsClient;
      if ((isInspectorEnabled || server.isDev) && ((_server$config$servic2 = server.config.service) === null || _server$config$servic2 === void 0 ? void 0 : _server$config$servic2.username) !== 'localKibanaIntegrationTestsUser') {
        _lib.inspectableEsQueriesMap.set(request, []);
      }
      const res = await uptimeRoute.handler({
        uptimeEsClient,
        savedObjectsClient,
        context,
        request,
        response,
        server,
        syntheticsMonitorClient
      });
      if (res instanceof _coreHttpRouterServerInternal.KibanaResponse) {
        return res;
      }
      return response.ok({
        body: {
          ...res,
          ...((isInspectorEnabled || server.isDev) && uptimeRoute.path !== _constants.API_URLS.DYNAMIC_SETTINGS ? {
            _inspect: _lib.inspectableEsQueriesMap.get(request)
          } : {})
        }
      });
    }
  };
};
exports.syntheticsRouteWrapper = syntheticsRouteWrapper;