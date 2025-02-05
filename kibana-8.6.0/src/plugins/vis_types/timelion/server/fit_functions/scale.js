"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = scale;
var _lodash = _interopRequireDefault(require("lodash"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

// Downsampling of cumulative metrics
// Good: count, sum
// Bad: avg, min, max

// For upsampling cumulative metrics (eg sum from 1M to 1d), could rename this scale.
// Really only the 0s that screws this up, need to distribute contents of spikes to empty buckets
// Empty is currently 0, which is not right

function sum(set) {
  return _lodash.default.reduce(set, function (sum, num) {
    return sum + num;
  }, 0);
}
function scale(dataTuples, targetTuples) {
  let i = 0;
  let j = 0;
  let spreadCount = 0;
  const result = [];
  let bucket;
  let time;
  let scaleSet;
  let step;
  let nextRealNumber;
  while (i < targetTuples.length) {
    scaleSet = [];
    bucket = targetTuples[i];
    time = bucket[0];

    // Find stuff to sum
    j = 0;
    while (j < dataTuples.length && Math.abs(dataTuples[j][0] <= time)) {
      scaleSet.push(dataTuples[j][1]);
      j++;
    }
    dataTuples.splice(0, j);

    // We hit a real number, or the end
    if (scaleSet.length > 0 || i === targetTuples.length - 1) {
      nextRealNumber = sum(scaleSet);
      step = nextRealNumber;
      // Backfill null buckets
      if (spreadCount > 0) {
        // Naively distribute the nextRealNumber amongst the buckets
        // Without considering where it is headed next
        // We do spreadCount + 1 so that we include nextRealNumber when we smooth things out,
        // since we'll overwrite it anyway.
        // Thus [5, null, null, 30] becomes [5, 10, 10, 10]
        step = nextRealNumber / (spreadCount + 1);
        while (spreadCount > 0) {
          result[i - spreadCount][1] = step;
          spreadCount--;
        }
      }
      result.push([time, step]);
    } else {
      result.push([time, null]);
      spreadCount++;
    }
    i++;
  }
  return result;
}
module.exports = exports.default;