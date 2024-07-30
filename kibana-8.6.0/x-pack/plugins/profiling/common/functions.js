"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TopNFunctionSortField = void 0;
exports.createTopNFunctions = createTopNFunctions;
exports.topNFunctionSortFieldRt = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _frame_group = require("./frame_group");
var _profiling = require("./profiling");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createTopNFunctions(events, stackTraces, stackFrames, executables, startIndex, endIndex) {
  // The `count` associated with a frame provides the total number of
  // traces in which that node has appeared at least once. However, a
  // frame may appear multiple times in a trace, and thus to avoid
  // counting it multiple times we need to record the frames seen so
  // far in each trace.
  let totalCount = 0;
  const topNFunctions = new Map();

  // Collect metadata and inclusive + exclusive counts for each distinct frame.
  for (const [stackTraceID, count] of events) {
    var _stackTraces$get;
    const uniqueFrameGroupsPerEvent = new Set();
    totalCount += count;

    // It is possible that we do not have a stacktrace for an event,
    // e.g. when stopping the host agent or on network errors.
    const stackTrace = (_stackTraces$get = stackTraces.get(stackTraceID)) !== null && _stackTraces$get !== void 0 ? _stackTraces$get : _profiling.emptyStackTrace;
    const lenStackTrace = stackTrace.FrameIDs.length;
    for (let i = 0; i < lenStackTrace; i++) {
      var _stackFrames$get, _executables$get;
      const frameID = stackTrace.FrameIDs[i];
      const fileID = stackTrace.FileIDs[i];
      const addressOrLine = stackTrace.AddressOrLines[i];
      const frame = (_stackFrames$get = stackFrames.get(frameID)) !== null && _stackFrames$get !== void 0 ? _stackFrames$get : _profiling.emptyStackFrame;
      const executable = (_executables$get = executables.get(fileID)) !== null && _executables$get !== void 0 ? _executables$get : _profiling.emptyExecutable;
      const frameGroupID = (0, _frame_group.createFrameGroupID)(fileID, addressOrLine, executable.FileName, frame.FileName, frame.FunctionName);
      let topNFunction = topNFunctions.get(frameGroupID);
      if (topNFunction === undefined) {
        const metadata = (0, _profiling.createStackFrameMetadata)({
          FrameID: frameID,
          FileID: fileID,
          AddressOrLine: addressOrLine,
          FrameType: stackTrace.Types[i],
          FunctionName: frame.FunctionName,
          FunctionOffset: frame.FunctionOffset,
          SourceLine: frame.LineNumber,
          SourceFilename: frame.FileName,
          ExeFileName: executable.FileName
        });
        topNFunction = {
          Frame: metadata,
          FrameGroupID: frameGroupID,
          CountExclusive: 0,
          CountInclusive: 0
        };
        topNFunctions.set(frameGroupID, topNFunction);
      }
      if (!uniqueFrameGroupsPerEvent.has(frameGroupID)) {
        uniqueFrameGroupsPerEvent.add(frameGroupID);
        topNFunction.CountInclusive += count;
      }
      if (i === lenStackTrace - 1) {
        // Leaf frame: sum up counts for exclusive CPU.
        topNFunction.CountExclusive += count;
      }
    }
  }

  // Sort in descending order by exclusive CPU. Same values should appear in a
  // stable order, so compare the FrameGroup in this case.
  const topN = [...topNFunctions.values()];
  topN.sort((a, b) => {
    if (a.CountExclusive > b.CountExclusive) {
      return 1;
    }
    if (a.CountExclusive < b.CountExclusive) {
      return -1;
    }
    return a.FrameGroupID.localeCompare(b.FrameGroupID);
  }).reverse();
  if (startIndex > topN.length) {
    startIndex = topN.length;
  }
  if (endIndex > topN.length) {
    endIndex = topN.length;
  }
  const framesAndCountsAndIds = topN.slice(startIndex, endIndex).map((frameAndCount, i) => ({
    Rank: i + 1,
    Frame: frameAndCount.Frame,
    CountExclusive: frameAndCount.CountExclusive,
    CountInclusive: frameAndCount.CountInclusive,
    Id: frameAndCount.FrameGroupID
  }));
  return {
    TotalCount: totalCount,
    TopN: framesAndCountsAndIds
  };
}
let TopNFunctionSortField;
exports.TopNFunctionSortField = TopNFunctionSortField;
(function (TopNFunctionSortField) {
  TopNFunctionSortField["Rank"] = "rank";
  TopNFunctionSortField["Frame"] = "frame";
  TopNFunctionSortField["Samples"] = "samples";
  TopNFunctionSortField["ExclusiveCPU"] = "exclusiveCPU";
  TopNFunctionSortField["InclusiveCPU"] = "inclusiveCPU";
  TopNFunctionSortField["Diff"] = "diff";
})(TopNFunctionSortField || (exports.TopNFunctionSortField = TopNFunctionSortField = {}));
const topNFunctionSortFieldRt = t.union([t.literal(TopNFunctionSortField.Rank), t.literal(TopNFunctionSortField.Frame), t.literal(TopNFunctionSortField.Samples), t.literal(TopNFunctionSortField.ExclusiveCPU), t.literal(TopNFunctionSortField.InclusiveCPU), t.literal(TopNFunctionSortField.Diff)]);
exports.topNFunctionSortFieldRt = topNFunctionSortFieldRt;