"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskScheduling = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _operators = require("rxjs/operators");
var _pMap = _interopRequireDefault(require("p-map"));
var _uuid = _interopRequireDefault(require("uuid"));
var _lodash = require("lodash");
var _rxjs = require("rxjs");
var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));
var _query_clauses = require("./queries/query_clauses");
var _result_type = require("./lib/result_type");
var _task_events = require("./task_events");
var _intervals = require("./lib/intervals");
var _task = require("./task");
var _correct_deprecated_fields = require("./lib/correct_deprecated_fields");
var _task_running = require("./task_running");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const VERSION_CONFLICT_STATUS = 409;
const BULK_ACTION_SIZE = 100;
class TaskScheduling {
  /**
   * Initializes the task manager, preventing any further addition of middleware,
   * enabling the task manipulation methods, and beginning the background polling
   * mechanism.
   */
  constructor(opts) {
    (0, _defineProperty2.default)(this, "store", void 0);
    (0, _defineProperty2.default)(this, "ephemeralTaskLifecycle", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "middleware", void 0);
    (0, _defineProperty2.default)(this, "taskManagerId", void 0);
    this.logger = opts.logger;
    this.middleware = opts.middleware;
    this.ephemeralTaskLifecycle = opts.ephemeralTaskLifecycle;
    this.store = opts.taskStore;
    this.taskManagerId = opts.taskManagerId;
  }

  /**
   * Schedules a task.
   *
   * @param task - The task being scheduled.
   * @returns {Promise<ConcreteTaskInstance>}
   */
  async schedule(taskInstance, options) {
    var _modifiedTask$enabled;
    const {
      taskInstance: modifiedTask
    } = await this.middleware.beforeSave({
      ...options,
      taskInstance: (0, _correct_deprecated_fields.ensureDeprecatedFieldsAreCorrected)(taskInstance, this.logger)
    });
    const traceparent = _elasticApmNode.default.currentTransaction && _elasticApmNode.default.currentTransaction.type !== 'request' ? _elasticApmNode.default.currentTraceparent : '';
    return await this.store.schedule({
      ...modifiedTask,
      traceparent: traceparent || '',
      enabled: (_modifiedTask$enabled = modifiedTask.enabled) !== null && _modifiedTask$enabled !== void 0 ? _modifiedTask$enabled : true
    });
  }

  /**
   * Bulk schedules a task.
   *
   * @param tasks - The tasks being scheduled.
   * @returns {Promise<ConcreteTaskInstance>}
   */
  async bulkSchedule(taskInstances, options) {
    const traceparent = _elasticApmNode.default.currentTransaction && _elasticApmNode.default.currentTransaction.type !== 'request' ? _elasticApmNode.default.currentTraceparent : '';
    const modifiedTasks = await Promise.all(taskInstances.map(async taskInstance => {
      var _modifiedTask$enabled2;
      const {
        taskInstance: modifiedTask
      } = await this.middleware.beforeSave({
        ...options,
        taskInstance: (0, _correct_deprecated_fields.ensureDeprecatedFieldsAreCorrected)(taskInstance, this.logger)
      });
      return {
        ...modifiedTask,
        traceparent: traceparent || '',
        enabled: (_modifiedTask$enabled2 = modifiedTask.enabled) !== null && _modifiedTask$enabled2 !== void 0 ? _modifiedTask$enabled2 : true
      };
    }));
    return await this.store.bulkSchedule(modifiedTasks);
  }
  async bulkDisable(taskIds) {
    const enabledTasks = await this.bulkGetTasksHelper(taskIds, {
      term: {
        'task.enabled': true
      }
    });
    const updatedTasks = enabledTasks.flatMap(({
      docs
    }) => docs).reduce((acc, task) => {
      // if task is not enabled, no need to update it
      if (!task.enabled) {
        return acc;
      }
      acc.push({
        ...task,
        enabled: false
      });
      return acc;
    }, []);
    return await this.bulkUpdateTasksHelper(updatedTasks);
  }
  async bulkEnable(taskIds, runSoon = true) {
    const disabledTasks = await this.bulkGetTasksHelper(taskIds, {
      term: {
        'task.enabled': false
      }
    });
    const updatedTasks = disabledTasks.flatMap(({
      docs
    }) => docs).reduce((acc, task) => {
      // if task is enabled, no need to update it
      if (task.enabled) {
        return acc;
      }
      if (runSoon) {
        acc.push({
          ...task,
          enabled: true,
          scheduledAt: new Date(),
          runAt: new Date()
        });
      } else {
        acc.push({
          ...task,
          enabled: true
        });
      }
      return acc;
    }, []);
    return await this.bulkUpdateTasksHelper(updatedTasks);
  }

  /**
   * Bulk updates schedules for tasks by ids.
   * Only tasks with `idle` status will be updated, as for the tasks which have `running` status,
   * `schedule` and `runAt` will be recalculated after task run finishes
   *
   * @param {string[]} taskIds  - list of task ids
   * @param {IntervalSchedule} schedule  - new schedule
   * @returns {Promise<BulkUpdateTaskResult>}
   */
  async bulkUpdateSchedules(taskIds, schedule) {
    const tasks = await this.bulkGetTasksHelper(taskIds, {
      term: {
        'task.status': 'idle'
      }
    });
    const updatedTasks = tasks.flatMap(({
      docs
    }) => docs).reduce((acc, task) => {
      var _task$schedule, _task$schedule$interv, _task$schedule2;
      // if task schedule interval is the same, no need to update it
      if (((_task$schedule = task.schedule) === null || _task$schedule === void 0 ? void 0 : _task$schedule.interval) === schedule.interval) {
        return acc;
      }
      const oldIntervalInMs = (0, _intervals.parseIntervalAsMillisecond)((_task$schedule$interv = (_task$schedule2 = task.schedule) === null || _task$schedule2 === void 0 ? void 0 : _task$schedule2.interval) !== null && _task$schedule$interv !== void 0 ? _task$schedule$interv : '0s');

      // computing new runAt using formula:
      // newRunAt = oldRunAt - oldInterval + newInterval
      const newRunAtInMs = Math.max(Date.now(), task.runAt.getTime() - oldIntervalInMs + (0, _intervals.parseIntervalAsMillisecond)(schedule.interval));
      acc.push({
        ...task,
        schedule,
        runAt: new Date(newRunAtInMs)
      });
      return acc;
    }, []);
    return await this.bulkUpdateTasksHelper(updatedTasks);
  }
  async bulkGetTasksHelper(taskIds, ...must) {
    return await (0, _pMap.default)((0, _lodash.chunk)(taskIds, BULK_ACTION_SIZE), async taskIdsChunk => this.store.fetch({
      query: (0, _query_clauses.mustBeAllOf)({
        terms: {
          _id: taskIdsChunk.map(taskId => `task:${taskId}`)
        }
      }, ...must),
      size: BULK_ACTION_SIZE
    }), {
      concurrency: 10
    });
  }
  async bulkUpdateTasksHelper(updatedTasks) {
    return (await this.store.bulkUpdate(updatedTasks)).reduce((acc, task) => {
      if (task.tag === 'ok') {
        acc.tasks.push(task.value);
      } else {
        acc.errors.push({
          error: task.error.error,
          task: task.error.entity
        });
      }
      return acc;
    }, {
      tasks: [],
      errors: []
    });
  }

  /**
   * Run task.
   *
   * @param taskId - The task being scheduled.
   * @returns {Promise<RunSoonResult>}
   */
  async runSoon(taskId) {
    const task = await this.getNonRunningTask(taskId);
    try {
      await this.store.update({
        ...task,
        status: _task.TaskStatus.Idle,
        scheduledAt: new Date(),
        runAt: new Date()
      });
    } catch (e) {
      if (e.statusCode === 409) {
        this.logger.debug(`Failed to update the task (${taskId}) for runSoon due to conflict (409)`);
      } else {
        this.logger.error(`Failed to update the task (${taskId}) for runSoon`);
        throw e;
      }
    }
    return {
      id: task.id
    };
  }

  /**
   * Run an ad-hoc task in memory without persisting it into ES or distributing the load across the cluster.
   *
   * @param task - The ephemeral task being queued.
   * @returns {Promise<ConcreteTaskInstance>}
   */
  async ephemeralRunNow(task, options) {
    if (!this.ephemeralTaskLifecycle) {
      throw new _task_running.EphemeralTaskRejectedDueToCapacityError(`Ephemeral Task of type ${task.taskType} was rejected because ephemeral tasks are not supported`, task);
    }
    const id = _uuid.default.v4();
    const {
      taskInstance: modifiedTask
    } = await this.middleware.beforeSave({
      ...options,
      taskInstance: task
    });
    return new Promise(async (resolve, reject) => {
      try {
        // The actual promise returned from this function is resolved after the awaitTaskRunResult promise resolves.
        // However, we do not wait to await this promise, as we want later execution to happen in parallel.
        // The awaitTaskRunResult promise is resolved once the ephemeral task is successfully executed (technically, when a TaskEventType.TASK_RUN is emitted with the same id).
        // However, the ephemeral task won't even get into the queue until the subsequent this.ephemeralTaskLifecycle.attemptToRun is called (which puts it in the queue).
        // The reason for all this confusion? Timing.
        // In the this.ephemeralTaskLifecycle.attemptToRun, it's possible that the ephemeral task is put into the queue and processed before this function call returns anything.
        // If that happens, putting the awaitTaskRunResult after would just hang because the task already completed. We need to listen for the completion before we add it to the queue to avoid this possibility.
        const {
          cancel,
          resolveOnCancel
        } = cancellablePromise();
        this.awaitTaskRunResult(id, resolveOnCancel).then(arg => {
          resolve(arg);
        }).catch(err => {
          reject(err);
        });
        const attemptToRunResult = this.ephemeralTaskLifecycle.attemptToRun({
          id,
          scheduledAt: new Date(),
          runAt: new Date(),
          status: _task.TaskStatus.Idle,
          ownerId: this.taskManagerId,
          ...modifiedTask
        });
        if ((0, _result_type.isErr)(attemptToRunResult)) {
          cancel();
          reject(new _task_running.EphemeralTaskRejectedDueToCapacityError(`Ephemeral Task of type ${task.taskType} was rejected`, task));
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Schedules a task with an Id
   *
   * @param task - The task being scheduled.
   * @returns {Promise<TaskInstanceWithId>}
   */
  async ensureScheduled(taskInstance, options) {
    try {
      return await this.schedule(taskInstance, options);
    } catch (err) {
      if (err.statusCode === VERSION_CONFLICT_STATUS) {
        return taskInstance;
      }
      throw err;
    }
  }
  awaitTaskRunResult(taskId, cancel) {
    return new Promise((resolve, reject) => {
      if (!this.ephemeralTaskLifecycle) {
        reject(new Error(`Failed to run task "${taskId}" because ephemeral tasks are not supported. Rescheduled the task to ensure it is picked up as soon as possible.`));
      }
      // listen for all events related to the current task
      const subscription = this.ephemeralTaskLifecycle.events.pipe((0, _operators.filter)(({
        id
      }) => id === taskId)).subscribe(taskEvent => {
        if ((0, _task_events.isTaskClaimEvent)(taskEvent)) {
          (0, _result_type.mapErr)(async error => {
            // reject if any error event takes place for the requested task
            subscription.unsubscribe();
          }, taskEvent.event);
        } else {
          (0, _result_type.either)(taskEvent.event, taskInstance => {
            // resolve if the task has run sucessfully
            if ((0, _task_events.isTaskRunEvent)(taskEvent)) {
              subscription.unsubscribe();
              resolve((0, _lodash.pick)(taskInstance.task, ['id', 'state']));
            }
          }, async errorResult => {
            // reject if any error event takes place for the requested task
            subscription.unsubscribe();
            return reject(new Error(`Failed to run task "${taskId}": ${(0, _task_events.isTaskRunRequestEvent)(taskEvent) ? `Task Manager is at capacity, please try again later` : (0, _task_events.isTaskRunEvent)(taskEvent) ? `${errorResult.error}` : `${errorResult}`}`));
          });
        }
      });
      if (cancel) {
        cancel.then(() => {
          subscription.unsubscribe();
        });
      }
    });
  }
  async getNonRunningTask(taskId) {
    const task = await this.store.get(taskId);
    switch (task.status) {
      case _task.TaskStatus.Claiming:
      case _task.TaskStatus.Running:
        throw Error(`Failed to run task "${taskId}" as it is currently running`);
      case _task.TaskStatus.Unrecognized:
        throw Error(`Failed to run task "${taskId}" with status ${task.status}`);
      case _task.TaskStatus.Failed:
      default:
        return task;
    }
  }
}
exports.TaskScheduling = TaskScheduling;
const cancellablePromise = () => {
  const boolStream = new _rxjs.Subject();
  return {
    cancel: () => boolStream.next(true),
    resolveOnCancel: boolStream.pipe((0, _operators.take)(1)).toPromise().then(() => {})
  };
};