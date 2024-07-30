"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExecutablesAndStackTraces = getExecutablesAndStackTraces;
var _common = require("../../common");
var _with_profiling_span = require("../utils/with_profiling_span");
var _downsampling = require("./downsampling");
var _stacktrace = require("./stacktrace");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getExecutablesAndStackTraces({
  logger,
  client,
  filter,
  sampleSize
}) {
  return (0, _with_profiling_span.withProfilingSpan)('get_executables_and_stack_traces', async () => {
    const eventsIndex = await (0, _downsampling.findDownsampledIndex)({
      logger,
      client,
      index: _common.INDEX_EVENTS,
      filter,
      sampleSize
    });
    const {
      totalCount,
      stackTraceEvents
    } = await (0, _stacktrace.searchEventsGroupByStackTrace)({
      logger,
      client,
      index: eventsIndex,
      filter
    });

    // Manual downsampling if totalCount exceeds sampleSize by 10%.
    let p = 1.0;
    if (totalCount > sampleSize * 1.1) {
      p = sampleSize / totalCount;
      logger.info('downsampling events with p=' + p);
      const t0 = Date.now();
      const downsampledTotalCount = (0, _downsampling.downsampleEventsRandomly)(stackTraceEvents, p, filter.toString());
      logger.info(`downsampling events took ${Date.now() - t0} ms`);
      logger.info('downsampled total count: ' + downsampledTotalCount);
      logger.info('unique downsampled stacktraces: ' + stackTraceEvents.size);
    }

    // Adjust the sample counts from down-sampled to fully sampled.
    // Be aware that downsampling drops entries from stackTraceEvents, so that
    // the sum of the upscaled count values is less that totalCount.
    for (const [id, count] of stackTraceEvents) {
      stackTraceEvents.set(id, Math.floor(count / (eventsIndex.sampleRate * p)));
    }
    const {
      stackTraces,
      totalFrames,
      stackFrameDocIDs,
      executableDocIDs
    } = await (0, _stacktrace.mgetStackTraces)({
      logger,
      client,
      events: stackTraceEvents
    });
    return (0, _with_profiling_span.withProfilingSpan)('get_stackframes_and_executables', () => Promise.all([(0, _stacktrace.mgetStackFrames)({
      logger,
      client,
      stackFrameIDs: stackFrameDocIDs
    }), (0, _stacktrace.mgetExecutables)({
      logger,
      client,
      executableIDs: executableDocIDs
    })])).then(([stackFrames, executables]) => {
      return {
        stackTraces,
        executables,
        stackFrames,
        stackTraceEvents,
        totalCount,
        totalFrames,
        eventsIndex
      };
    });
  });
}