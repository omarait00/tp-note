"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatTelemetryDeleteEvent = formatTelemetryDeleteEvent;
exports.formatTelemetryEvent = formatTelemetryEvent;
exports.formatTelemetryUpdateEvent = formatTelemetryUpdateEvent;
exports.sendErrorTelemetryEvents = sendErrorTelemetryEvents;
exports.sendTelemetryEvents = sendTelemetryEvents;
var _jsSha = require("js-sha256");
var _schedule_to_time = require("../../../common/lib/schedule_to_time");
var _runtime_types = require("../../../common/runtime_types");
var _constants = require("../../legacy_uptime/lib/telemetry/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function sendTelemetryEvents(logger, eventsTelemetry, updateEvent) {
  if (eventsTelemetry === undefined) {
    return;
  }
  try {
    eventsTelemetry.queueTelemetryEvents(_constants.MONITOR_UPDATE_CHANNEL, [updateEvent]);
    eventsTelemetry.queueTelemetryEvents(_constants.MONITOR_CURRENT_CHANNEL, [updateEvent]);
  } catch (exc) {
    logger.error(`queuing telemetry events failed ${exc}`);
  }
}
function sendErrorTelemetryEvents(logger, eventsTelemetry, updateEvent) {
  if (eventsTelemetry === undefined) {
    return;
  }
  try {
    eventsTelemetry.queueTelemetryEvents(_constants.MONITOR_ERROR_EVENTS_CHANNEL, [updateEvent]);
  } catch (exc) {
    logger.error(`queuing telemetry events failed ${exc}`);
  }
}
function formatTelemetryEvent({
  monitor,
  stackVersion,
  isInlineScript,
  lastUpdatedAt,
  durationSinceLastUpdated,
  deletedAt,
  errors
}) {
  const {
    attributes
  } = monitor;
  return {
    stackVersion,
    updatedAt: deletedAt || monitor.updated_at,
    lastUpdatedAt,
    durationSinceLastUpdated,
    deletedAt,
    type: attributes[_runtime_types.ConfigKey.MONITOR_TYPE],
    locations: attributes[_runtime_types.ConfigKey.LOCATIONS].map(location => location.isServiceManaged ? location.id : 'other'),
    // mark self-managed locations as other
    locationsCount: attributes[_runtime_types.ConfigKey.LOCATIONS].length,
    monitorNameLength: attributes[_runtime_types.ConfigKey.NAME].length,
    monitorInterval: (0, _schedule_to_time.scheduleToMilli)(attributes[_runtime_types.ConfigKey.SCHEDULE]),
    scriptType: getScriptType(attributes, isInlineScript),
    errors: errors && errors !== null && errors !== void 0 && errors.length ? errors.map(e => {
      var _e$error, _e$error2;
      return {
        locationId: e.locationId,
        error: {
          // don't expose failed_monitors on error object
          status: (_e$error = e.error) === null || _e$error === void 0 ? void 0 : _e$error.status,
          reason: (_e$error2 = e.error) === null || _e$error2 === void 0 ? void 0 : _e$error2.reason
        }
      };
    }) : undefined,
    configId: _jsSha.sha256.create().update(monitor.id).hex(),
    revision: attributes[_runtime_types.ConfigKey.REVISION]
  };
}
function formatTelemetryUpdateEvent(currentMonitor, previousMonitor, stackVersion, isInlineScript, errors) {
  let durationSinceLastUpdated = 0;
  if (currentMonitor.updated_at && previousMonitor.updated_at) {
    durationSinceLastUpdated = new Date(currentMonitor.updated_at).getTime() - new Date(previousMonitor.updated_at).getTime();
  }
  return formatTelemetryEvent({
    stackVersion,
    monitor: currentMonitor,
    durationSinceLastUpdated,
    lastUpdatedAt: previousMonitor.updated_at,
    isInlineScript,
    errors
  });
}
function formatTelemetryDeleteEvent(previousMonitor, stackVersion, deletedAt, isInlineScript, errors) {
  let durationSinceLastUpdated = 0;
  if (deletedAt && previousMonitor.updated_at) {
    durationSinceLastUpdated = new Date(deletedAt).getTime() - new Date(previousMonitor.updated_at).getTime();
  }
  return formatTelemetryEvent({
    stackVersion,
    monitor: previousMonitor,
    durationSinceLastUpdated,
    lastUpdatedAt: previousMonitor.updated_at,
    deletedAt,
    isInlineScript,
    errors
  });
}
function getScriptType(attributes, isInlineScript) {
  var _attributes$ConfigKey, _attributes$ConfigKey2;
  switch (true) {
    case Boolean(attributes[_runtime_types.ConfigKey.SOURCE_ZIP_URL]):
      return 'zip';
    case Boolean(isInlineScript && ((_attributes$ConfigKey = attributes[_runtime_types.ConfigKey.METADATA]) === null || _attributes$ConfigKey === void 0 ? void 0 : (_attributes$ConfigKey2 = _attributes$ConfigKey.script_source) === null || _attributes$ConfigKey2 === void 0 ? void 0 : _attributes$ConfigKey2.is_generated_script)):
      return 'recorder';
    case Boolean(isInlineScript):
      return 'inline';
    case attributes[_runtime_types.ConfigKey.MONITOR_SOURCE_TYPE] === _runtime_types.SourceType.PROJECT:
      return 'project';
    default:
      return undefined;
  }
}