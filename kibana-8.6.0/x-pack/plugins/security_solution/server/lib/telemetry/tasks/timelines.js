"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTelemetryTimelineTaskConfig = createTelemetryTimelineTaskConfig;
var _moment = _interopRequireDefault(require("moment"));
var _constants = require("../constants");
var _build_resolver_entity = require("../../../endpoint/routes/resolver/entity/utils/build_resolver_entity");
var _helpers = require("../helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createTelemetryTimelineTaskConfig() {
  return {
    type: 'security:telemetry-timelines',
    title: 'Security Solution Timeline telemetry',
    interval: '3h',
    timeout: '10m',
    version: '1.0.0',
    runTask: async (taskId, logger, receiver, sender, taskExecutionPeriod) => {
      const startTime = Date.now();
      const taskName = 'Security Solution Timeline telemetry';
      try {
        var _clusterInfo$version, _sender$getTelemetryU, _endpointAlerts$hits$, _endpointAlerts$hits$2;
        let counter = 0;
        (0, _helpers.tlog)(logger, `Running task: ${taskId}`);
        const [clusterInfoPromise, licenseInfoPromise] = await Promise.allSettled([receiver.fetchClusterInfo(), receiver.fetchLicenseInfo()]);
        const clusterInfo = clusterInfoPromise.status === 'fulfilled' ? clusterInfoPromise.value : {};
        const licenseInfo = licenseInfoPromise.status === 'fulfilled' ? licenseInfoPromise.value : {};
        const now = (0, _moment.default)();
        const startOfDay = now.startOf('day').toISOString();
        const endOfDay = now.endOf('day').toISOString();
        const baseDocument = {
          version: (_clusterInfo$version = clusterInfo.version) === null || _clusterInfo$version === void 0 ? void 0 : _clusterInfo$version.number,
          cluster_name: clusterInfo.cluster_name,
          cluster_uuid: clusterInfo.cluster_uuid,
          license_uuid: licenseInfo === null || licenseInfo === void 0 ? void 0 : licenseInfo.uid
        };

        // Fetch EP Alerts

        const endpointAlerts = await receiver.fetchTimelineEndpointAlerts(3);
        const aggregations = endpointAlerts === null || endpointAlerts === void 0 ? void 0 : endpointAlerts.aggregations;
        (0, _helpers.tlog)(logger, `Endpoint alert count: ${aggregations === null || aggregations === void 0 ? void 0 : aggregations.endpoint_alert_count}`);
        (_sender$getTelemetryU = sender.getTelemetryUsageCluster()) === null || _sender$getTelemetryU === void 0 ? void 0 : _sender$getTelemetryU.incrementCounter({
          counterName: 'telemetry_endpoint_alert',
          counterType: 'endpoint_alert_count',
          incrementBy: aggregations === null || aggregations === void 0 ? void 0 : aggregations.endpoint_alert_count.value
        });

        // No EP Alerts -> Nothing to do
        if (((_endpointAlerts$hits$ = endpointAlerts.hits.hits) === null || _endpointAlerts$hits$ === void 0 ? void 0 : _endpointAlerts$hits$.length) === 0 || ((_endpointAlerts$hits$2 = endpointAlerts.hits.hits) === null || _endpointAlerts$hits$2 === void 0 ? void 0 : _endpointAlerts$hits$2.length) === undefined) {
          (0, _helpers.tlog)(logger, 'no endpoint alerts received. exiting telemetry task.');
          await sender.sendOnDemand(_constants.TASK_METRICS_CHANNEL, [(0, _helpers.createTaskMetric)(taskName, true, startTime)]);
          return counter;
        }

        // Build process tree for each EP Alert recieved

        for (const alert of endpointAlerts.hits.hits) {
          var _sender$getTelemetryU2, _sender$getTelemetryU3;
          const eventId = alert._source ? alert._source['event.id'] : 'unknown';
          const alertUUID = alert._source ? alert._source['kibana.alert.uuid'] : 'unknown';
          const entities = (0, _build_resolver_entity.resolverEntity)([alert]);

          // Build Tree

          const tree = await receiver.buildProcessTree(entities[0].id, entities[0].schema, startOfDay, endOfDay);
          const nodeIds = [];
          if (Array.isArray(tree)) {
            for (const node of tree) {
              const nodeId = node === null || node === void 0 ? void 0 : node.id.toString();
              nodeIds.push(nodeId);
            }
          }
          (_sender$getTelemetryU2 = sender.getTelemetryUsageCluster()) === null || _sender$getTelemetryU2 === void 0 ? void 0 : _sender$getTelemetryU2.incrementCounter({
            counterName: 'telemetry_timeline',
            counterType: 'timeline_node_count',
            incrementBy: nodeIds.length
          });

          // Fetch event lineage

          const timelineEvents = await receiver.fetchTimelineEvents(nodeIds);
          (0, _helpers.tlog)(logger, `Timeline Events: ${JSON.stringify(timelineEvents)}`);
          const eventsStore = new Map();
          for (const event of timelineEvents.hits.hits) {
            const doc = event._source;
            if (doc !== null && doc !== undefined) {
              var _doc$process, _doc$process$entity_i;
              const entityId = doc === null || doc === void 0 ? void 0 : (_doc$process = doc.process) === null || _doc$process === void 0 ? void 0 : (_doc$process$entity_i = _doc$process.entity_id) === null || _doc$process$entity_i === void 0 ? void 0 : _doc$process$entity_i.toString();
              if (entityId !== null && entityId !== undefined) eventsStore.set(entityId, doc);
            }
          }
          (_sender$getTelemetryU3 = sender.getTelemetryUsageCluster()) === null || _sender$getTelemetryU3 === void 0 ? void 0 : _sender$getTelemetryU3.incrementCounter({
            counterName: 'telemetry_timeline',
            counterType: 'timeline_event_count',
            incrementBy: eventsStore.size
          });

          // Create telemetry record

          const telemetryTimeline = [];
          if (Array.isArray(tree)) {
            for (const node of tree) {
              const id = node.id.toString();
              const event = eventsStore.get(id);
              const timelineTelemetryEvent = {
                ...node,
                event
              };
              telemetryTimeline.push(timelineTelemetryEvent);
            }
          }
          if (telemetryTimeline.length >= 1) {
            const record = {
              '@timestamp': (0, _moment.default)().toISOString(),
              ...baseDocument,
              alert_id: alertUUID,
              event_id: eventId,
              timeline: telemetryTimeline
            };
            sender.sendOnDemand(_constants.TELEMETRY_CHANNEL_TIMELINE, [record]);
            counter += 1;
          } else {
            (0, _helpers.tlog)(logger, 'no events in timeline');
          }
        }
        (0, _helpers.tlog)(logger, `sent ${counter} timelines. concluding timeline task.`);
        await sender.sendOnDemand(_constants.TASK_METRICS_CHANNEL, [(0, _helpers.createTaskMetric)(taskName, true, startTime)]);
        return counter;
      } catch (err) {
        await sender.sendOnDemand(_constants.TASK_METRICS_CHANNEL, [(0, _helpers.createTaskMetric)(taskName, false, startTime, err.message)]);
        return 0;
      }
    }
  };
}