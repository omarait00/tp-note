"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTelemetrySecurityListTaskConfig = createTelemetrySecurityListTaskConfig;
var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");
var _constants = require("../constants");
var _helpers = require("../helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createTelemetrySecurityListTaskConfig(maxTelemetryBatch) {
  return {
    type: 'security:telemetry-lists',
    title: 'Security Solution Lists Telemetry',
    interval: '24h',
    timeout: '3m',
    version: '1.0.0',
    runTask: async (taskId, logger, receiver, sender, taskExecutionPeriod) => {
      const startTime = Date.now();
      const taskName = 'Security Solution Lists Telemetry';
      try {
        let count = 0;
        const [clusterInfoPromise, licenseInfoPromise] = await Promise.allSettled([receiver.fetchClusterInfo(), receiver.fetchLicenseInfo()]);
        const clusterInfo = clusterInfoPromise.status === 'fulfilled' ? clusterInfoPromise.value : {};
        const licenseInfo = licenseInfoPromise.status === 'fulfilled' ? licenseInfoPromise.value : {};
        const FETCH_VALUE_LIST_META_DATA_INTERVAL_IN_HOURS = 24;

        // Lists Telemetry: Trusted Applications
        const trustedApps = await receiver.fetchTrustedApplications();
        if (trustedApps !== null && trustedApps !== void 0 && trustedApps.data) {
          const trustedAppsJson = (0, _helpers.templateExceptionList)(trustedApps.data, clusterInfo, licenseInfo, _constants.LIST_TRUSTED_APPLICATION);
          (0, _helpers.tlog)(logger, `Trusted Apps: ${trustedAppsJson}`);
          count += trustedAppsJson.length;
          const batches = (0, _helpers.batchTelemetryRecords)(trustedAppsJson, maxTelemetryBatch);
          for (const batch of batches) {
            await sender.sendOnDemand(_constants.TELEMETRY_CHANNEL_LISTS, batch);
          }
        }

        // Lists Telemetry: Endpoint Exceptions

        const epExceptions = await receiver.fetchEndpointList(_securitysolutionListConstants.ENDPOINT_LIST_ID);
        if (epExceptions !== null && epExceptions !== void 0 && epExceptions.data) {
          const epExceptionsJson = (0, _helpers.templateExceptionList)(epExceptions.data, clusterInfo, licenseInfo, _constants.LIST_ENDPOINT_EXCEPTION);
          (0, _helpers.tlog)(logger, `EP Exceptions: ${epExceptionsJson}`);
          count += epExceptionsJson.length;
          const batches = (0, _helpers.batchTelemetryRecords)(epExceptionsJson, maxTelemetryBatch);
          for (const batch of batches) {
            await sender.sendOnDemand(_constants.TELEMETRY_CHANNEL_LISTS, batch);
          }
        }

        // Lists Telemetry: Endpoint Event Filters

        const epFilters = await receiver.fetchEndpointList(_securitysolutionListConstants.ENDPOINT_EVENT_FILTERS_LIST_ID);
        if (epFilters !== null && epFilters !== void 0 && epFilters.data) {
          const epFiltersJson = (0, _helpers.templateExceptionList)(epFilters.data, clusterInfo, licenseInfo, _constants.LIST_ENDPOINT_EVENT_FILTER);
          (0, _helpers.tlog)(logger, `EP Event Filters: ${epFiltersJson}`);
          count += epFiltersJson.length;
          const batches = (0, _helpers.batchTelemetryRecords)(epFiltersJson, maxTelemetryBatch);
          for (const batch of batches) {
            await sender.sendOnDemand(_constants.TELEMETRY_CHANNEL_LISTS, batch);
          }
        }

        // Value list meta data
        const valueListMetaData = await receiver.fetchValueListMetaData(FETCH_VALUE_LIST_META_DATA_INTERVAL_IN_HOURS);
        (0, _helpers.tlog)(logger, `Value List Meta Data: ${JSON.stringify(valueListMetaData)}`);
        if (valueListMetaData !== null && valueListMetaData !== void 0 && valueListMetaData.total_list_count) {
          await sender.sendOnDemand(_constants.TELEMETRY_CHANNEL_LISTS, [valueListMetaData]);
        }
        await sender.sendOnDemand(_constants.TASK_METRICS_CHANNEL, [(0, _helpers.createTaskMetric)(taskName, true, startTime)]);
        return count;
      } catch (err) {
        await sender.sendOnDemand(_constants.TASK_METRICS_CHANNEL, [(0, _helpers.createTaskMetric)(taskName, false, startTime, err.message)]);
        return 0;
      }
    }
  };
}