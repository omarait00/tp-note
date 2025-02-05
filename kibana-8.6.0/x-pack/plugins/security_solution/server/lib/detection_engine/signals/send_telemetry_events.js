"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enrichEndpointAlertsSignalID = enrichEndpointAlertsSignalID;
exports.selectEvents = selectEvents;
exports.sendAlertTelemetryEvents = sendAlertTelemetryEvents;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function selectEvents(filteredEvents) {
  // @ts-expect-error @elastic/elasticsearch _source is optional
  const sources = filteredEvents.map(function (obj) {
    return obj._source;
  });

  // Filter out non-endpoint alerts
  return sources.filter(obj => {
    var _obj$data_stream;
    return ((_obj$data_stream = obj.data_stream) === null || _obj$data_stream === void 0 ? void 0 : _obj$data_stream.dataset) === 'endpoint.alerts';
  });
}
function enrichEndpointAlertsSignalID(events, signalIdMap) {
  return events.map(function (obj) {
    var _obj$event;
    obj.signal_id = undefined;
    if ((obj === null || obj === void 0 ? void 0 : (_obj$event = obj.event) === null || _obj$event === void 0 ? void 0 : _obj$event.id) !== undefined) {
      obj.signal_id = signalIdMap.get(obj.event.id);
    }
    return obj;
  });
}
function sendAlertTelemetryEvents(filteredEvents, createdEvents, eventsTelemetry, ruleExecutionLogger) {
  if (eventsTelemetry === undefined) {
    return;
  }
  let selectedEvents = selectEvents(filteredEvents);
  if (selectedEvents.length > 0) {
    // Create map of ancenstor_id -> alert_id
    let signalIdMap = new Map();
    /* eslint-disable no-param-reassign */
    signalIdMap = createdEvents.reduce((signalMap, obj) => {
      var _obj$kibanaAlertOri, _obj$_id;
      const ancestorId = (_obj$kibanaAlertOri = obj['kibana.alert.original_event.id']) === null || _obj$kibanaAlertOri === void 0 ? void 0 : _obj$kibanaAlertOri.toString();
      const alertId = (_obj$_id = obj._id) === null || _obj$_id === void 0 ? void 0 : _obj$_id.toString();
      if (ancestorId !== null && ancestorId !== undefined && alertId !== undefined) {
        signalMap = signalIdMap.set(ancestorId, alertId);
      }
      return signalMap;
    }, new Map());
    selectedEvents = enrichEndpointAlertsSignalID(selectedEvents, signalIdMap);
  }
  try {
    eventsTelemetry.queueTelemetryEvents(selectedEvents);
  } catch (exc) {
    ruleExecutionLogger.error(`[-] queing telemetry events failed ${exc}`);
  }
}