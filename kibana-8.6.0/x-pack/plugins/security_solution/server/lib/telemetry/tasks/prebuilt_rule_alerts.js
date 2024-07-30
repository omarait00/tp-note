"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTelemetryPrebuiltRuleAlertsTaskConfig = createTelemetryPrebuiltRuleAlertsTaskConfig;
var _constants = require("../constants");
var _helpers = require("../helpers");
var _filterlists = require("../filterlists");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createTelemetryPrebuiltRuleAlertsTaskConfig(maxTelemetryBatch) {
  return {
    type: 'security:telemetry-prebuilt-rule-alerts',
    title: 'Security Solution - Prebuilt Rule and Elastic ML Alerts Telemetry',
    interval: '1h',
    timeout: '5m',
    version: '1.0.0',
    runTask: async (taskId, logger, receiver, sender, taskExecutionPeriod) => {
      const startTime = Date.now();
      const taskName = 'Security Solution - Prebuilt Rule and Elastic ML Alerts Telemetry';
      try {
        var _sender$getTelemetryU;
        const [clusterInfoPromise, licenseInfoPromise] = await Promise.allSettled([receiver.fetchClusterInfo(), receiver.fetchLicenseInfo()]);
        const clusterInfo = clusterInfoPromise.status === 'fulfilled' ? clusterInfoPromise.value : {};
        const licenseInfo = licenseInfoPromise.status === 'fulfilled' ? licenseInfoPromise.value : {};
        const {
          events: telemetryEvents,
          count: totalPrebuiltAlertCount
        } = await receiver.fetchPrebuiltRuleAlerts();
        (_sender$getTelemetryU = sender.getTelemetryUsageCluster()) === null || _sender$getTelemetryU === void 0 ? void 0 : _sender$getTelemetryU.incrementCounter({
          counterName: 'telemetry_prebuilt_rule_alerts',
          counterType: 'prebuilt_alert_count',
          incrementBy: totalPrebuiltAlertCount
        });
        if (telemetryEvents.length === 0) {
          (0, _helpers.tlog)(logger, 'no prebuilt rule alerts retrieved');
          await sender.sendOnDemand(_constants.TASK_METRICS_CHANNEL, [(0, _helpers.createTaskMetric)(taskName, true, startTime)]);
          return 0;
        }
        const processedAlerts = telemetryEvents.map(event => (0, _filterlists.copyAllowlistedFields)(_filterlists.filterList.prebuiltRulesAlerts, event));
        const enrichedAlerts = processedAlerts.map(event => ({
          ...event,
          licence_id: licenseInfo === null || licenseInfo === void 0 ? void 0 : licenseInfo.uid,
          cluster_uuid: clusterInfo === null || clusterInfo === void 0 ? void 0 : clusterInfo.cluster_uuid,
          cluster_name: clusterInfo === null || clusterInfo === void 0 ? void 0 : clusterInfo.cluster_name
        }));
        (0, _helpers.tlog)(logger, `sending ${enrichedAlerts.length} elastic prebuilt alerts`);
        const batches = (0, _helpers.batchTelemetryRecords)(enrichedAlerts, maxTelemetryBatch);
        for (const batch of batches) {
          await sender.sendOnDemand(_constants.TELEMETRY_CHANNEL_DETECTION_ALERTS, batch);
        }
        await sender.sendOnDemand(_constants.TASK_METRICS_CHANNEL, [(0, _helpers.createTaskMetric)(taskName, true, startTime)]);
        return enrichedAlerts.length;
      } catch (err) {
        logger.error('could not complete prebuilt alerts telemetry task');
        await sender.sendOnDemand(_constants.TASK_METRICS_CHANNEL, [(0, _helpers.createTaskMetric)(taskName, false, startTime, err.message)]);
        return 0;
      }
    }
  };
}