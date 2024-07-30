"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pollSearch = void 0;
var _rxjs = require("rxjs");
var _operators = require("rxjs/operators");
var _common = require("../../../kibana_utils/common");
var _ = require("..");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const pollSearch = (search, cancel, {
  pollInterval,
  abortSignal
} = {}) => {
  const getPollInterval = elapsedTime => {
    if (typeof pollInterval === 'number') return pollInterval;else {
      // if static pollInterval is not provided, then use default back-off logic
      switch (true) {
        case elapsedTime < 5000:
          return 1000;
        case elapsedTime < 20000:
          return 2500;
        default:
          return 5000;
      }
    }
  };
  return (0, _rxjs.defer)(() => {
    const startTime = Date.now();
    if (abortSignal !== null && abortSignal !== void 0 && abortSignal.aborted) {
      throw new _common.AbortError();
    }
    if (cancel) {
      abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.addEventListener('abort', cancel, {
        once: true
      });
    }
    const aborted$ = (abortSignal ? (0, _rxjs.fromEvent)(abortSignal, 'abort') : _rxjs.EMPTY).pipe((0, _operators.map)(() => {
      throw new _common.AbortError();
    }));
    return (0, _rxjs.from)(search()).pipe((0, _operators.expand)(() => {
      const elapsedTime = Date.now() - startTime;
      return (0, _rxjs.timer)(getPollInterval(elapsedTime)).pipe((0, _operators.switchMap)(search));
    }), (0, _operators.tap)(response => {
      if ((0, _.isErrorResponse)(response)) {
        throw response ? new Error('Received partial response') : new _common.AbortError();
      }
    }), (0, _operators.takeWhile)(_.isPartialResponse, true), (0, _operators.takeUntil)(aborted$));
  });
};
exports.pollSearch = pollSearch;