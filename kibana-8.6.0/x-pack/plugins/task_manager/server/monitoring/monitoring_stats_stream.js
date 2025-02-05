"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HealthStatus = void 0;
exports.createAggregators = createAggregators;
exports.createMonitoringStatsStream = createMonitoringStatsStream;
exports.summarizeMonitoringStats = summarizeMonitoringStats;
var _rxjs = require("rxjs");
var _operators = require("rxjs/operators");
var _saferLodashSet = require("@kbn/safer-lodash-set");
var _workload_statistics = require("./workload_statistics");
var _ephemeral_task_statistics = require("./ephemeral_task_statistics");
var _task_run_statistics = require("./task_run_statistics");
var _background_task_utilization_statistics = require("./background_task_utilization_statistics");
var _configuration_statistics = require("./configuration_statistics");
var _capacity_estimation = require("./capacity_estimation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let HealthStatus;
exports.HealthStatus = HealthStatus;
(function (HealthStatus) {
  HealthStatus["OK"] = "OK";
  HealthStatus["Warning"] = "warn";
  HealthStatus["Error"] = "error";
})(HealthStatus || (exports.HealthStatus = HealthStatus = {}));
function createAggregators(taskStore, elasticsearchAndSOAvailability$, config, managedConfig, logger, adHocTaskCounter, taskPollingLifecycle, ephemeralTaskLifecycle) {
  const aggregators = [(0, _configuration_statistics.createConfigurationAggregator)(config, managedConfig), (0, _workload_statistics.createWorkloadAggregator)(taskStore, elasticsearchAndSOAvailability$, config.monitored_aggregated_stats_refresh_rate, config.poll_interval, logger)];
  if (taskPollingLifecycle) {
    aggregators.push((0, _task_run_statistics.createTaskRunAggregator)(taskPollingLifecycle, config.monitored_stats_running_average_window), (0, _background_task_utilization_statistics.createBackgroundTaskUtilizationAggregator)(taskPollingLifecycle, config.monitored_stats_running_average_window, adHocTaskCounter, config.poll_interval));
  }
  if (ephemeralTaskLifecycle && ephemeralTaskLifecycle.enabled) {
    aggregators.push((0, _ephemeral_task_statistics.createEphemeralTaskAggregator)(ephemeralTaskLifecycle, config.monitored_stats_running_average_window, config.max_workers));
  }
  return (0, _rxjs.merge)(...aggregators);
}
function createMonitoringStatsStream(provider$, config) {
  const initialStats = {
    last_update: new Date().toISOString(),
    stats: {}
  };
  return (0, _rxjs.merge)(
  // emit the initial stats
  (0, _rxjs.of)(initialStats),
  // emit updated stats whenever a provider updates a specific key on the stats
  provider$.pipe((0, _operators.map)(({
    key,
    value
  }) => {
    return {
      value: {
        timestamp: new Date().toISOString(),
        value
      },
      key
    };
  }), (0, _operators.scan)((monitoringStats, {
    key,
    value
  }) => {
    // incrementally merge stats as they come in
    (0, _saferLodashSet.set)(monitoringStats.stats, key, value);
    monitoringStats.last_update = new Date().toISOString();
    return monitoringStats;
  }, initialStats)));
}
function summarizeMonitoringStats(logger, {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  last_update,
  stats: {
    runtime,
    workload,
    configuration,
    ephemeral,
    utilization
  }
}, config) {
  const summarizedStats = (0, _capacity_estimation.withCapacityEstimate)(logger, {
    ...(configuration ? {
      configuration: {
        ...configuration,
        status: HealthStatus.OK
      }
    } : {}),
    ...(runtime ? {
      runtime: {
        timestamp: runtime.timestamp,
        ...(0, _task_run_statistics.summarizeTaskRunStat)(logger, runtime.value, config)
      }
    } : {}),
    ...(workload ? {
      workload: {
        timestamp: workload.timestamp,
        ...(0, _workload_statistics.summarizeWorkloadStat)(workload.value)
      }
    } : {}),
    ...(ephemeral ? {
      ephemeral: {
        timestamp: ephemeral.timestamp,
        ...(0, _ephemeral_task_statistics.summarizeEphemeralStat)(ephemeral.value)
      }
    } : {})
  });
  return {
    last_update,
    stats: summarizedStats
  };
}