"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTaskManagerUsageCollector = createTaskManagerUsageCollector;
exports.registerTaskManagerUsageCollector = registerTaskManagerUsageCollector;
var _rxjs = require("rxjs");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createTaskManagerUsageCollector(usageCollection, monitoringStats$, monitoredUtilization$, ephemeralTasksEnabled, ephemeralRequestCapacity, excludeTaskTypes) {
  let lastMonitoredHealth = null;
  let lastMonitoredUtilization = null;
  (0, _rxjs.combineLatest)([monitoringStats$, monitoredUtilization$]).pipe().subscribe(([health, utilization]) => {
    lastMonitoredHealth = health;
    lastMonitoredUtilization = utilization;
  });
  return usageCollection.makeUsageCollector({
    type: 'task_manager',
    isReady: async () => {
      return Boolean(lastMonitoredHealth);
    },
    fetch: async () => {
      var _lastMonitoredHealth$, _lastMonitoredHealth, _lastMonitoredHealth$2, _lastMonitoredHealth$3, _lastMonitoredHealth2, _lastMonitoredHealth3, _lastMonitoredHealth$4, _lastMonitoredHealth4, _lastMonitoredHealth5, _lastMonitoredHealth$5, _lastMonitoredHealth6, _lastMonitoredHealth7, _lastMonitoredHealth$6, _lastMonitoredHealth8, _lastMonitoredHealth9, _lastMonitoredHealth$7, _lastMonitoredHealth10, _lastMonitoredHealth11, _lastMonitoredHealth$8, _lastMonitoredHealth12, _lastMonitoredHealth13, _lastMonitoredHealth$9, _lastMonitoredHealth14, _lastMonitoredHealth15, _lastMonitoredHealth$10, _lastMonitoredHealth16, _lastMonitoredHealth17, _lastMonitoredHealth$11, _lastMonitoredHealth18, _lastMonitoredHealth19, _lastMonitoredHealth$12, _lastMonitoredHealth20, _lastMonitoredHealth21, _lastMonitoredHealth$13, _lastMonitoredHealth22, _lastMonitoredHealth23, _lastMonitoredHealth$14, _lastMonitoredHealth24, _lastMonitoredHealth25, _lastMonitoredHealth26, _lastMonitoredHealth27, _lastMonitoredUtiliza, _lastMonitoredUtiliza2, _lastMonitoredUtiliza3, _lastMonitoredUtiliza4, _lastMonitoredUtiliza5, _lastMonitoredUtiliza6, _lastMonitoredUtiliza7, _lastMonitoredUtiliza8, _lastMonitoredUtiliza9, _lastMonitoredUtiliza10, _lastMonitoredUtiliza11, _lastMonitoredUtiliza12, _lastMonitoredHealth$15, _lastMonitoredHealth28, _lastMonitoredHealth29;
      return {
        ephemeral_tasks_enabled: ephemeralTasksEnabled,
        ephemeral_request_capacity: ephemeralRequestCapacity,
        ephemeral_stats: {
          status: (_lastMonitoredHealth$ = (_lastMonitoredHealth = lastMonitoredHealth) === null || _lastMonitoredHealth === void 0 ? void 0 : (_lastMonitoredHealth$2 = _lastMonitoredHealth.stats.ephemeral) === null || _lastMonitoredHealth$2 === void 0 ? void 0 : _lastMonitoredHealth$2.status) !== null && _lastMonitoredHealth$ !== void 0 ? _lastMonitoredHealth$ : '',
          queued_tasks: {
            p50: (_lastMonitoredHealth$3 = (_lastMonitoredHealth2 = lastMonitoredHealth) === null || _lastMonitoredHealth2 === void 0 ? void 0 : (_lastMonitoredHealth3 = _lastMonitoredHealth2.stats.ephemeral) === null || _lastMonitoredHealth3 === void 0 ? void 0 : _lastMonitoredHealth3.value.queuedTasks.p50) !== null && _lastMonitoredHealth$3 !== void 0 ? _lastMonitoredHealth$3 : 0,
            p90: (_lastMonitoredHealth$4 = (_lastMonitoredHealth4 = lastMonitoredHealth) === null || _lastMonitoredHealth4 === void 0 ? void 0 : (_lastMonitoredHealth5 = _lastMonitoredHealth4.stats.ephemeral) === null || _lastMonitoredHealth5 === void 0 ? void 0 : _lastMonitoredHealth5.value.queuedTasks.p90) !== null && _lastMonitoredHealth$4 !== void 0 ? _lastMonitoredHealth$4 : 0,
            p95: (_lastMonitoredHealth$5 = (_lastMonitoredHealth6 = lastMonitoredHealth) === null || _lastMonitoredHealth6 === void 0 ? void 0 : (_lastMonitoredHealth7 = _lastMonitoredHealth6.stats.ephemeral) === null || _lastMonitoredHealth7 === void 0 ? void 0 : _lastMonitoredHealth7.value.queuedTasks.p95) !== null && _lastMonitoredHealth$5 !== void 0 ? _lastMonitoredHealth$5 : 0,
            p99: (_lastMonitoredHealth$6 = (_lastMonitoredHealth8 = lastMonitoredHealth) === null || _lastMonitoredHealth8 === void 0 ? void 0 : (_lastMonitoredHealth9 = _lastMonitoredHealth8.stats.ephemeral) === null || _lastMonitoredHealth9 === void 0 ? void 0 : _lastMonitoredHealth9.value.queuedTasks.p99) !== null && _lastMonitoredHealth$6 !== void 0 ? _lastMonitoredHealth$6 : 0
          },
          load: {
            p50: (_lastMonitoredHealth$7 = (_lastMonitoredHealth10 = lastMonitoredHealth) === null || _lastMonitoredHealth10 === void 0 ? void 0 : (_lastMonitoredHealth11 = _lastMonitoredHealth10.stats.ephemeral) === null || _lastMonitoredHealth11 === void 0 ? void 0 : _lastMonitoredHealth11.value.load.p50) !== null && _lastMonitoredHealth$7 !== void 0 ? _lastMonitoredHealth$7 : 0,
            p90: (_lastMonitoredHealth$8 = (_lastMonitoredHealth12 = lastMonitoredHealth) === null || _lastMonitoredHealth12 === void 0 ? void 0 : (_lastMonitoredHealth13 = _lastMonitoredHealth12.stats.ephemeral) === null || _lastMonitoredHealth13 === void 0 ? void 0 : _lastMonitoredHealth13.value.load.p90) !== null && _lastMonitoredHealth$8 !== void 0 ? _lastMonitoredHealth$8 : 0,
            p95: (_lastMonitoredHealth$9 = (_lastMonitoredHealth14 = lastMonitoredHealth) === null || _lastMonitoredHealth14 === void 0 ? void 0 : (_lastMonitoredHealth15 = _lastMonitoredHealth14.stats.ephemeral) === null || _lastMonitoredHealth15 === void 0 ? void 0 : _lastMonitoredHealth15.value.load.p95) !== null && _lastMonitoredHealth$9 !== void 0 ? _lastMonitoredHealth$9 : 0,
            p99: (_lastMonitoredHealth$10 = (_lastMonitoredHealth16 = lastMonitoredHealth) === null || _lastMonitoredHealth16 === void 0 ? void 0 : (_lastMonitoredHealth17 = _lastMonitoredHealth16.stats.ephemeral) === null || _lastMonitoredHealth17 === void 0 ? void 0 : _lastMonitoredHealth17.value.load.p99) !== null && _lastMonitoredHealth$10 !== void 0 ? _lastMonitoredHealth$10 : 0
          },
          executions_per_cycle: {
            p50: (_lastMonitoredHealth$11 = (_lastMonitoredHealth18 = lastMonitoredHealth) === null || _lastMonitoredHealth18 === void 0 ? void 0 : (_lastMonitoredHealth19 = _lastMonitoredHealth18.stats.ephemeral) === null || _lastMonitoredHealth19 === void 0 ? void 0 : _lastMonitoredHealth19.value.executionsPerCycle.p50) !== null && _lastMonitoredHealth$11 !== void 0 ? _lastMonitoredHealth$11 : 0,
            p90: (_lastMonitoredHealth$12 = (_lastMonitoredHealth20 = lastMonitoredHealth) === null || _lastMonitoredHealth20 === void 0 ? void 0 : (_lastMonitoredHealth21 = _lastMonitoredHealth20.stats.ephemeral) === null || _lastMonitoredHealth21 === void 0 ? void 0 : _lastMonitoredHealth21.value.executionsPerCycle.p90) !== null && _lastMonitoredHealth$12 !== void 0 ? _lastMonitoredHealth$12 : 0,
            p95: (_lastMonitoredHealth$13 = (_lastMonitoredHealth22 = lastMonitoredHealth) === null || _lastMonitoredHealth22 === void 0 ? void 0 : (_lastMonitoredHealth23 = _lastMonitoredHealth22.stats.ephemeral) === null || _lastMonitoredHealth23 === void 0 ? void 0 : _lastMonitoredHealth23.value.executionsPerCycle.p95) !== null && _lastMonitoredHealth$13 !== void 0 ? _lastMonitoredHealth$13 : 0,
            p99: (_lastMonitoredHealth$14 = (_lastMonitoredHealth24 = lastMonitoredHealth) === null || _lastMonitoredHealth24 === void 0 ? void 0 : (_lastMonitoredHealth25 = _lastMonitoredHealth24.stats.ephemeral) === null || _lastMonitoredHealth25 === void 0 ? void 0 : _lastMonitoredHealth25.value.executionsPerCycle.p99) !== null && _lastMonitoredHealth$14 !== void 0 ? _lastMonitoredHealth$14 : 0
          }
        },
        task_type_exclusion: excludeTaskTypes,
        failed_tasks: Object.entries((_lastMonitoredHealth26 = lastMonitoredHealth) === null || _lastMonitoredHealth26 === void 0 ? void 0 : (_lastMonitoredHealth27 = _lastMonitoredHealth26.stats.workload) === null || _lastMonitoredHealth27 === void 0 ? void 0 : _lastMonitoredHealth27.value.task_types).reduce((numb, [key, val]) => {
          if (val.status.failed !== undefined) {
            numb += val.status.failed;
          }
          return numb;
        }, 0),
        recurring_tasks: {
          actual_service_time: (_lastMonitoredUtiliza = (_lastMonitoredUtiliza2 = lastMonitoredUtilization) === null || _lastMonitoredUtiliza2 === void 0 ? void 0 : (_lastMonitoredUtiliza3 = _lastMonitoredUtiliza2.stats) === null || _lastMonitoredUtiliza3 === void 0 ? void 0 : _lastMonitoredUtiliza3.value.recurring.ran.service_time.actual) !== null && _lastMonitoredUtiliza !== void 0 ? _lastMonitoredUtiliza : 0,
          adjusted_service_time: (_lastMonitoredUtiliza4 = (_lastMonitoredUtiliza5 = lastMonitoredUtilization) === null || _lastMonitoredUtiliza5 === void 0 ? void 0 : (_lastMonitoredUtiliza6 = _lastMonitoredUtiliza5.stats) === null || _lastMonitoredUtiliza6 === void 0 ? void 0 : _lastMonitoredUtiliza6.value.recurring.ran.service_time.adjusted) !== null && _lastMonitoredUtiliza4 !== void 0 ? _lastMonitoredUtiliza4 : 0
        },
        adhoc_tasks: {
          actual_service_time: (_lastMonitoredUtiliza7 = (_lastMonitoredUtiliza8 = lastMonitoredUtilization) === null || _lastMonitoredUtiliza8 === void 0 ? void 0 : (_lastMonitoredUtiliza9 = _lastMonitoredUtiliza8.stats) === null || _lastMonitoredUtiliza9 === void 0 ? void 0 : _lastMonitoredUtiliza9.value.adhoc.ran.service_time.actual) !== null && _lastMonitoredUtiliza7 !== void 0 ? _lastMonitoredUtiliza7 : 0,
          adjusted_service_time: (_lastMonitoredUtiliza10 = (_lastMonitoredUtiliza11 = lastMonitoredUtilization) === null || _lastMonitoredUtiliza11 === void 0 ? void 0 : (_lastMonitoredUtiliza12 = _lastMonitoredUtiliza11.stats) === null || _lastMonitoredUtiliza12 === void 0 ? void 0 : _lastMonitoredUtiliza12.value.adhoc.ran.service_time.adjusted) !== null && _lastMonitoredUtiliza10 !== void 0 ? _lastMonitoredUtiliza10 : 0
        },
        capacity: (_lastMonitoredHealth$15 = (_lastMonitoredHealth28 = lastMonitoredHealth) === null || _lastMonitoredHealth28 === void 0 ? void 0 : (_lastMonitoredHealth29 = _lastMonitoredHealth28.stats.capacity_estimation) === null || _lastMonitoredHealth29 === void 0 ? void 0 : _lastMonitoredHealth29.value.observed.max_throughput_per_minute_per_kibana) !== null && _lastMonitoredHealth$15 !== void 0 ? _lastMonitoredHealth$15 : 0
      };
    },
    schema: {
      ephemeral_tasks_enabled: {
        type: 'boolean'
      },
      ephemeral_request_capacity: {
        type: 'short'
      },
      ephemeral_stats: {
        status: {
          type: 'keyword'
        },
        queued_tasks: {
          p50: {
            type: 'long'
          },
          p90: {
            type: 'long'
          },
          p95: {
            type: 'long'
          },
          p99: {
            type: 'long'
          }
        },
        load: {
          p50: {
            type: 'long'
          },
          p90: {
            type: 'long'
          },
          p95: {
            type: 'long'
          },
          p99: {
            type: 'long'
          }
        },
        executions_per_cycle: {
          p50: {
            type: 'long'
          },
          p90: {
            type: 'long'
          },
          p95: {
            type: 'long'
          },
          p99: {
            type: 'long'
          }
        }
      },
      task_type_exclusion: {
        type: 'array',
        items: {
          type: 'keyword'
        }
      },
      failed_tasks: {
        type: 'long'
      },
      recurring_tasks: {
        actual_service_time: {
          type: 'long'
        },
        adjusted_service_time: {
          type: 'long'
        }
      },
      adhoc_tasks: {
        actual_service_time: {
          type: 'long'
        },
        adjusted_service_time: {
          type: 'long'
        }
      },
      capacity: {
        type: 'long'
      }
    }
  });
}
function registerTaskManagerUsageCollector(usageCollection, monitoringStats$, monitoredUtilization$, ephemeralTasksEnabled, ephemeralRequestCapacity, excludeTaskTypes) {
  const collector = createTaskManagerUsageCollector(usageCollection, monitoringStats$, monitoredUtilization$, ephemeralTasksEnabled, ephemeralRequestCapacity, excludeTaskTypes);
  usageCollection.registerCollector(collector);
}