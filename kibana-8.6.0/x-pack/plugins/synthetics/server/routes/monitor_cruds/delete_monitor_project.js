"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteSyntheticsMonitorProjectRoute = exports.REQUEST_TOO_LARGE = void 0;
var _configSchema = require("@kbn/config-schema");
var _i18n = require("@kbn/i18n");
var _runtime_types = require("../../../common/runtime_types");
var _constants = require("../../../common/constants");
var _synthetics_monitor = require("../../legacy_uptime/lib/saved_objects/synthetics_monitor");
var _common = require("../common");
var _project_monitor_formatter = require("../../synthetics_service/project_monitor/project_monitor_formatter");
var _delete_monitor_bulk = require("./bulk_cruds/delete_monitor_bulk");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const deleteSyntheticsMonitorProjectRoute = () => ({
  method: 'DELETE',
  path: _constants.API_URLS.SYNTHETICS_MONITORS_PROJECT_DELETE,
  validate: {
    body: _configSchema.schema.object({
      monitors: _configSchema.schema.arrayOf(_configSchema.schema.string())
    }),
    params: _configSchema.schema.object({
      projectName: _configSchema.schema.string()
    })
  },
  handler: async ({
    request,
    response,
    savedObjectsClient,
    server,
    syntheticsMonitorClient
  }) => {
    const {
      projectName
    } = request.params;
    const {
      monitors: monitorsToDelete
    } = request.body;
    const decodedProjectName = decodeURI(projectName);
    if (monitorsToDelete.length > 250) {
      return response.badRequest({
        body: {
          message: REQUEST_TOO_LARGE
        }
      });
    }
    const {
      saved_objects: monitors
    } = await (0, _common.getMonitors)({
      filter: `${_synthetics_monitor.syntheticsMonitorType}.attributes.${_runtime_types.ConfigKey.PROJECT_ID}: "${decodedProjectName}" AND ${(0, _common.getKqlFilter)({
        field: 'journey_id',
        values: monitorsToDelete.map(id => `${id}`)
      })}`,
      fields: [],
      perPage: 500
    }, syntheticsMonitorClient.syntheticsService, savedObjectsClient);
    const {
      integrations: {
        writeIntegrationPolicies
      }
    } = await server.fleet.authz.fromRequest(request);
    const hasPrivateMonitor = monitors.some(monitor => monitor.attributes.locations.some(location => !location.isServiceManaged));
    if (!writeIntegrationPolicies && hasPrivateMonitor) {
      return response.forbidden({
        body: {
          message: _project_monitor_formatter.INSUFFICIENT_FLEET_PERMISSIONS
        }
      });
    }
    await (0, _delete_monitor_bulk.deleteMonitorBulk)({
      monitors,
      server,
      savedObjectsClient,
      syntheticsMonitorClient,
      request
    });
    return {
      deleted_monitors: monitorsToDelete
    };
  }
});
exports.deleteSyntheticsMonitorProjectRoute = deleteSyntheticsMonitorProjectRoute;
const REQUEST_TOO_LARGE = _i18n.i18n.translate('xpack.synthetics.server.project.delete.toolarge', {
  defaultMessage: 'Delete request payload is too large. Please send a max of 250 monitors to delete per request'
});
exports.REQUEST_TOO_LARGE = REQUEST_TOO_LARGE;