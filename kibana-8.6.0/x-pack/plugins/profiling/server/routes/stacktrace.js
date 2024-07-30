"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearExecutableCache = clearExecutableCache;
exports.clearStackFrameCache = clearStackFrameCache;
exports.decodeStackTrace = decodeStackTrace;
exports.mgetExecutables = mgetExecutables;
exports.mgetStackFrames = mgetStackFrames;
exports.mgetStackTraces = mgetStackTraces;
exports.searchEventsGroupByStackTrace = searchEventsGroupByStackTrace;
var _lruCache = _interopRequireDefault(require("lru-cache"));
var _common = require("../../common");
var _elasticsearch = require("../../common/elasticsearch");
var _profiling = require("../../common/profiling");
var _run_length_encoding = require("../../common/run_length_encoding");
var _with_profiling_span = require("../utils/with_profiling_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const BASE64_FRAME_ID_LENGTH = 32;
const CACHE_MAX_ITEMS = 100000;
const CACHE_TTL_MILLISECONDS = 1000 * 60 * 5;
// decodeStackTrace unpacks an encoded stack trace from Elasticsearch
function decodeStackTrace(input) {
  const inputFrameIDs = input.Stacktrace.frame.ids;
  const inputFrameTypes = input.Stacktrace.frame.types;
  const countsFrameIDs = inputFrameIDs.length / BASE64_FRAME_ID_LENGTH;
  const fileIDs = new Array(countsFrameIDs);
  const frameIDs = new Array(countsFrameIDs);
  const addressOrLines = new Array(countsFrameIDs);

  // Step 1: Convert the base64-encoded frameID list into two separate
  // lists (frame IDs and file IDs), both of which are also base64-encoded.
  //
  // To get the frame ID, we grab the next 32 bytes.
  //
  // To get the file ID, we grab the first 22 bytes of the frame ID.
  // However, since the file ID is base64-encoded using 21.33 bytes
  // (16 * 4 / 3), then the 22 bytes have an extra 4 bits from the
  // address (see diagram in definition of EncodedStackTrace).
  for (let i = 0, pos = 0; i < countsFrameIDs; i++, pos += BASE64_FRAME_ID_LENGTH) {
    const frameID = inputFrameIDs.slice(pos, pos + BASE64_FRAME_ID_LENGTH);
    frameIDs[i] = frameID;
    fileIDs[i] = (0, _profiling.getFileIDFromStackFrameID)(frameID);
    addressOrLines[i] = (0, _profiling.getAddressFromStackFrameID)(frameID);
  }

  // Step 2: Convert the run-length byte encoding into a list of uint8s.
  const typeIDs = (0, _run_length_encoding.runLengthDecodeBase64Url)(inputFrameTypes, inputFrameTypes.length, countsFrameIDs);
  return {
    AddressOrLines: addressOrLines,
    FileIDs: fileIDs,
    FrameIDs: frameIDs,
    Types: typeIDs
  };
}
async function searchEventsGroupByStackTrace({
  logger,
  client,
  index,
  filter
}) {
  var _resEvents$aggregatio, _resEvents$aggregatio2, _resEvents$aggregatio3, _resEvents$aggregatio4;
  const resEvents = await client.search('get_events_group_by_stack_trace', {
    index: index.name,
    track_total_hits: false,
    query: filter,
    aggs: {
      group_by: {
        terms: {
          // 'size' should be max 100k, but might be slightly more. Better be on the safe side.
          size: 150000,
          field: _elasticsearch.ProfilingESField.StacktraceID,
          // 'execution_hint: map' skips the slow building of ordinals that we don't need.
          // Especially with high cardinality fields, this makes aggregations really slow.
          // E.g. it reduces the latency from 70s to 0.7s on our 8.1. MVP cluster (as of 28.04.2022).
          execution_hint: 'map'
        },
        aggs: {
          count: {
            sum: {
              field: _elasticsearch.ProfilingESField.StacktraceCount
            }
          }
        }
      },
      total_count: {
        sum: {
          field: _elasticsearch.ProfilingESField.StacktraceCount
        }
      }
    },
    pre_filter_shard_size: 1,
    filter_path: 'aggregations.group_by.buckets.key,aggregations.group_by.buckets.count,aggregations.total_count,_shards.failures'
  });
  const totalCount = (_resEvents$aggregatio = (_resEvents$aggregatio2 = resEvents.aggregations) === null || _resEvents$aggregatio2 === void 0 ? void 0 : _resEvents$aggregatio2.total_count.value) !== null && _resEvents$aggregatio !== void 0 ? _resEvents$aggregatio : 0;
  const stackTraceEvents = new Map();
  (_resEvents$aggregatio3 = resEvents.aggregations) === null || _resEvents$aggregatio3 === void 0 ? void 0 : (_resEvents$aggregatio4 = _resEvents$aggregatio3.group_by) === null || _resEvents$aggregatio4 === void 0 ? void 0 : _resEvents$aggregatio4.buckets.forEach(item => {
    var _item$count$value;
    const traceid = String(item.key);
    stackTraceEvents.set(traceid, (_item$count$value = item.count.value) !== null && _item$count$value !== void 0 ? _item$count$value : 0);
  });
  logger.info('events total count: ' + totalCount);
  logger.info('unique stacktraces: ' + stackTraceEvents.size);
  return {
    totalCount,
    stackTraceEvents
  };
}
function summarizeCacheAndQuery(logger, name, cacheHits, cacheTotal, queryHits, queryTotal) {
  logger.info(`found ${cacheHits} out of ${cacheTotal} ${name} in the cache`);
  if (cacheHits === cacheTotal) {
    return;
  }
  logger.info(`found ${queryHits} out of ${queryTotal} ${name}`);
  if (queryHits < queryTotal) {
    logger.info(`failed to find ${queryTotal - queryHits} ${name}`);
  }
}
const traceLRU = new _lruCache.default({
  max: 20000
});
async function mgetStackTraces({
  logger,
  client,
  events
}) {
  const stackTraceIDs = new Set([...events.keys()]);
  const stackTraces = new Map();
  let cacheHits = 0;
  let totalFrames = 0;
  const stackFrameDocIDs = new Set();
  const executableDocIDs = new Set();
  for (const stackTraceID of stackTraceIDs) {
    const stackTrace = traceLRU.get(stackTraceID);
    if (stackTrace) {
      cacheHits++;
      stackTraceIDs.delete(stackTraceID);
      stackTraces.set(stackTraceID, stackTrace);
      totalFrames += stackTrace.FrameIDs.length;
      for (const frameID of stackTrace.FrameIDs) {
        stackFrameDocIDs.add(frameID);
      }
      for (const fileID of stackTrace.FileIDs) {
        executableDocIDs.add(fileID);
      }
    }
  }
  if (stackTraceIDs.size === 0) {
    summarizeCacheAndQuery(logger, 'stacktraces', cacheHits, events.size, 0, 0);
    return {
      stackTraces,
      totalFrames,
      stackFrameDocIDs,
      executableDocIDs
    };
  }
  const stackResponses = await client.mget('mget_stacktraces', {
    index: _common.INDEX_TRACES,
    ids: [...stackTraceIDs],
    realtime: true,
    _source_includes: [_elasticsearch.ProfilingESField.StacktraceFrameIDs, _elasticsearch.ProfilingESField.StacktraceFrameTypes]
  });
  let queryHits = 0;
  const t0 = Date.now();
  await (0, _with_profiling_span.withProfilingSpan)('decode_stacktraces', async () => {
    for (const trace of stackResponses.docs) {
      if ('error' in trace) {
        continue;
      }
      // Sometimes we don't find the trace.
      // This is due to ES delays writing (data is not immediately seen after write).
      // Also, ES doesn't know about transactions.
      if (trace.found) {
        queryHits++;
        const traceid = trace._id;
        const stackTrace = decodeStackTrace(trace._source);
        stackTraces.set(traceid, stackTrace);
        traceLRU.set(traceid, stackTrace);
        totalFrames += stackTrace.FrameIDs.length;
        for (const frameID of stackTrace.FrameIDs) {
          stackFrameDocIDs.add(frameID);
        }
        for (const fileID of stackTrace.FileIDs) {
          executableDocIDs.add(fileID);
        }
      }
    }
  });
  logger.info(`processing data took ${Date.now() - t0} ms`);
  if (stackTraces.size !== 0) {
    logger.info('Average size of stacktrace: ' + totalFrames / stackTraces.size);
  }
  summarizeCacheAndQuery(logger, 'stacktraces', cacheHits, events.size, queryHits, stackTraceIDs.size);
  return {
    stackTraces,
    totalFrames,
    stackFrameDocIDs,
    executableDocIDs
  };
}
const frameLRU = new _lruCache.default({
  max: CACHE_MAX_ITEMS,
  maxAge: CACHE_TTL_MILLISECONDS
});

// clearStackFrameCache clears the entire cache and returns the number of deleted items
function clearStackFrameCache() {
  const numDeleted = frameLRU.length;
  frameLRU.reset();
  return numDeleted;
}
async function mgetStackFrames({
  logger,
  client,
  stackFrameIDs
}) {
  const stackFrames = new Map();
  let cacheHits = 0;
  const cacheTotal = stackFrameIDs.size;
  for (const stackFrameID of stackFrameIDs) {
    const stackFrame = frameLRU.get(stackFrameID);
    if (stackFrame) {
      cacheHits++;
      stackFrames.set(stackFrameID, stackFrame);
      stackFrameIDs.delete(stackFrameID);
    }
  }
  if (stackFrameIDs.size === 0) {
    summarizeCacheAndQuery(logger, 'frames', cacheHits, cacheTotal, 0, 0);
    return stackFrames;
  }
  const resStackFrames = await client.mget('mget_stackframes', {
    index: _common.INDEX_FRAMES,
    ids: [...stackFrameIDs],
    realtime: true
  });

  // Create a lookup map StackFrameID -> StackFrame.
  let queryHits = 0;
  const t0 = Date.now();
  const docs = resStackFrames.docs;
  for (const frame of docs) {
    if ('error' in frame) {
      continue;
    }
    if (frame.found) {
      var _Stackframe$file, _Stackframe$function, _Stackframe$function2, _Stackframe$line, _Stackframe$source;
      queryHits++;
      const stackFrame = {
        FileName: (_Stackframe$file = frame._source.Stackframe.file) === null || _Stackframe$file === void 0 ? void 0 : _Stackframe$file.name,
        FunctionName: (_Stackframe$function = frame._source.Stackframe.function) === null || _Stackframe$function === void 0 ? void 0 : _Stackframe$function.name,
        FunctionOffset: (_Stackframe$function2 = frame._source.Stackframe.function) === null || _Stackframe$function2 === void 0 ? void 0 : _Stackframe$function2.offset,
        LineNumber: (_Stackframe$line = frame._source.Stackframe.line) === null || _Stackframe$line === void 0 ? void 0 : _Stackframe$line.number,
        SourceType: (_Stackframe$source = frame._source.Stackframe.source) === null || _Stackframe$source === void 0 ? void 0 : _Stackframe$source.type
      };
      stackFrames.set(frame._id, stackFrame);
      frameLRU.set(frame._id, stackFrame);
      continue;
    }
    stackFrames.set(frame._id, _profiling.emptyStackFrame);
    frameLRU.set(frame._id, _profiling.emptyStackFrame);
  }
  logger.info(`processing data took ${Date.now() - t0} ms`);
  summarizeCacheAndQuery(logger, 'frames', cacheHits, cacheTotal, queryHits, stackFrameIDs.size);
  return stackFrames;
}
const executableLRU = new _lruCache.default({
  max: CACHE_MAX_ITEMS,
  maxAge: CACHE_TTL_MILLISECONDS
});

// clearExecutableCache clears the entire cache and returns the number of deleted items
function clearExecutableCache() {
  const numDeleted = executableLRU.length;
  executableLRU.reset();
  return numDeleted;
}
async function mgetExecutables({
  logger,
  client,
  executableIDs
}) {
  const executables = new Map();
  let cacheHits = 0;
  const cacheTotal = executableIDs.size;
  for (const fileID of executableIDs) {
    const executable = executableLRU.get(fileID);
    if (executable) {
      cacheHits++;
      executables.set(fileID, executable);
      executableIDs.delete(fileID);
    }
  }
  if (executableIDs.size === 0) {
    summarizeCacheAndQuery(logger, 'frames', cacheHits, cacheTotal, 0, 0);
    return executables;
  }
  const resExecutables = await client.mget('mget_executables', {
    index: _common.INDEX_EXECUTABLES,
    ids: [...executableIDs],
    _source_includes: [_elasticsearch.ProfilingESField.ExecutableFileName]
  });

  // Create a lookup map FileID -> Executable.
  let queryHits = 0;
  const t0 = Date.now();
  const docs = resExecutables.docs;
  for (const exe of docs) {
    if ('error' in exe) {
      continue;
    }
    if (exe.found) {
      queryHits++;
      const executable = {
        FileName: exe._source.Executable.file.name
      };
      executables.set(exe._id, executable);
      executableLRU.set(exe._id, executable);
      continue;
    }
    executables.set(exe._id, _profiling.emptyExecutable);
    executableLRU.set(exe._id, _profiling.emptyExecutable);
  }
  logger.info(`processing data took ${Date.now() - t0} ms`);
  summarizeCacheAndQuery(logger, 'executables', cacheHits, cacheTotal, queryHits, executableIDs.size);
  return executables;
}