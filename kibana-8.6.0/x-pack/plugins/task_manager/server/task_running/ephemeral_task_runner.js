"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EphemeralTaskManagerRunner = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));
var _uuid = _interopRequireDefault(require("uuid"));
var _apmUtils = require("@kbn/apm-utils");
var _lodash = require("lodash");
var _result_type = require("../lib/result_type");
var _task_events = require("../task_events");
var _intervals = require("../lib/intervals");
var _task = require("../task");
var _task_runner = require("./task_runner");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * This module contains the core logic for running an individual task.
 * It handles the full lifecycle of a task run, including error handling,
 * rescheduling, middleware application, etc.
 */

/**
 *
 * @export
 * @class EphemeralTaskManagerRunner
 * @implements {TaskRunner}
 */
class EphemeralTaskManagerRunner {
  /**
   * Creates an instance of EphemeralTaskManagerRunner.
   * @param {Opts} opts
   * @prop {Logger} logger - The task manager logger
   * @prop {TaskDefinition} definition - The definition of the task being run
   * @prop {EphemeralTaskInstance} instance - The record describing this particular task instance
   * @prop {BeforeRunFunction} beforeRun - A function that adjusts the run context prior to running the task
   * @memberof TaskManagerRunner
   */
  constructor({
    instance,
    definitions,
    logger,
    beforeRun,
    beforeMarkRunning,
    onTaskEvent = _lodash.identity,
    executionContext
  }) {
    (0, _defineProperty2.default)(this, "task", void 0);
    (0, _defineProperty2.default)(this, "instance", void 0);
    (0, _defineProperty2.default)(this, "definitions", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "beforeRun", void 0);
    (0, _defineProperty2.default)(this, "beforeMarkRunning", void 0);
    (0, _defineProperty2.default)(this, "onTaskEvent", void 0);
    (0, _defineProperty2.default)(this, "uuid", void 0);
    (0, _defineProperty2.default)(this, "executionContext", void 0);
    this.instance = (0, _task_runner.asPending)(asConcreteInstance(sanitizeInstance(instance)));
    this.definitions = definitions;
    this.logger = logger;
    this.beforeRun = beforeRun;
    this.beforeMarkRunning = beforeMarkRunning;
    this.onTaskEvent = onTaskEvent;
    this.executionContext = executionContext;
    this.uuid = _uuid.default.v4();
  }

  /**
   * Gets the id of this task instance.
   */
  get id() {
    return this.instance.task.id;
  }

  /**
   * Gets the exeuction id of this task instance.
   */
  get taskExecutionId() {
    return `${this.id}::${this.uuid}`;
  }

  /**
   * Test whether given execution ID identifies a different execution of this same task
   * @param id
   */
  isSameTask(executionId) {
    return executionId.startsWith(this.id);
  }

  /**
   * Gets the task type of this task instance.
   */
  get taskType() {
    return this.instance.task.taskType;
  }

  /**
   * Get the stage this TaskRunner is at
   */
  get stage() {
    return this.instance.stage;
  }

  /**
   * Gets the task defintion from the dictionary.
   */
  get definition() {
    return this.definitions.get(this.taskType);
  }

  /**
   * Gets the time at which this task will expire.
   */
  get expiration() {
    return (0, _intervals.intervalFromDate)(
    // if the task is running, use it's started at, otherwise use the timestamp at
    // which it was last updated
    // this allows us to catch tasks that remain in Pending/Finalizing without being
    // cleaned up
    (0, _task_runner.isReadyToRun)(this.instance) ? this.instance.task.startedAt : this.instance.timestamp, this.definition.timeout);
  }

  /**
   * Gets the duration of the current task run
   */
  get startedAt() {
    return this.instance.task.startedAt;
  }

  /**
   * Gets whether or not this task has run longer than its expiration setting allows.
   */
  get isExpired() {
    return this.expiration < new Date();
  }
  get isEphemeral() {
    return true;
  }

  /**
   * Returns a log-friendly representation of this task.
   */
  toString() {
    return `${this.taskType} "${this.id}" (Ephemeral)`;
  }

  /**
   * Runs the task, handling the task result, errors, etc, rescheduling if need
   * be. NOTE: the time of applying the middleware's beforeRun is incorporated
   * into the total timeout time the task in configured with. We may decide to
   * start the timer after beforeRun resolves
   *
   * @returns {Promise<Result<SuccessfulRunResult, FailedRunResult>>}
   */
  async run() {
    if (!(0, _task_runner.isReadyToRun)(this.instance)) {
      throw new Error(`Running ephemeral task ${this} failed as it ${(0, _task_runner.isPending)(this.instance) ? `isn't ready to be ran` : `has already been ran`}`);
    }
    this.logger.debug(`Running ephemeral task ${this}`);
    const apmTrans = _elasticApmNode.default.startTransaction(this.taskType, _task_runner.TASK_MANAGER_RUN_TRANSACTION_TYPE, {
      childOf: this.instance.task.traceparent
    });
    apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.addLabels({
      ephemeral: true
    });
    const modifiedContext = await this.beforeRun({
      taskInstance: asConcreteInstance(this.instance.task)
    });
    const stopTaskTimer = (0, _task_events.startTaskTimer)();
    try {
      this.task = this.definition.createTaskRunner(modifiedContext);
      const ctx = {
        type: 'task manager',
        name: `run ephemeral ${this.instance.task.taskType}`,
        id: this.instance.task.id,
        description: 'run ephemeral task'
      };
      const result = await this.executionContext.withContext(ctx, () => (0, _apmUtils.withSpan)({
        name: 'ephemeral run',
        type: 'task manager'
      }, () => this.task.run()));
      const validatedResult = this.validateResult(result);
      const processedResult = await (0, _apmUtils.withSpan)({
        name: 'process ephemeral result',
        type: 'task manager'
      }, () => this.processResult(validatedResult, stopTaskTimer()));
      if (apmTrans) apmTrans.end('success');
      return processedResult;
    } catch (err) {
      this.logger.error(`Task ${this} failed: ${err}`);
      // in error scenario, we can not get the RunResult
      const processedResult = await (0, _apmUtils.withSpan)({
        name: 'process ephemeral result',
        type: 'task manager'
      }, () => this.processResult((0, _result_type.asErr)({
        error: err,
        state: modifiedContext.taskInstance.state
      }), stopTaskTimer()));
      if (apmTrans) apmTrans.end('failure');
      return processedResult;
    }
  }

  /**
   * Noop for Ephemeral tasks
   *
   * @returns {Promise<boolean>}
   */
  async markTaskAsRunning() {
    if (!(0, _task_runner.isPending)(this.instance)) {
      throw new Error(`Marking ephemeral task ${this} as running has failed as it ${(0, _task_runner.isReadyToRun)(this.instance) ? `is already running` : `has already been ran`}`);
    }
    const apmTrans = _elasticApmNode.default.startTransaction(_task_runner.TASK_MANAGER_TRANSACTION_TYPE_MARK_AS_RUNNING, _task_runner.TASK_MANAGER_TRANSACTION_TYPE);
    apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.addLabels({
      entityId: this.taskType
    });
    const now = new Date();
    try {
      const {
        taskInstance
      } = await this.beforeMarkRunning({
        taskInstance: asConcreteInstance(this.instance.task)
      });
      this.instance = (0, _task_runner.asReadyToRun)({
        ...taskInstance,
        status: _task.TaskStatus.Running,
        startedAt: now,
        attempts: taskInstance.attempts + 1,
        retryAt: null
      });
      if (apmTrans) apmTrans.end('success');
      this.onTaskEvent((0, _task_events.asTaskMarkRunningEvent)(this.id, (0, _result_type.asOk)(this.instance.task)));
      return true;
    } catch (error) {
      if (apmTrans) apmTrans.end('failure');
      this.onTaskEvent((0, _task_events.asTaskMarkRunningEvent)(this.id, (0, _result_type.asErr)(error)));
    }
    return false;
  }

  /**
   * Attempts to cancel the task.
   *
   * @returns {Promise<void>}
   */
  async cancel() {
    const {
      task
    } = this;
    if (task !== null && task !== void 0 && task.cancel) {
      // it will cause the task state of "running" to be cleared
      this.task = undefined;
      return task.cancel();
    }
    this.logger.debug(`The ephemral task ${this} is not cancellable.`);
  }
  validateResult(result) {
    return (0, _task.isFailedRunResult)(result) ? (0, _result_type.asErr)({
      ...result,
      error: result.error
    }) : (0, _result_type.asOk)(result || _task_runner.EMPTY_RUN_RESULT);
  }
  async processResult(result, taskTiming) {
    await (0, _result_type.eitherAsync)(result, async ({
      state
    }) => {
      this.onTaskEvent((0, _task_events.asTaskRunEvent)(this.id, (0, _result_type.asOk)({
        task: {
          ...this.instance.task,
          state
        },
        persistence: _task_events.TaskPersistence.Ephemeral,
        result: _task_runner.TaskRunResult.Success
      }), taskTiming));
    }, async ({
      error,
      state
    }) => {
      this.onTaskEvent((0, _task_events.asTaskRunEvent)(this.id, (0, _result_type.asErr)({
        task: {
          ...this.instance.task,
          state
        },
        persistence: _task_events.TaskPersistence.Ephemeral,
        result: _task_runner.TaskRunResult.Failed,
        error
      }), taskTiming));
    });
    return result;
  }
}
exports.EphemeralTaskManagerRunner = EphemeralTaskManagerRunner;
function sanitizeInstance(instance) {
  return {
    ...instance,
    params: instance.params || {},
    state: instance.state || {}
  };
}
function asConcreteInstance(instance) {
  return {
    ...instance,
    attempts: 0,
    retryAt: null
  };
}