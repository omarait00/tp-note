"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteMonitorBulk = void 0;
var _monitor_upgrade_sender = require("../../telemetry/monitor_upgrade_sender");
var _runtime_types = require("../../../../common/runtime_types");
var _saved_objects = require("../../../../common/types/saved_objects");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const deleteMonitorBulk = async ({
  savedObjectsClient,
  server,
  monitors,
  syntheticsMonitorClient,
  request
}) => {
  const {
    logger,
    telemetry,
    stackVersion
  } = server;
  const spaceId = server.spaces.spacesService.getSpaceId(request);
  try {
    const deleteSyncPromise = syntheticsMonitorClient.deleteMonitors(monitors.map(normalizedMonitor => ({
      ...normalizedMonitor.attributes,
      id: normalizedMonitor.attributes[_runtime_types.ConfigKey.MONITOR_QUERY_ID]
    })), request, savedObjectsClient, spaceId);
    const deletePromises = savedObjectsClient.bulkDelete(monitors.map(monitor => ({
      type: _saved_objects.syntheticsMonitorType,
      id: monitor.id
    })));
    const [errors] = await Promise.all([deleteSyncPromise, deletePromises]);
    monitors.forEach(monitor => {
      (0, _monitor_upgrade_sender.sendTelemetryEvents)(logger, telemetry, (0, _monitor_upgrade_sender.formatTelemetryDeleteEvent)(monitor, stackVersion, new Date().toISOString(), Boolean(monitor.attributes[_runtime_types.ConfigKey.SOURCE_INLINE]), errors));
    });
    return errors;
  } catch (e) {
    throw e;
  }
};
exports.deleteMonitorBulk = deleteMonitorBulk;