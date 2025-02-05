"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskPersistence = exports.TaskEventType = void 0;
exports.asEphemeralTaskRejectedDueToCapacityEvent = asEphemeralTaskRejectedDueToCapacityEvent;
exports.asTaskClaimEvent = asTaskClaimEvent;
exports.asTaskManagerStatEvent = asTaskManagerStatEvent;
exports.asTaskMarkRunningEvent = asTaskMarkRunningEvent;
exports.asTaskPollingCycleEvent = asTaskPollingCycleEvent;
exports.asTaskRunEvent = asTaskRunEvent;
exports.asTaskRunRequestEvent = asTaskRunRequestEvent;
exports.isEphemeralTaskRejectedDueToCapacityEvent = isEphemeralTaskRejectedDueToCapacityEvent;
exports.isTaskClaimEvent = isTaskClaimEvent;
exports.isTaskManagerStatEvent = isTaskManagerStatEvent;
exports.isTaskMarkRunningEvent = isTaskMarkRunningEvent;
exports.isTaskPollingCycleEvent = isTaskPollingCycleEvent;
exports.isTaskRunEvent = isTaskRunEvent;
exports.isTaskRunRequestEvent = isTaskRunRequestEvent;
exports.startTaskTimer = startTaskTimer;
exports.startTaskTimerWithEventLoopMonitoring = startTaskTimerWithEventLoopMonitoring;
var _perf_hooks = require("perf_hooks");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let TaskPersistence;
exports.TaskPersistence = TaskPersistence;
(function (TaskPersistence) {
  TaskPersistence["Recurring"] = "recurring";
  TaskPersistence["NonRecurring"] = "non_recurring";
  TaskPersistence["Ephemeral"] = "ephemeral";
})(TaskPersistence || (exports.TaskPersistence = TaskPersistence = {}));
let TaskEventType;
exports.TaskEventType = TaskEventType;
(function (TaskEventType) {
  TaskEventType["TASK_CLAIM"] = "TASK_CLAIM";
  TaskEventType["TASK_MARK_RUNNING"] = "TASK_MARK_RUNNING";
  TaskEventType["TASK_RUN"] = "TASK_RUN";
  TaskEventType["TASK_RUN_REQUEST"] = "TASK_RUN_REQUEST";
  TaskEventType["TASK_POLLING_CYCLE"] = "TASK_POLLING_CYCLE";
  TaskEventType["TASK_MANAGER_STAT"] = "TASK_MANAGER_STAT";
  TaskEventType["EPHEMERAL_TASK_DELAYED_DUE_TO_CAPACITY"] = "EPHEMERAL_TASK_DELAYED_DUE_TO_CAPACITY";
})(TaskEventType || (exports.TaskEventType = TaskEventType = {}));
function startTaskTimer() {
  const start = Date.now();
  return () => ({
    start,
    stop: Date.now()
  });
}
function startTaskTimerWithEventLoopMonitoring(eventLoopDelayConfig) {
  const stopTaskTimer = startTaskTimer();
  const eldHistogram = eventLoopDelayConfig.monitor ? (0, _perf_hooks.monitorEventLoopDelay)() : null;
  eldHistogram === null || eldHistogram === void 0 ? void 0 : eldHistogram.enable();
  return () => {
    var _eldHistogram$max;
    const {
      start,
      stop
    } = stopTaskTimer();
    eldHistogram === null || eldHistogram === void 0 ? void 0 : eldHistogram.disable();
    const eldMax = (_eldHistogram$max = eldHistogram === null || eldHistogram === void 0 ? void 0 : eldHistogram.max) !== null && _eldHistogram$max !== void 0 ? _eldHistogram$max : 0;
    const eventLoopBlockMs = Math.round(eldMax / 1000 / 1000); // original in nanoseconds
    return {
      start,
      stop,
      eventLoopBlockMs
    };
  };
}
function asTaskMarkRunningEvent(id, event, timing) {
  return {
    id,
    type: TaskEventType.TASK_MARK_RUNNING,
    event,
    timing
  };
}
function asTaskRunEvent(id, event, timing) {
  return {
    id,
    type: TaskEventType.TASK_RUN,
    event,
    timing
  };
}
function asTaskClaimEvent(id, event, timing) {
  return {
    id,
    type: TaskEventType.TASK_CLAIM,
    event,
    timing
  };
}
function asTaskRunRequestEvent(id,
// we only emit a TaskRunRequest event when it fails
event, timing) {
  return {
    id,
    type: TaskEventType.TASK_RUN_REQUEST,
    event,
    timing
  };
}
function asTaskPollingCycleEvent(event, timing) {
  return {
    type: TaskEventType.TASK_POLLING_CYCLE,
    event,
    timing
  };
}
function asTaskManagerStatEvent(id, event) {
  return {
    id,
    type: TaskEventType.TASK_MANAGER_STAT,
    event
  };
}
function asEphemeralTaskRejectedDueToCapacityEvent(id, event, timing) {
  return {
    id,
    type: TaskEventType.EPHEMERAL_TASK_DELAYED_DUE_TO_CAPACITY,
    event,
    timing
  };
}
function isTaskMarkRunningEvent(taskEvent) {
  return taskEvent.type === TaskEventType.TASK_MARK_RUNNING;
}
function isTaskRunEvent(taskEvent) {
  return taskEvent.type === TaskEventType.TASK_RUN;
}
function isTaskClaimEvent(taskEvent) {
  return taskEvent.type === TaskEventType.TASK_CLAIM;
}
function isTaskRunRequestEvent(taskEvent) {
  return taskEvent.type === TaskEventType.TASK_RUN_REQUEST;
}
function isTaskPollingCycleEvent(taskEvent) {
  return taskEvent.type === TaskEventType.TASK_POLLING_CYCLE;
}
function isTaskManagerStatEvent(taskEvent) {
  return taskEvent.type === TaskEventType.TASK_MANAGER_STAT;
}
function isEphemeralTaskRejectedDueToCapacityEvent(taskEvent) {
  return taskEvent.type === TaskEventType.EPHEMERAL_TASK_DELAYED_DUE_TO_CAPACITY;
}