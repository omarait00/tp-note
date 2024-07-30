"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isClaimOwnershipResult = exports.TaskClaiming = exports.TASK_MANAGER_MARK_AS_CLAIMED = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));
var _minimatch = _interopRequireDefault(require("minimatch"));
var _rxjs = require("rxjs");
var _operators = require("rxjs/operators");
var _lodash = require("lodash");
var _result_type = require("../lib/result_type");
var _task_events = require("../task_events");
var _query_clauses = require("./query_clauses");
var _mark_available_tasks_as_claimed = require("./mark_available_tasks_as_claimed");
var _task_store = require("../task_store");
var _fill_pool = require("../lib/fill_pool");
var _task_running = require("../task_running");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * This module contains helpers for managing the task manager storage layer.
 */

const isClaimOwnershipResult = result => (0, _lodash.isPlainObject)(result.stats) && Array.isArray(result.docs);
exports.isClaimOwnershipResult = isClaimOwnershipResult;
var BatchConcurrency;
(function (BatchConcurrency) {
  BatchConcurrency[BatchConcurrency["Unlimited"] = 0] = "Unlimited";
  BatchConcurrency[BatchConcurrency["Limited"] = 1] = "Limited";
})(BatchConcurrency || (BatchConcurrency = {}));
const TASK_MANAGER_MARK_AS_CLAIMED = 'mark-available-tasks-as-claimed';
exports.TASK_MANAGER_MARK_AS_CLAIMED = TASK_MANAGER_MARK_AS_CLAIMED;
class TaskClaiming {
  /**
   * Constructs a new TaskStore.
   * @param {TaskClaimingOpts} opts
   * @prop {number} maxAttempts - The maximum number of attempts before a task will be abandoned
   * @prop {TaskDefinition} definition - The definition of the task being run
   */
  constructor(opts) {
    (0, _defineProperty2.default)(this, "errors$", new _rxjs.Subject());
    (0, _defineProperty2.default)(this, "maxAttempts", void 0);
    (0, _defineProperty2.default)(this, "definitions", void 0);
    (0, _defineProperty2.default)(this, "events$", void 0);
    (0, _defineProperty2.default)(this, "taskStore", void 0);
    (0, _defineProperty2.default)(this, "getCapacity", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "taskClaimingBatchesByType", void 0);
    (0, _defineProperty2.default)(this, "taskMaxAttempts", void 0);
    (0, _defineProperty2.default)(this, "excludedTaskTypes", void 0);
    (0, _defineProperty2.default)(this, "unusedTypes", void 0);
    (0, _defineProperty2.default)(this, "claimingBatchIndex", 0);
    (0, _defineProperty2.default)(this, "emitEvents", events => {
      events.forEach(event => this.events$.next(event));
    });
    (0, _defineProperty2.default)(this, "executeClaimAvailableTasks", async ({
      claimOwnershipUntil,
      size,
      taskTypes
    }) => {
      const {
        updated: tasksUpdated,
        version_conflicts: tasksConflicted
      } = await this.markAvailableTasksAsClaimed({
        claimOwnershipUntil,
        size,
        taskTypes
      });
      const docs = tasksUpdated > 0 ? await this.sweepForClaimedTasks(taskTypes, size) : [];
      this.emitEvents(docs.map(doc => (0, _task_events.asTaskClaimEvent)(doc.id, (0, _result_type.asOk)(doc))));
      const stats = {
        tasksUpdated,
        tasksConflicted,
        tasksClaimed: docs.length
      };
      return {
        stats,
        docs
      };
    });
    this.definitions = opts.definitions;
    this.maxAttempts = opts.maxAttempts;
    this.taskStore = opts.taskStore;
    this.getCapacity = opts.getCapacity;
    this.logger = opts.logger;
    this.taskClaimingBatchesByType = this.partitionIntoClaimingBatches(this.definitions);
    this.taskMaxAttempts = Object.fromEntries(this.normalizeMaxAttempts(this.definitions));
    this.excludedTaskTypes = opts.excludedTaskTypes;
    this.unusedTypes = opts.unusedTypes;
    this.events$ = new _rxjs.Subject();
  }
  partitionIntoClaimingBatches(definitions) {
    const {
      limitedConcurrency,
      unlimitedConcurrency,
      skippedTypes
    } = (0, _lodash.groupBy)(definitions.getAllDefinitions(), definition => definition.maxConcurrency ? 'limitedConcurrency' : definition.maxConcurrency === 0 ? 'skippedTypes' : 'unlimitedConcurrency');
    if (skippedTypes !== null && skippedTypes !== void 0 && skippedTypes.length) {
      this.logger.info(`Task Manager will never claim tasks of the following types as their "maxConcurrency" is set to 0: ${skippedTypes.map(({
        type
      }) => type).join(', ')}`);
    }
    return [...(unlimitedConcurrency ? [asUnlimited(new Set(unlimitedConcurrency.map(({
      type
    }) => type)))] : []), ...(limitedConcurrency ? limitedConcurrency.map(({
      type
    }) => asLimited(type)) : [])];
  }
  normalizeMaxAttempts(definitions) {
    return new Map([...definitions].map(([type, {
      maxAttempts
    }]) => [type, maxAttempts || this.maxAttempts]));
  }
  getClaimingBatches() {
    // return all batches, starting at index and cycling back to where we began
    const batch = [...this.taskClaimingBatchesByType.slice(this.claimingBatchIndex), ...this.taskClaimingBatchesByType.slice(0, this.claimingBatchIndex)];
    // shift claimingBatchIndex by one so that next cycle begins at the next index
    this.claimingBatchIndex = (this.claimingBatchIndex + 1) % this.taskClaimingBatchesByType.length;
    return batch;
  }
  get events() {
    return this.events$;
  }
  claimAvailableTasksIfCapacityIsAvailable(claimingOptions) {
    if (this.getCapacity()) {
      return this.claimAvailableTasks(claimingOptions).pipe((0, _operators.map)(claimResult => (0, _result_type.asOk)(claimResult)));
    }
    this.logger.debug(`[Task Ownership]: Task Manager has skipped Claiming Ownership of available tasks at it has ran out Available Workers.`);
    return (0, _rxjs.of)((0, _result_type.asErr)(_fill_pool.FillPoolResult.NoAvailableWorkers));
  }
  claimAvailableTasks({
    claimOwnershipUntil
  }) {
    const initialCapacity = this.getCapacity();
    return (0, _rxjs.from)(this.getClaimingBatches()).pipe((0, _operators.mergeScan)((accumulatedResult, batch) => {
      const stopTaskTimer = (0, _task_events.startTaskTimer)();
      const capacity = Math.min(initialCapacity - accumulatedResult.stats.tasksClaimed, isLimited(batch) ? this.getCapacity(batch.tasksTypes) : this.getCapacity());
      // if we have no more capacity, short circuit here
      if (capacity <= 0) {
        return (0, _rxjs.of)(accumulatedResult);
      }
      return (0, _rxjs.from)(this.executeClaimAvailableTasks({
        claimOwnershipUntil,
        size: capacity,
        taskTypes: isLimited(batch) ? new Set([batch.tasksTypes]) : batch.tasksTypes
      }).then(result => {
        const {
          stats,
          docs
        } = accumulateClaimOwnershipResults(accumulatedResult, result);
        stats.tasksConflicted = (0, _task_store.correctVersionConflictsForContinuation)(stats.tasksClaimed, stats.tasksConflicted, initialCapacity);
        return {
          stats,
          docs,
          timing: stopTaskTimer()
        };
      }));
    },
    // initialise the accumulation with no results
    accumulateClaimOwnershipResults(),
    // only run one batch at a time
    1));
  }
  isTaskTypeExcluded(taskType) {
    for (const excludedType of this.excludedTaskTypes) {
      if ((0, _minimatch.default)(taskType, excludedType)) {
        return true;
      }
    }
    return false;
  }
  async markAvailableTasksAsClaimed({
    claimOwnershipUntil,
    size,
    taskTypes
  }) {
    const {
      taskTypesToSkip = [],
      taskTypesToClaim = []
    } = (0, _lodash.groupBy)(this.definitions.getAllTypes(), type => taskTypes.has(type) && !this.isTaskTypeExcluded(type) ? 'taskTypesToClaim' : 'taskTypesToSkip');
    const queryForScheduledTasks = (0, _query_clauses.mustBeAllOf)(
    // Task must be enabled
    _mark_available_tasks_as_claimed.EnabledTask,
    // Either a task with idle status and runAt <= now or
    // status running or claiming with a retryAt <= now.
    (0, _query_clauses.shouldBeOneOf)(_mark_available_tasks_as_claimed.IdleTaskWithExpiredRunAt, _mark_available_tasks_as_claimed.RunningOrClaimingTaskWithExpiredRetryAt));
    const sort = [_mark_available_tasks_as_claimed.SortByRunAtAndRetryAt];
    const query = (0, _query_clauses.matchesClauses)(queryForScheduledTasks, (0, _query_clauses.filterDownBy)(_mark_available_tasks_as_claimed.InactiveTasks));
    const script = (0, _mark_available_tasks_as_claimed.updateFieldsAndMarkAsFailed)({
      fieldUpdates: {
        ownerId: this.taskStore.taskManagerId,
        retryAt: claimOwnershipUntil
      },
      claimableTaskTypes: taskTypesToClaim,
      skippedTaskTypes: taskTypesToSkip,
      unusedTaskTypes: this.unusedTypes,
      taskMaxAttempts: (0, _lodash.pick)(this.taskMaxAttempts, taskTypesToClaim)
    });
    const apmTrans = _elasticApmNode.default.startTransaction(TASK_MANAGER_MARK_AS_CLAIMED, _task_running.TASK_MANAGER_TRANSACTION_TYPE);
    try {
      const result = await this.taskStore.updateByQuery({
        query,
        script,
        sort
      }, {
        max_docs: size
      });
      apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.end('success');
      return result;
    } catch (err) {
      apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.end('failure');
      throw err;
    }
  }

  /**
   * Fetches tasks from the index, which are owned by the current Kibana instance
   */
  async sweepForClaimedTasks(taskTypes, size) {
    const claimedTasksQuery = (0, _mark_available_tasks_as_claimed.tasksClaimedByOwner)(this.taskStore.taskManagerId, (0, _mark_available_tasks_as_claimed.tasksOfType)([...taskTypes]));
    const {
      docs
    } = await this.taskStore.fetch({
      query: claimedTasksQuery,
      size,
      sort: _mark_available_tasks_as_claimed.SortByRunAtAndRetryAt,
      seq_no_primary_term: true
    });
    return docs;
  }
}
exports.TaskClaiming = TaskClaiming;
const emptyClaimOwnershipResult = () => {
  return {
    stats: {
      tasksUpdated: 0,
      tasksConflicted: 0,
      tasksClaimed: 0,
      tasksRejected: 0
    },
    docs: []
  };
};
function accumulateClaimOwnershipResults(prev = emptyClaimOwnershipResult(), next) {
  if (next) {
    const {
      stats,
      docs,
      timing
    } = next;
    const res = {
      stats: {
        tasksUpdated: stats.tasksUpdated + prev.stats.tasksUpdated,
        tasksConflicted: stats.tasksConflicted + prev.stats.tasksConflicted,
        tasksClaimed: stats.tasksClaimed + prev.stats.tasksClaimed
      },
      docs,
      timing
    };
    return res;
  }
  return prev;
}
function isLimited(batch) {
  return batch.concurrency === BatchConcurrency.Limited;
}
function asLimited(tasksType) {
  return {
    concurrency: BatchConcurrency.Limited,
    tasksTypes: tasksType
  };
}
function asUnlimited(tasksTypes) {
  return {
    concurrency: BatchConcurrency.Unlimited,
    tasksTypes
  };
}