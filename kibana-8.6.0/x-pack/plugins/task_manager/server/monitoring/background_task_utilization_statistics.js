"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBackgroundTaskUtilizationAggregator = createBackgroundTaskUtilizationAggregator;
exports.summarizeUtilizationStats = summarizeUtilizationStats;
var _lodash = require("lodash");
var _rxjs = require("rxjs");
var _result_type = require("../lib/result_type");
var _task_events = require("../task_events");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createBackgroundTaskUtilizationAggregator(taskPollingLifecycle, runningAverageWindowSize, adHocTaskCounter, pollInterval) {
  const taskRunEventToAdhocStat = createTaskRunEventToAdhocStat(runningAverageWindowSize);
  const taskRunAdhocEvents$ = taskPollingLifecycle.events.pipe((0, _rxjs.filter)(taskEvent => (0, _task_events.isTaskRunEvent)(taskEvent) && hasTiming(taskEvent)), (0, _rxjs.map)(taskEvent => ({
    taskEvent,
    ...(0, _result_type.unwrap)(taskEvent.event)
  })), (0, _rxjs.filter)(({
    task
  }) => (0, _lodash.get)(task, 'schedule.interval', null) == null), (0, _rxjs.map)(({
    taskEvent
  }) => {
    return taskRunEventToAdhocStat(taskEvent.timing, adHocTaskCounter, pollInterval);
  }));
  const taskRunEventToRecurringStat = createTaskRunEventToRecurringStat(runningAverageWindowSize);
  const taskRunRecurringEvents$ = taskPollingLifecycle.events.pipe((0, _rxjs.filter)(taskEvent => (0, _task_events.isTaskRunEvent)(taskEvent) && hasTiming(taskEvent)), (0, _rxjs.map)(taskEvent => ({
    taskEvent,
    ...(0, _result_type.unwrap)(taskEvent.event)
  })), (0, _rxjs.filter)(({
    task
  }) => (0, _lodash.get)(task, 'schedule.interval', null) != null), (0, _rxjs.map)(({
    taskEvent,
    task
  }) => {
    return taskRunEventToRecurringStat(taskEvent.timing, task, pollInterval);
  }));
  return (0, _rxjs.combineLatest)([taskRunAdhocEvents$.pipe((0, _rxjs.startWith)({
    adhoc: {
      created: {
        counter: 0
      },
      ran: {
        service_time: {
          actual: 0,
          adjusted: 0,
          task_counter: 0
        }
      }
    }
  })), taskRunRecurringEvents$.pipe((0, _rxjs.startWith)({
    recurring: {
      ran: {
        service_time: {
          actual: 0,
          adjusted: 0,
          task_counter: 0
        }
      }
    }
  }))]).pipe((0, _rxjs.map)(([adhoc, recurring]) => {
    return {
      key: 'utilization',
      value: {
        ...adhoc,
        ...recurring
      }
    };
  }));
}
function hasTiming(taskEvent) {
  return !!(taskEvent !== null && taskEvent !== void 0 && taskEvent.timing);
}
function summarizeUtilizationStats({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  last_update,
  stats
}) {
  const utilizationStats = stats === null || stats === void 0 ? void 0 : stats.value;
  return {
    last_update,
    stats: stats && utilizationStats ? {
      timestamp: stats.timestamp,
      value: utilizationStats
    } : null
  };
}
function createTaskRunEventToAdhocStat(runningAverageWindowSize) {
  let createdCounter = 0;
  let actualCounter = 0;
  let adjustedCounter = 0;
  let taskCounter = 0;
  return (timing, adHocTaskCounter, pollInterval) => {
    const {
      duration,
      adjusted
    } = getServiceTimeStats(timing, pollInterval);
    const created = adHocTaskCounter.count;
    adHocTaskCounter.reset();
    return {
      adhoc: {
        created: {
          counter: createdCounter += created
        },
        ran: {
          service_time: {
            actual: actualCounter += duration,
            adjusted: adjustedCounter += adjusted,
            task_counter: taskCounter += 1
          }
        }
      }
    };
  };
}
function createTaskRunEventToRecurringStat(runningAverageWindowSize) {
  let actualCounter = 0;
  let adjustedCounter = 0;
  let taskCounter = 0;
  return (timing, task, pollInterval) => {
    const {
      duration,
      adjusted
    } = getServiceTimeStats(timing, pollInterval);
    return {
      recurring: {
        ran: {
          service_time: {
            actual: actualCounter += duration,
            adjusted: adjustedCounter += adjusted,
            task_counter: taskCounter += 1
          }
        }
      }
    };
  };
}
function getServiceTimeStats(timing, pollInterval) {
  const duration = timing.stop - timing.start;
  const adjusted = Math.ceil(duration / pollInterval) * pollInterval;
  return {
    duration,
    adjusted
  };
}