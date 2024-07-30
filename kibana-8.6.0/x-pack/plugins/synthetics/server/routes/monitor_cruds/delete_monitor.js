"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteSyntheticsMonitorRoute = exports.deleteMonitor = void 0;
var _configSchema = require("@kbn/config-schema");
var _server = require("../../../../../../src/core/server");
var _runtime_types = require("../../../common/runtime_types");
var _constants = require("../../../common/constants");
var _synthetics_monitor = require("../../legacy_uptime/lib/saved_objects/synthetics_monitor");
var _service_errors = require("../synthetics_service/service_errors");
var _monitor_upgrade_sender = require("../telemetry/monitor_upgrade_sender");
var _secrets = require("../../synthetics_service/utils/secrets");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const deleteSyntheticsMonitorRoute = () => ({
  method: 'DELETE',
  path: _constants.API_URLS.SYNTHETICS_MONITORS + '/{monitorId}',
  validate: {
    params: _configSchema.schema.object({
      monitorId: _configSchema.schema.string({
        minLength: 1,
        maxLength: 1024
      })
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
      monitorId
    } = request.params;
    try {
      const errors = await deleteMonitor({
        savedObjectsClient,
        server,
        monitorId,
        syntheticsMonitorClient,
        request
      });
      if (errors && errors.length > 0) {
        return response.ok({
          body: {
            message: 'error pushing monitor to the service',
            attributes: {
              errors
            }
          }
        });
      }
      return monitorId;
    } catch (getErr) {
      if (_server.SavedObjectsErrorHelpers.isNotFoundError(getErr)) {
        return (0, _service_errors.getMonitorNotFoundResponse)(response, monitorId);
      }
      throw getErr;
    }
  }
});
exports.deleteSyntheticsMonitorRoute = deleteSyntheticsMonitorRoute;
const deleteMonitor = async ({
  savedObjectsClient,
  server,
  monitorId,
  syntheticsMonitorClient,
  request
}) => {
  const {
    logger,
    telemetry,
    stackVersion,
    encryptedSavedObjects
  } = server;
  const spaceId = server.spaces.spacesService.getSpaceId(request);
  const encryptedSavedObjectsClient = encryptedSavedObjects.getClient();
  let normalizedMonitor;
  try {
    var _encryptedMonitor$nam;
    const encryptedMonitor = await savedObjectsClient.get(_synthetics_monitor.syntheticsMonitorType, monitorId);
    const monitor = await encryptedSavedObjectsClient.getDecryptedAsInternalUser(_synthetics_monitor.syntheticsMonitorType, monitorId, {
      namespace: (_encryptedMonitor$nam = encryptedMonitor.namespaces) === null || _encryptedMonitor$nam === void 0 ? void 0 : _encryptedMonitor$nam[0]
    });
    normalizedMonitor = (0, _secrets.normalizeSecrets)(monitor);
    const deleteSyncPromise = syntheticsMonitorClient.deleteMonitors([{
      ...normalizedMonitor.attributes,
      id: normalizedMonitor.attributes[_runtime_types.ConfigKey.MONITOR_QUERY_ID]
    }], request, savedObjectsClient, spaceId);
    const deletePromise = savedObjectsClient.delete(_synthetics_monitor.syntheticsMonitorType, monitorId);
    const [errors] = await Promise.all([deleteSyncPromise, deletePromise]);
    (0, _monitor_upgrade_sender.sendTelemetryEvents)(logger, telemetry, (0, _monitor_upgrade_sender.formatTelemetryDeleteEvent)(monitor, stackVersion, new Date().toISOString(), Boolean(normalizedMonitor.attributes[_runtime_types.ConfigKey.SOURCE_INLINE]), errors));
    return errors;
  } catch (e) {
    if (normalizedMonitor) {
      await restoreDeletedMonitor({
        monitorId,
        normalizedMonitor: (0, _secrets.formatSecrets)({
          ...normalizedMonitor.attributes
        }),
        savedObjectsClient
      });
    }
    throw e;
  }
};
exports.deleteMonitor = deleteMonitor;
const restoreDeletedMonitor = async ({
  monitorId,
  savedObjectsClient,
  normalizedMonitor
}) => {
  try {
    await savedObjectsClient.get(_synthetics_monitor.syntheticsMonitorType, monitorId);
  } catch (e) {
    if (_server.SavedObjectsErrorHelpers.isNotFoundError(e)) {
      await savedObjectsClient.create(_synthetics_monitor.syntheticsMonitorType, normalizedMonitor, {
        id: monitorId,
        overwrite: true
      });
    }
  }
};