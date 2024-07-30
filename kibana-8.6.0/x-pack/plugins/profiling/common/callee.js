"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCalleeTree = createCalleeTree;
var _frame_group = require("./frame_group");
var _profiling = require("./profiling");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createCalleeTree(events, stackTraces, stackFrames, executables, totalFrames) {
  const tree = {
    Size: 1,
    Edges: new Array(totalFrames),
    FileID: new Array(totalFrames),
    FrameType: new Array(totalFrames),
    ExeFilename: new Array(totalFrames),
    AddressOrLine: new Array(totalFrames),
    FunctionName: new Array(totalFrames),
    FunctionOffset: new Array(totalFrames),
    SourceFilename: new Array(totalFrames),
    SourceLine: new Array(totalFrames),
    CountInclusive: new Array(totalFrames),
    CountExclusive: new Array(totalFrames)
  };
  tree.Edges[0] = new Map();
  tree.FileID[0] = '';
  tree.FrameType[0] = 0;
  tree.ExeFilename[0] = '';
  tree.AddressOrLine[0] = 0;
  tree.FunctionName[0] = '';
  tree.FunctionOffset[0] = 0;
  tree.SourceFilename[0] = '';
  tree.SourceLine[0] = 0;
  tree.CountInclusive[0] = 0;
  tree.CountExclusive[0] = 0;
  const sortedStackTraceIDs = new Array();
  for (const trace of stackTraces.keys()) {
    sortedStackTraceIDs.push(trace);
  }
  sortedStackTraceIDs.sort((t1, t2) => {
    return t1.localeCompare(t2);
  });

  // Walk through all traces. Increment the count of the root by the count of
  // that trace. Walk "down" the trace (through the callees) and add the count
  // of the trace to each callee.

  for (const stackTraceID of sortedStackTraceIDs) {
    var _stackTraces$get, _events$get;
    // The slice of frames is ordered so that the leaf function is at the
    // highest index.

    // It is possible that we do not have a stacktrace for an event,
    // e.g. when stopping the host agent or on network errors.
    const stackTrace = (_stackTraces$get = stackTraces.get(stackTraceID)) !== null && _stackTraces$get !== void 0 ? _stackTraces$get : _profiling.emptyStackTrace;
    const lenStackTrace = stackTrace.FrameIDs.length;
    const samples = (_events$get = events.get(stackTraceID)) !== null && _events$get !== void 0 ? _events$get : 0;
    let currentNode = 0;
    tree.CountInclusive[currentNode] += samples;
    tree.CountExclusive[currentNode] = 0;
    for (let i = 0; i < lenStackTrace; i++) {
      var _stackFrames$get, _executables$get;
      const frameID = stackTrace.FrameIDs[i];
      const fileID = stackTrace.FileIDs[i];
      const addressOrLine = stackTrace.AddressOrLines[i];
      const frame = (_stackFrames$get = stackFrames.get(frameID)) !== null && _stackFrames$get !== void 0 ? _stackFrames$get : _profiling.emptyStackFrame;
      const executable = (_executables$get = executables.get(fileID)) !== null && _executables$get !== void 0 ? _executables$get : _profiling.emptyExecutable;
      const frameGroupID = (0, _frame_group.createFrameGroupID)(fileID, addressOrLine, executable.FileName, frame.FileName, frame.FunctionName);
      let node = tree.Edges[currentNode].get(frameGroupID);
      if (node === undefined) {
        node = tree.Size;
        tree.FileID[node] = fileID;
        tree.FrameType[node] = stackTrace.Types[i];
        tree.ExeFilename[node] = executable.FileName;
        tree.AddressOrLine[node] = addressOrLine;
        tree.FunctionName[node] = frame.FunctionName;
        tree.FunctionOffset[node] = frame.FunctionOffset;
        tree.SourceLine[node] = frame.LineNumber;
        tree.SourceFilename[node] = frame.FileName;
        tree.CountInclusive[node] = samples;
        tree.CountExclusive[node] = 0;
        tree.Edges[currentNode].set(frameGroupID, node);
        tree.Edges[node] = new Map();
        tree.Size++;
      } else {
        tree.CountInclusive[node] += samples;
      }
      if (i === lenStackTrace - 1) {
        // Leaf frame: sum up counts for exclusive CPU.
        tree.CountExclusive[node] += samples;
      }
      currentNode = node;
    }
  }
  return tree;
}