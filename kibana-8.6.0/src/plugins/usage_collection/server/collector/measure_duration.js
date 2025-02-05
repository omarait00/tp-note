"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.perfTimerify = exports.createPerformanceObsHook = void 0;
var _perf_hooks = require("perf_hooks");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const createPerformanceObsHook = () => {
  const marks = {};
  const obs = new _perf_hooks.PerformanceObserver(items => {
    for (const {
      duration,
      name
    } of items.getEntries()) {
      marks[name] = duration;
    }
    _perf_hooks.performance.clearMarks();
  });
  obs.observe({
    entryTypes: ['function']
  });

  // teardown function returns the marked measurements.
  // returning the data after teardown ensures that we proprely teardown
  // the observer.
  return () => {
    obs.disconnect();
    return marks;
  };
};

/**
 * A wrapper around performance.timerify which defined the name of the returned
 * wrapped function to help identify observed function types inside the `PerformanceObserver`.
 *
 * @param name name of the function used to track the performance of the function execution
 * @param fn the function to be wrapped by the performance.timerify method.
 * @returns
 */
exports.createPerformanceObsHook = createPerformanceObsHook;
const perfTimerify = (name, fn) => {
  return _perf_hooks.performance.timerify(Object.defineProperty(fn, 'name', {
    value: name
  }));
};
exports.perfTimerify = perfTimerify;