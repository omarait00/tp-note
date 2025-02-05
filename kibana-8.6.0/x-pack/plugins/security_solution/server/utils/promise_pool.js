"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initPromisePool = void 0;
var _common = require("../../../../../src/plugins/kibana_utils/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Runs promises in batches. It ensures that the number of running async tasks
 * doesn't exceed the concurrency parameter passed to the function.
 *
 * @param concurrency - number of tasks run in parallel
 * @param items - array of items to be passes to async executor
 * @param executor - an async function to be called with each provided item
 * @param abortSignal - AbortSignal a signal object that allows to abort executing actions
 *
 * @returns Struct holding results or errors of async tasks, aborted executions count if applicable
 */

const initPromisePool = async ({
  concurrency = 1,
  items,
  executor,
  abortSignal
}) => {
  const tasks = [];
  const outcome = {
    results: [],
    errors: []
  };
  for (const item of items) {
    // Check if the pool is full
    if (tasks.length >= concurrency) {
      // Wait for any first task to finish
      await Promise.race(tasks);
    }
    const executeItem = async () => {
      // if abort signal was sent stop processing tasks further
      if ((abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted) === true) {
        throw new _common.AbortError();
      }
      return executor(item);
    };
    const task = executeItem().then(result => {
      outcome.results.push({
        item,
        result
      });
    }).catch(async error => {
      outcome.errors.push({
        item,
        error
      });
    }).finally(() => {
      tasks.splice(tasks.indexOf(task), 1);
    });
    tasks.push(task);
  }

  // Wait for all remaining tasks to finish
  await Promise.all(tasks);
  return outcome;
};
exports.initPromisePool = initPromisePool;