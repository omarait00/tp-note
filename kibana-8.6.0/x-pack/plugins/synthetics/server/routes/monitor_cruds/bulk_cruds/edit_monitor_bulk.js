"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syncEditedMonitorBulk = void 0;
var _runtime_types = require("../../../../common/runtime_types");
var _synthetics_monitor = require("../../../legacy_uptime/lib/saved_objects/synthetics_monitor");
var _monitor_upgrade_sender = require("../../telemetry/monitor_upgrade_sender");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// Simplify return promise type and type it with runtime_types

const syncEditedMonitorBulk = async ({
  server,
  request,
  spaceId,
  monitorsToUpdate,
  savedObjectsClient,
  privateLocations,
  syntheticsMonitorClient
}) => {
  let savedObjectsSuccessful = false;
  let syncSuccessful = false;
  try {
    async function updateSavedObjects() {
      try {
        const editedSOPromise = await savedObjectsClient.bulkUpdate(monitorsToUpdate.map(({
          previousMonitor,
          monitorWithRevision
        }) => ({
          type: _synthetics_monitor.syntheticsMonitorType,
          id: previousMonitor.id,
          attributes: {
            ...monitorWithRevision,
            [_runtime_types.ConfigKey.CONFIG_ID]: previousMonitor.id,
            [_runtime_types.ConfigKey.MONITOR_QUERY_ID]: monitorWithRevision[_runtime_types.ConfigKey.CUSTOM_HEARTBEAT_ID] || previousMonitor.id
          }
        })));
        savedObjectsSuccessful = true;
        return editedSOPromise;
      } catch (e) {
        savedObjectsSuccessful = false;
      }
    }
    async function syncUpdatedMonitors() {
      try {
        const editSyncPromise = await syntheticsMonitorClient.editMonitors(monitorsToUpdate.map(({
          normalizedMonitor,
          previousMonitor
        }) => ({
          monitor: {
            ...normalizedMonitor,
            [_runtime_types.ConfigKey.CONFIG_ID]: previousMonitor.id,
            [_runtime_types.ConfigKey.MONITOR_QUERY_ID]: normalizedMonitor[_runtime_types.ConfigKey.CUSTOM_HEARTBEAT_ID] || previousMonitor.id
          },
          id: previousMonitor.id,
          previousMonitor
        })), request, savedObjectsClient, privateLocations, spaceId);
        syncSuccessful = true;
        return editSyncPromise;
      } catch (e) {
        syncSuccessful = false;
      }
    }
    const [editedMonitorSavedObjects, errors] = await Promise.all([updateSavedObjects(), syncUpdatedMonitors()]);
    monitorsToUpdate.forEach(({
      normalizedMonitor,
      previousMonitor
    }) => {
      const editedMonitorSavedObject = editedMonitorSavedObjects === null || editedMonitorSavedObjects === void 0 ? void 0 : editedMonitorSavedObjects.saved_objects.find(obj => obj.id === previousMonitor.id);
      (0, _monitor_upgrade_sender.sendTelemetryEvents)(server.logger, server.telemetry, (0, _monitor_upgrade_sender.formatTelemetryUpdateEvent)(editedMonitorSavedObject, previousMonitor, server.stackVersion, Boolean(normalizedMonitor[_runtime_types.ConfigKey.SOURCE_INLINE]), errors));
    });
    return {
      errors,
      editedMonitors: editedMonitorSavedObjects === null || editedMonitorSavedObjects === void 0 ? void 0 : editedMonitorSavedObjects.saved_objects
    };
  } catch (e) {
    server.logger.error(`Unable to update Synthetics monitors `);
    if (!syncSuccessful && savedObjectsSuccessful) {
      await savedObjectsClient.bulkUpdate(monitorsToUpdate.map(({
        previousMonitor,
        decryptedPreviousMonitor
      }) => ({
        type: _synthetics_monitor.syntheticsMonitorType,
        id: previousMonitor.id,
        attributes: decryptedPreviousMonitor.attributes
      })));
    }
    throw e;
  }
};
exports.syncEditedMonitorBulk = syncEditedMonitorBulk;