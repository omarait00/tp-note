"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syncEditedMonitor = exports.editSyntheticsMonitorRoute = void 0;
var _lodash = require("lodash");
var _configSchema = require("@kbn/config-schema");
var _server = require("../../../../../../src/core/server");
var _private_locations = require("../../legacy_uptime/lib/saved_objects/private_locations");
var _runtime_types = require("../../../common/runtime_types");
var _constants = require("../../../common/constants");
var _synthetics_monitor = require("../../legacy_uptime/lib/saved_objects/synthetics_monitor");
var _monitor_validation = require("./monitor_validation");
var _service_errors = require("../synthetics_service/service_errors");
var _monitor_upgrade_sender = require("../telemetry/monitor_upgrade_sender");
var _secrets = require("../../synthetics_service/utils/secrets");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// Simplify return promise type and type it with runtime_types
const editSyntheticsMonitorRoute = () => ({
  method: 'PUT',
  path: _constants.API_URLS.SYNTHETICS_MONITORS + '/{monitorId}',
  validate: {
    params: _configSchema.schema.object({
      monitorId: _configSchema.schema.string()
    }),
    body: _configSchema.schema.any()
  },
  handler: async ({
    request,
    response,
    savedObjectsClient,
    server,
    syntheticsMonitorClient
  }) => {
    const {
      encryptedSavedObjects,
      logger
    } = server;
    const encryptedSavedObjectsClient = encryptedSavedObjects.getClient();
    const monitor = request.body;
    const {
      monitorId
    } = request.params;
    const spaceId = server.spaces.spacesService.getSpaceId(request);
    try {
      var _previousMonitor$name;
      const previousMonitor = await savedObjectsClient.get(_synthetics_monitor.syntheticsMonitorType, monitorId);

      /* Decrypting the previous monitor before editing ensures that all existing fields remain
       * on the object, even in flows where decryption does not take place, such as the enabled tab
       * on the monitor list table. We do not decrypt monitors in bulk for the monitor list table */
      const decryptedPreviousMonitor = await encryptedSavedObjectsClient.getDecryptedAsInternalUser(_synthetics_monitor.syntheticsMonitorType, monitorId, {
        namespace: (_previousMonitor$name = previousMonitor.namespaces) === null || _previousMonitor$name === void 0 ? void 0 : _previousMonitor$name[0]
      });
      const normalizedPreviousMonitor = (0, _secrets.normalizeSecrets)(decryptedPreviousMonitor).attributes;
      const editedMonitor = (0, _lodash.mergeWith)(normalizedPreviousMonitor, monitor, customizer);
      const validationResult = (0, _monitor_validation.validateMonitor)(editedMonitor);
      if (!validationResult.valid || !validationResult.decodedMonitor) {
        const {
          reason: message,
          details,
          payload
        } = validationResult;
        return response.badRequest({
          body: {
            message,
            attributes: {
              details,
              ...payload
            }
          }
        });
      }
      const monitorWithRevision = {
        ...validationResult.decodedMonitor,
        /* reset config hash to empty string. Ensures that the synthetics agent is able
         * to update project monitors on when next pushed after they are edited via the UI,
         * through the enable/disable monitor toggle */
        [_runtime_types.ConfigKey.CONFIG_HASH]: '',
        revision: (previousMonitor.attributes[_runtime_types.ConfigKey.REVISION] || 0) + 1
      };
      const {
        errors,
        editedMonitor: editedMonitorSavedObject
      } = await syncEditedMonitor({
        server,
        previousMonitor,
        decryptedPreviousMonitor,
        syntheticsMonitorClient,
        savedObjectsClient,
        request,
        normalizedMonitor: monitorWithRevision,
        spaceId
      });

      // Return service sync errors in OK response
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
      return editedMonitorSavedObject;
    } catch (updateErr) {
      if (_server.SavedObjectsErrorHelpers.isNotFoundError(updateErr)) {
        return (0, _service_errors.getMonitorNotFoundResponse)(response, monitorId);
      }
      logger.error(updateErr);
      throw updateErr;
    }
  }
});
exports.editSyntheticsMonitorRoute = editSyntheticsMonitorRoute;
const syncEditedMonitor = async ({
  normalizedMonitor,
  previousMonitor,
  decryptedPreviousMonitor,
  server,
  syntheticsMonitorClient,
  savedObjectsClient,
  request,
  spaceId
}) => {
  try {
    const monitorWithId = {
      ...normalizedMonitor,
      [_runtime_types.ConfigKey.MONITOR_QUERY_ID]: normalizedMonitor[_runtime_types.ConfigKey.CUSTOM_HEARTBEAT_ID] || previousMonitor.id,
      [_runtime_types.ConfigKey.CONFIG_ID]: previousMonitor.id
    };
    const formattedMonitor = (0, _secrets.formatSecrets)(monitorWithId);
    const editedSOPromise = savedObjectsClient.update(_synthetics_monitor.syntheticsMonitorType, previousMonitor.id, formattedMonitor);
    const allPrivateLocations = await (0, _private_locations.getSyntheticsPrivateLocations)(savedObjectsClient);
    const editSyncPromise = syntheticsMonitorClient.editMonitors([{
      monitor: monitorWithId,
      id: previousMonitor.id,
      previousMonitor
    }], request, savedObjectsClient, allPrivateLocations, spaceId);
    const [editedMonitorSavedObject, errors] = await Promise.all([editedSOPromise, editSyncPromise]);
    (0, _monitor_upgrade_sender.sendTelemetryEvents)(server.logger, server.telemetry, (0, _monitor_upgrade_sender.formatTelemetryUpdateEvent)(editedMonitorSavedObject, previousMonitor, server.stackVersion, Boolean(normalizedMonitor[_runtime_types.ConfigKey.SOURCE_INLINE]), errors));
    return {
      errors,
      editedMonitor: editedMonitorSavedObject
    };
  } catch (e) {
    server.logger.error(`Unable to update Synthetics monitor ${decryptedPreviousMonitor.attributes[_runtime_types.ConfigKey.NAME]}`);
    await savedObjectsClient.update(_synthetics_monitor.syntheticsMonitorType, previousMonitor.id, decryptedPreviousMonitor.attributes);
    throw e;
  }
};

// Ensure that METADATA is merged deeply, to protect AAD and prevent decryption errors
exports.syncEditedMonitor = syncEditedMonitor;
const customizer = (_, srcValue, key) => {
  if (key !== _runtime_types.ConfigKey.METADATA) {
    return srcValue;
  }
};