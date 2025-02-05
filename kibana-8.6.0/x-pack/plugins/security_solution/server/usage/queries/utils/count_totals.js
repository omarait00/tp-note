"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.countTotals = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Given an array of cardinalities this will count them and return the total.
 * You can use this to count failures, partial failures, successes, etc...
 * @example
 * ```ts
 * const failed = countTotals([
 *   eqlFailure,
 *   indicatorFailure,
 *   mlFailure,
 *   queryFailure,
 *   savedQueryFailure,
 *   thresholdFailure,
 * ]),
 * ```
 * @param countCardinalities Array of cardinalities to count.
 * @returns The count or zero if the cardinalities do not exist or it is an empty array.
 */
const countTotals = countCardinalities => {
  return countCardinalities.reduce((accum, countCardinality) => {
    if (countCardinality.cardinality.value != null) {
      return countCardinality.cardinality.value + accum;
    } else {
      return accum;
    }
  }, 0);
};
exports.countTotals = countTotals;