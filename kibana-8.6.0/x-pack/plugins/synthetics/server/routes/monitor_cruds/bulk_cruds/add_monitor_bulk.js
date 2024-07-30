"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syncNewMonitorBulk = exports.createNewSavedObjectMonitorBulk = void 0;
var _pMap = _interopRequireDefault(require("p-map"));
var _uuid = require("uuid");
var _monitor_upgrade_sender = require("../../telemetry/monitor_upgrade_sender");
var _delete_monitor = require("../delete_monitor");
var _utils = require("../../../synthetics_service/utils");
var _saved_objects = require("../../../../common/types/saved_objects");
var _runtime_types = require("../../../../common/runtime_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createNewSavedObjectMonitorBulk = async ({
  soClient,
  monitorsToCreate
}) => {
  const newMonitors = monitorsToCreate.map(({
    id,
    monitor
  }) => ({
    id,
    type: _saved_objects.syntheticsMonitorType,
    attributes: (0, _utils.formatSecrets)({
      ...monitor,
      [_runtime_types.ConfigKey.MONITOR_QUERY_ID]: monitor[_runtime_types.ConfigKey.CUSTOM_HEARTBEAT_ID] || id,
      [_runtime_types.ConfigKey.CONFIG_ID]: id,
      revision: 1
    })
  }));
  return await soClient.bulkCreate(newMonitors);
};
exports.createNewSavedObjectMonitorBulk = createNewSavedObjectMonitorBulk;
const syncNewMonitorBulk = async ({
  normalizedMonitors,
  server,
  syntheticsMonitorClient,
  soClient,
  request,
  privateLocations,
  spaceId
}) => {
  let newMonitors = null;
  const monitorsToCreate = normalizedMonitors.map(monitor => {
    const monitorSavedObjectId = (0, _uuid.v4)();
    return {
      id: monitorSavedObjectId,
      monitor: {
        ...monitor,
        [_runtime_types.ConfigKey.CONFIG_ID]: monitorSavedObjectId,
        [_runtime_types.ConfigKey.MONITOR_QUERY_ID]: monitor[_runtime_types.ConfigKey.CUSTOM_HEARTBEAT_ID] || monitorSavedObjectId
      }
    };
  });
  try {
    const [createdMonitors, {
      syncErrors
    }] = await Promise.all([createNewSavedObjectMonitorBulk({
      monitorsToCreate,
      soClient
    }), syntheticsMonitorClient.addMonitors(monitorsToCreate, request, soClient, privateLocations, spaceId)]);
    newMonitors = createdMonitors;
    sendNewMonitorTelemetry(server, newMonitors.saved_objects, syncErrors);
    return {
      errors: syncErrors,
      newMonitors: newMonitors.saved_objects
    };
  } catch (e) {
    await rollBackNewMonitorBulk(monitorsToCreate, server, soClient, syntheticsMonitorClient, request);
    throw e;
  }
};
exports.syncNewMonitorBulk = syncNewMonitorBulk;
const rollBackNewMonitorBulk = async (monitorsToCreate, server, soClient, syntheticsMonitorClient, request) => {
  try {
    await (0, _pMap.default)(monitorsToCreate, async monitor => (0, _delete_monitor.deleteMonitor)({
      server,
      request,
      savedObjectsClient: soClient,
      monitorId: monitor.id,
      syntheticsMonitorClient
    }), {
      concurrency: 100
    });
  } catch (e) {
    // ignore errors here
    server.logger.error(e);
  }
};
const sendNewMonitorTelemetry = (server, monitors, errors) => {
  for (const monitor of monitors) {
    (0, _monitor_upgrade_sender.sendTelemetryEvents)(server.logger, server.telemetry, (0, _monitor_upgrade_sender.formatTelemetryEvent)({
      errors,
      monitor,
      isInlineScript: Boolean(monitor.attributes[_runtime_types.ConfigKey.SOURCE_INLINE]),
      stackVersion: server.stackVersion
    }));
  }
};