"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addSyntheticsProjectMonitorRouteLegacy = void 0;
var _configSchema = require("@kbn/config-schema");
var _constants = require("../../../common/constants");
var _get_all_locations = require("../../synthetics_service/get_all_locations");
var _project_monitor_formatter_legacy = require("../../synthetics_service/project_monitor/project_monitor_formatter_legacy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MAX_PAYLOAD_SIZE = 1048576 * 20; // 20MiB

const addSyntheticsProjectMonitorRouteLegacy = libs => ({
  method: 'PUT',
  path: _constants.API_URLS.SYNTHETICS_MONITORS_PROJECT_LEGACY,
  validate: {
    body: _configSchema.schema.object({
      project: _configSchema.schema.string(),
      keep_stale: _configSchema.schema.boolean(),
      monitors: _configSchema.schema.arrayOf(_configSchema.schema.any())
    })
  },
  options: {
    body: {
      maxBytes: MAX_PAYLOAD_SIZE
    }
  },
  handler: async ({
    request,
    savedObjectsClient,
    server,
    syntheticsMonitorClient,
    subject
  }) => {
    try {
      var _request$body;
      const monitors = ((_request$body = request.body) === null || _request$body === void 0 ? void 0 : _request$body.monitors) || [];
      const spaceId = server.spaces.spacesService.getSpaceId(request);
      const {
        keep_stale: keepStale,
        project: projectId
      } = request.body || {};
      const {
        publicLocations,
        privateLocations
      } = await (0, _get_all_locations.getAllLocations)(server, syntheticsMonitorClient, savedObjectsClient);
      const encryptedSavedObjectsClient = server.encryptedSavedObjects.getClient();
      const pushMonitorFormatter = new _project_monitor_formatter_legacy.ProjectMonitorFormatterLegacy({
        projectId,
        spaceId,
        keepStale,
        locations: publicLocations,
        privateLocations,
        encryptedSavedObjectsClient,
        savedObjectsClient,
        monitors,
        server,
        syntheticsMonitorClient,
        request,
        subject
      });
      await pushMonitorFormatter.configureAllProjectMonitors();
      subject === null || subject === void 0 ? void 0 : subject.next({
        createdMonitors: pushMonitorFormatter.createdMonitors,
        updatedMonitors: pushMonitorFormatter.updatedMonitors,
        staleMonitors: pushMonitorFormatter.staleMonitors,
        deletedMonitors: pushMonitorFormatter.deletedMonitors,
        failedMonitors: pushMonitorFormatter.failedMonitors,
        failedStaleMonitors: pushMonitorFormatter.failedStaleMonitors
      });
    } catch (error) {
      subject === null || subject === void 0 ? void 0 : subject.error(error);
    } finally {
      subject === null || subject === void 0 ? void 0 : subject.complete();
    }
  }
});
exports.addSyntheticsProjectMonitorRouteLegacy = addSyntheticsProjectMonitorRouteLegacy;