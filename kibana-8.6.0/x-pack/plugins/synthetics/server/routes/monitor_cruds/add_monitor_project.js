"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addSyntheticsProjectMonitorRoute = exports.REQUEST_TOO_LARGE = void 0;
var _configSchema = require("@kbn/config-schema");
var _i18n = require("@kbn/i18n");
var _constants = require("../../../common/constants");
var _project_monitor_formatter = require("../../synthetics_service/project_monitor/project_monitor_formatter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MAX_PAYLOAD_SIZE = 1048576 * 20; // 20MiB

const addSyntheticsProjectMonitorRoute = () => ({
  method: 'PUT',
  path: _constants.API_URLS.SYNTHETICS_MONITORS_PROJECT_UPDATE,
  validate: {
    params: _configSchema.schema.object({
      projectName: _configSchema.schema.string()
    }),
    body: _configSchema.schema.object({
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
    response,
    savedObjectsClient,
    server,
    syntheticsMonitorClient
  }) => {
    var _request$body;
    const {
      projectName
    } = request.params;
    const decodedProjectName = decodeURI(projectName);
    const monitors = ((_request$body = request.body) === null || _request$body === void 0 ? void 0 : _request$body.monitors) || [];
    const spaceId = server.spaces.spacesService.getSpaceId(request);
    if (monitors.length > 250) {
      return response.badRequest({
        body: {
          message: REQUEST_TOO_LARGE
        }
      });
    }
    try {
      const encryptedSavedObjectsClient = server.encryptedSavedObjects.getClient();
      const pushMonitorFormatter = new _project_monitor_formatter.ProjectMonitorFormatter({
        projectId: decodedProjectName,
        spaceId,
        encryptedSavedObjectsClient,
        savedObjectsClient,
        monitors,
        server,
        syntheticsMonitorClient,
        request
      });
      await pushMonitorFormatter.configureAllProjectMonitors();
      return {
        createdMonitors: pushMonitorFormatter.createdMonitors,
        updatedMonitors: pushMonitorFormatter.updatedMonitors,
        failedMonitors: pushMonitorFormatter.failedMonitors
      };
    } catch (error) {
      server.logger.error(`Error adding monitors to project ${decodedProjectName}`);
      throw error;
    }
  }
});
exports.addSyntheticsProjectMonitorRoute = addSyntheticsProjectMonitorRoute;
const REQUEST_TOO_LARGE = _i18n.i18n.translate('xpack.synthetics.server.project.delete.toolarge', {
  defaultMessage: 'Delete request payload is too large. Please send a max of 250 monitors to delete per request'
});
exports.REQUEST_TOO_LARGE = REQUEST_TOO_LARGE;