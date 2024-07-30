"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.downsampleEventsRandomly = downsampleEventsRandomly;
exports.findDownsampledIndex = findDownsampledIndex;
exports.getSampledTraceEventsIndex = getSampledTraceEventsIndex;
var _seedrandom = _interopRequireDefault(require("seedrandom"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getFullDownsampledIndex(index, pow, factor) {
  const downsampledIndexPrefix = index.replaceAll('-all', '') + '-' + factor + 'pow';
  return downsampledIndexPrefix + pow.toString().padStart(2, '0');
}

// Return the index that has between targetSampleSize..targetSampleSize*samplingFactor entries.
// The starting point is the number of entries from the profiling-events-5pow<initialExp> index.
//
// More details on how the down-sampling works can be found at the write path
//   https://github.com/elastic/prodfiler/blob/bdcc2711c6cd7e89d63b58a17329fb9fdbabe008/pf-elastic-collector/elastic.go
function getSampledTraceEventsIndex(index, targetSampleSize, sampleCountFromInitialExp, initialExp) {
  const maxExp = 11;
  const samplingFactor = 5;
  const fullEventsIndex = {
    name: index,
    sampleRate: 1
  };
  if (sampleCountFromInitialExp === 0) {
    // Take the shortcut to the full events index.
    return fullEventsIndex;
  }
  let pow = Math.floor(initialExp - Math.log(targetSampleSize * samplingFactor / sampleCountFromInitialExp) / Math.log(5) + 1);
  if (pow < 1) {
    return fullEventsIndex;
  }
  if (pow > maxExp) {
    pow = maxExp;
  }
  return {
    name: getFullDownsampledIndex(index, pow, samplingFactor),
    sampleRate: 1 / samplingFactor ** pow
  };
}
async function findDownsampledIndex({
  logger,
  client,
  index,
  filter,
  sampleSize
}) {
  // Start with counting the results in the index down-sampled by 5^6.
  // That is in the middle of our down-sampled indexes.
  const initialExp = 6;
  let sampleCountFromInitialExp = 0;
  try {
    const resp = await client.search('find_downsampled_index', {
      index: getFullDownsampledIndex(index, initialExp, 5),
      body: {
        query: filter,
        size: 0,
        track_total_hits: true
      }
    });
    sampleCountFromInitialExp = resp.hits.total.value;
  } catch (e) {
    logger.info(e.message);
  }
  logger.info('sampleCountFromPow6 ' + sampleCountFromInitialExp);
  return getSampledTraceEventsIndex(index, sampleSize, sampleCountFromInitialExp, initialExp);
}
function downsampleEventsRandomly(stackTraceEvents, p, seed) {
  let totalCount = 0;

  // Make the RNG predictable to get reproducible results.
  const random = (0, _seedrandom.default)(seed);
  for (const [id, count] of stackTraceEvents) {
    let newCount = 0;
    for (let i = 0; i < count; i++) {
      if (random() < p) {
        newCount++;
      }
    }
    if (newCount) {
      stackTraceEvents.set(id, newCount);
      totalCount += newCount;
    } else {
      stackTraceEvents.delete(id);
    }
  }
  return totalCount;
}