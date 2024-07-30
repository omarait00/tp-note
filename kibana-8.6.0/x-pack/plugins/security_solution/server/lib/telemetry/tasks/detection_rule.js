"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTelemetryDetectionRuleListsTaskConfig = createTelemetryDetectionRuleListsTaskConfig;
var _constants = require("../constants");
var _helpers = require("../helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createTelemetryDetectionRuleListsTaskConfig(maxTelemetryBatch) {
  return {
    type: 'security:telemetry-detection-rules',
    title: 'Security Solution Detection Rule Lists Telemetry',
    interval: '24h',
    timeout: '10m',
    version: '1.0.0',
    runTask: async (taskId, logger, receiver, sender, taskExecutionPeriod) => {
      const startTime = Date.now();
      const taskName = 'Security Solution Detection Rule Lists Telemetry';
      try {
        const [clusterInfoPromise, licenseInfoPromise] = await Promise.allSettled([receiver.fetchClusterInfo(), receiver.fetchLicenseInfo()]);
        const clusterInfo = clusterInfoPromise.status === 'fulfilled' ? clusterInfoPromise.value : {};
        const licenseInfo = licenseInfoPromise.status === 'fulfilled' ? licenseInfoPromise.value : {};

        // Lists Telemetry: Detection Rules

        const {
          body: prebuiltRules
        } = await receiver.fetchDetectionRules();
        if (!prebuiltRules) {
          (0, _helpers.tlog)(logger, 'no prebuilt rules found');
          await sender.sendOnDemand(_constants.TASK_METRICS_CHANNEL, [(0, _helpers.createTaskMetric)(taskName, true, startTime)]);
          return 0;
        }
        const cacheArray = prebuiltRules.hits.hits.reduce((cache, searchHit) => {
          var _searchHit$_source;
          const rule = searchHit._source;
          const ruleId = rule.alert.params.ruleId;
          const shouldNotProcess = rule === null || rule === undefined || ruleId === null || ruleId === undefined || ((_searchHit$_source = searchHit._source) === null || _searchHit$_source === void 0 ? void 0 : _searchHit$_source.alert.params.exceptionsList.length) === 0;
          if (shouldNotProcess) {
            return cache;
          }
          cache.push(rule);
          return cache;
        }, []);
        const detectionRuleExceptions = [];
        for (const item of cacheArray) {
          const ruleVersion = item.alert.params.version;
          for (const ex of item.alert.params.exceptionsList) {
            const listItem = await receiver.fetchDetectionExceptionList(ex.list_id, ruleVersion);
            for (const exceptionItem of listItem.data) {
              detectionRuleExceptions.push(exceptionItem);
            }
          }
        }
        const detectionRuleExceptionsJson = (0, _helpers.templateExceptionList)(detectionRuleExceptions, clusterInfo, licenseInfo, _constants.LIST_DETECTION_RULE_EXCEPTION);
        (0, _helpers.tlog)(logger, `Detection rule exception json length ${detectionRuleExceptionsJson.length}`);
        const batches = (0, _helpers.batchTelemetryRecords)(detectionRuleExceptionsJson, maxTelemetryBatch);
        for (const batch of batches) {
          await sender.sendOnDemand(_constants.TELEMETRY_CHANNEL_LISTS, batch);
        }
        await sender.sendOnDemand(_constants.TASK_METRICS_CHANNEL, [(0, _helpers.createTaskMetric)(taskName, true, startTime)]);
        return detectionRuleExceptions.length;
      } catch (err) {
        await sender.sendOnDemand(_constants.TASK_METRICS_CHANNEL, [(0, _helpers.createTaskMetric)(taskName, false, startTime, err.message)]);
        return 0;
      }
    }
  };
}