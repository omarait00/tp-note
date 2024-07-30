"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGetStatusBarRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _constants = require("../../../../common/constants");
var _runtime_types = require("../../../../common/runtime_types");
var _saved_objects = require("../../../../common/types/saved_objects");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createGetStatusBarRoute = libs => ({
  method: 'GET',
  path: _constants.API_URLS.MONITOR_STATUS,
  validate: {
    query: _configSchema.schema.object({
      monitorId: _configSchema.schema.string(),
      dateStart: _configSchema.schema.string(),
      dateEnd: _configSchema.schema.string()
    })
  },
  handler: async ({
    uptimeEsClient,
    request,
    server,
    savedObjectsClient
  }) => {
    const {
      monitorId,
      dateStart,
      dateEnd
    } = request.query;
    const latestMonitor = await libs.requests.getLatestMonitor({
      uptimeEsClient,
      monitorId,
      dateStart,
      dateEnd
    });
    if (latestMonitor.docId) {
      return latestMonitor;
    }
    if (!server.savedObjectsClient) {
      return null;
    }
    try {
      const {
        saved_objects: [monitorSavedObject]
      } = await savedObjectsClient.find({
        type: _saved_objects.syntheticsMonitorType,
        perPage: 1,
        page: 1,
        filter: `${_saved_objects.syntheticsMonitorType}.attributes.${_runtime_types.ConfigKey.MONITOR_QUERY_ID}: "${monitorId}"`
      });
      if (!monitorSavedObject) {
        return null;
      }
      const {
        [_runtime_types.ConfigKey.URLS]: url,
        [_runtime_types.ConfigKey.NAME]: name,
        [_runtime_types.ConfigKey.HOSTS]: host,
        [_runtime_types.ConfigKey.MONITOR_TYPE]: type
      } = monitorSavedObject.attributes;
      return {
        url: {
          full: url || host
        },
        monitor: {
          name,
          type,
          id: monitorSavedObject.id
        }
      };
    } catch (e) {
      server.logger.error(e);
    }
  }
});
exports.createGetStatusBarRoute = createGetStatusBarRoute;