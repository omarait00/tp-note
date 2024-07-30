"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskPoolRunResult = exports.TaskPool = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _rxjs = require("rxjs");
var _moment = _interopRequireDefault(require("moment"));
var _lodash = require("lodash");
var _is_task_not_found_error = require("./lib/is_task_not_found_error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
/*
 * This module contains the logic that ensures we don't run too many
 * tasks at once in a given Kibana instance.
 */
let TaskPoolRunResult;
exports.TaskPoolRunResult = TaskPoolRunResult;
(function (TaskPoolRunResult) {
  TaskPoolRunResult["NoTaskWereRan"] = "NoTaskWereRan";
  TaskPoolRunResult["RunningAllClaimedTasks"] = "RunningAllClaimedTasks";
  TaskPoolRunResult["RunningAtCapacity"] = "RunningAtCapacity";
  TaskPoolRunResult["RanOutOfCapacity"] = "RanOutOfCapacity";
})(TaskPoolRunResult || (exports.TaskPoolRunResult = TaskPoolRunResult = {}));
const VERSION_CONFLICT_MESSAGE = 'Task has been claimed by another Kibana service';

/**
 * Runs tasks in batches, taking costs into account.
 */
class TaskPool {
  /**
   * Creates an instance of TaskPool.
   *
   * @param {Opts} opts
   * @prop {number} maxWorkers - The total number of workers / work slots available
   *    (e.g. maxWorkers is 4, then 2 tasks of cost 2 can run at a time, or 4 tasks of cost 1)
   * @prop {Logger} logger - The task manager logger.
   */
  constructor(opts) {
    (0, _defineProperty2.default)(this, "maxWorkers", 0);
    (0, _defineProperty2.default)(this, "tasksInPool", new Map());
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "load$", new _rxjs.Subject());
    (0, _defineProperty2.default)(this, "run", async tasks => {
      const [tasksToRun, leftOverTasks] = partitionListByCount(tasks, this.availableWorkers);
      if (tasksToRun.length) {
        await Promise.all(tasksToRun.filter(taskRunner => !Array.from(this.tasksInPool.keys()).some(executionId => taskRunner.isSameTask(executionId))).map(async taskRunner => {
          // We use taskRunner.taskExecutionId instead of taskRunner.id as key for the task pool map because
          // task cancellation is a non-blocking procedure. We calculate the expiration and immediately remove
          // the task from the task pool. There is a race condition that can occur when a recurring tasks's schedule
          // matches its timeout value. A new instance of the task can be claimed and added to the task pool before
          // the cancel function (meant for the previous instance of the task) is actually called. This means the wrong
          // task instance is cancelled. We introduce the taskExecutionId to differentiate between these overlapping instances and
          // ensure that the correct task instance is cancelled.
          this.tasksInPool.set(taskRunner.taskExecutionId, taskRunner);
          return taskRunner.markTaskAsRunning().then(hasTaskBeenMarkAsRunning => hasTaskBeenMarkAsRunning ? this.handleMarkAsRunning(taskRunner) : this.handleFailureOfMarkAsRunning(taskRunner, {
            name: 'TaskPoolVersionConflictError',
            message: VERSION_CONFLICT_MESSAGE
          })).catch(err => this.handleFailureOfMarkAsRunning(taskRunner, err));
        }));
      }
      if (leftOverTasks.length) {
        if (this.availableWorkers) {
          return this.run(leftOverTasks);
        }
        return TaskPoolRunResult.RanOutOfCapacity;
      } else if (!this.availableWorkers) {
        return TaskPoolRunResult.RunningAtCapacity;
      }
      return TaskPoolRunResult.RunningAllClaimedTasks;
    });
    this.logger = opts.logger;
    opts.maxWorkers$.subscribe(maxWorkers => {
      this.logger.debug(`Task pool now using ${maxWorkers} as the max worker value`);
      this.maxWorkers = maxWorkers;
    });
  }
  get load() {
    return this.load$;
  }

  /**
   * Gets how many workers are currently in use.
   */
  get occupiedWorkers() {
    return this.tasksInPool.size;
  }

  /**
   * Gets % of workers in use
   */
  get workerLoad() {
    return this.maxWorkers ? Math.round(this.occupiedWorkers * 100 / this.maxWorkers) : 100;
  }

  /**
   * Gets how many workers are currently available.
   */
  get availableWorkers() {
    // cancel expired task whenever a call is made to check for capacity
    // this ensures that we don't end up with a queue of hung tasks causing both
    // the poller and the pool from hanging due to lack of capacity
    this.cancelExpiredTasks();
    return this.maxWorkers - this.occupiedWorkers;
  }

  /**
   * Gets how many workers are currently in use by type.
   */
  getOccupiedWorkersByType(type) {
    return [...this.tasksInPool.values()].reduce((count, runningTask) => runningTask.definition.type === type ? ++count : count, 0);
  }

  /**
   * Attempts to run the specified list of tasks. Returns true if it was able
   * to start every task in the list, false if there was not enough capacity
   * to run every task.
   *
   * @param {TaskRunner[]} tasks
   * @returns {Promise<boolean>}
   */

  cancelRunningTasks() {
    this.logger.debug('Cancelling running tasks.');
    for (const task of this.tasksInPool.values()) {
      this.cancelTask(task);
    }
  }
  handleMarkAsRunning(taskRunner) {
    taskRunner.run().catch(err => {
      // If a task Saved Object can't be found by an in flight task runner
      // we asssume the underlying task has been deleted while it was running
      // so we will log this as a debug, rather than a warn
      const errorLogLine = `Task ${taskRunner.toString()} failed in attempt to run: ${err.message}`;
      if ((0, _is_task_not_found_error.isTaskSavedObjectNotFoundError)(err, taskRunner.id)) {
        this.logger.debug(errorLogLine);
      } else {
        this.logger.warn(errorLogLine);
      }
    }).then(() => {
      this.tasksInPool.delete(taskRunner.taskExecutionId);
    });
  }
  handleFailureOfMarkAsRunning(task, err) {
    this.tasksInPool.delete(task.taskExecutionId);
    this.logger.error(`Failed to mark Task ${task.toString()} as running: ${err.message}`);
  }
  cancelExpiredTasks() {
    for (const taskRunner of this.tasksInPool.values()) {
      if (taskRunner.isExpired) {
        this.logger.warn(`Cancelling task ${taskRunner.toString()} as it expired at ${taskRunner.expiration.toISOString()}${taskRunner.startedAt ? ` after running for ${durationAsString(_moment.default.duration((0, _moment.default)(new Date()).utc().diff(taskRunner.startedAt)))}` : ``}${taskRunner.definition.timeout ? ` (with timeout set at ${taskRunner.definition.timeout})` : ``}.`);
        this.cancelTask(taskRunner);
      }
    }
  }
  async cancelTask(task) {
    try {
      this.logger.debug(`Cancelling task ${task.toString()}.`);
      this.tasksInPool.delete(task.taskExecutionId);
      await task.cancel();
    } catch (err) {
      this.logger.error(`Failed to cancel task ${task.toString()}: ${err}`);
    }
  }
}
exports.TaskPool = TaskPool;
function partitionListByCount(list, count) {
  const listInCount = list.splice(0, count);
  return [listInCount, list];
}
function durationAsString(duration) {
  const [m, s] = [duration.minutes(), duration.seconds()].map(value => (0, _lodash.padStart)(`${value}`, 2, '0'));
  return `${m}m ${s}s`;
}