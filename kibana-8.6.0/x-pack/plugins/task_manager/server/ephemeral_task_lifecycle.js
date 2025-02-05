"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EphemeralTaskLifecycle = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _rxjs = require("rxjs");
var _operators = require("rxjs/operators");
var _result_type = require("./lib/result_type");
var _task_events = require("./task_events");
var _ephemeral_task_runner = require("./task_running/ephemeral_task_runner");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class EphemeralTaskLifecycle {
  // all task related events (task claimed, task marked as running, etc.) are emitted through events$

  constructor({
    logger,
    middleware,
    definitions,
    pool,
    lifecycleEvent,
    config,
    executionContext
  }) {
    (0, _defineProperty2.default)(this, "definitions", void 0);
    (0, _defineProperty2.default)(this, "pool", void 0);
    (0, _defineProperty2.default)(this, "lifecycleEvent", void 0);
    (0, _defineProperty2.default)(this, "events$", new _rxjs.Subject());
    (0, _defineProperty2.default)(this, "ephemeralTaskQueue", []);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "middleware", void 0);
    (0, _defineProperty2.default)(this, "lifecycleSubscription", _rxjs.Subscription.EMPTY);
    (0, _defineProperty2.default)(this, "executionContext", void 0);
    (0, _defineProperty2.default)(this, "getCapacity", taskType => {
      var _this$definitions$get;
      return taskType && (_this$definitions$get = this.definitions.get(taskType)) !== null && _this$definitions$get !== void 0 && _this$definitions$get.maxConcurrency ? Math.max(Math.min(this.pool.availableWorkers, this.definitions.get(taskType).maxConcurrency - this.pool.getOccupiedWorkersByType(taskType)), 0) : this.pool.availableWorkers;
    });
    (0, _defineProperty2.default)(this, "emitEvent", event => {
      this.events$.next(event);
    });
    (0, _defineProperty2.default)(this, "createTaskRunnerForTask", instance => {
      return new _ephemeral_task_runner.EphemeralTaskManagerRunner({
        logger: this.logger,
        instance: {
          ...instance,
          startedAt: new Date()
        },
        definitions: this.definitions,
        beforeRun: this.middleware.beforeRun,
        beforeMarkRunning: this.middleware.beforeMarkRunning,
        onTaskEvent: this.emitEvent,
        executionContext: this.executionContext
      });
    });
    this.logger = logger;
    this.middleware = middleware;
    this.definitions = definitions;
    this.pool = pool;
    this.lifecycleEvent = lifecycleEvent;
    this.config = config;
    this.executionContext = executionContext;
    if (this.enabled) {
      this.lifecycleSubscription = this.lifecycleEvent.pipe((0, _operators.filter)(e => {
        const hasPollingCycleCompleted = (0, _task_events.isTaskPollingCycleEvent)(e);
        if (hasPollingCycleCompleted) {
          this.emitEvent((0, _task_events.asTaskManagerStatEvent)('queuedEphemeralTasks', (0, _result_type.asOk)(this.queuedTasks)));
        }
        return (
          // when a polling cycle or a task run have just completed
          (hasPollingCycleCompleted || (0, _task_events.isTaskRunEvent)(e)) &&
          // we want to know when the queue has ephemeral task run requests
          this.queuedTasks > 0 && this.getCapacity() > 0
        );
      })).subscribe(async e => {
        let overallCapacity = this.getCapacity();
        const capacityByType = new Map();
        const tasksWithinCapacity = [...this.ephemeralTaskQueue].filter(({
          task
        }) => {
          if (overallCapacity > 0) {
            if (!capacityByType.has(task.taskType)) {
              capacityByType.set(task.taskType, this.getCapacity(task.taskType));
            }
            if (capacityByType.get(task.taskType) > 0) {
              overallCapacity--;
              capacityByType.set(task.taskType, capacityByType.get(task.taskType) - 1);
              return true;
            }
          }
        }).map(ephemeralTask => {
          const index = this.ephemeralTaskQueue.indexOf(ephemeralTask);
          if (index >= 0) {
            this.ephemeralTaskQueue.splice(index, 1);
          }
          this.emitEvent((0, _task_events.asTaskManagerStatEvent)('ephemeralTaskDelay', (0, _result_type.asOk)(Date.now() - ephemeralTask.enqueuedAt)));
          return this.createTaskRunnerForTask(ephemeralTask.task);
        });
        if (tasksWithinCapacity.length) {
          this.pool.run(tasksWithinCapacity).then(successTaskPoolRunResult => {
            this.logger.debug(`Successful ephemeral task lifecycle resulted in: ${successTaskPoolRunResult}`);
          }).catch(error => {
            this.logger.debug(`Failed ephemeral task lifecycle resulted in: ${error}`);
          });
        }
      });
    }
  }
  get enabled() {
    return this.config.ephemeral_tasks.enabled;
  }
  get events() {
    return this.events$;
  }
  attemptToRun(task) {
    if (this.lifecycleSubscription.closed) {
      return (0, _result_type.asErr)(task);
    }
    return pushIntoSetWithTimestamp(this.ephemeralTaskQueue, this.config.ephemeral_tasks.request_capacity, task);
  }
  get queuedTasks() {
    return this.ephemeralTaskQueue.length;
  }
}

/**
 * Pushes values into a bounded set
 * @param set A Set of generic type T
 * @param maxCapacity How many values are we allowed to push into the set
 * @param value A value T to push into the set if it is there
 */
exports.EphemeralTaskLifecycle = EphemeralTaskLifecycle;
function pushIntoSetWithTimestamp(set, maxCapacity, task) {
  if (set.length >= maxCapacity) {
    return (0, _result_type.asErr)(task);
  }
  set.push({
    task,
    enqueuedAt: Date.now()
  });
  return (0, _result_type.asOk)(task);
}