"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FlameGraphComparisonMode = void 0;
exports.createBaseFlameGraph = createBaseFlameGraph;
exports.createFlameGraph = createFlameGraph;
var _frame_group = require("./frame_group");
var _hash = require("./hash");
var _profiling = require("./profiling");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let FlameGraphComparisonMode;
exports.FlameGraphComparisonMode = FlameGraphComparisonMode;
(function (FlameGraphComparisonMode) {
  FlameGraphComparisonMode["Absolute"] = "absolute";
  FlameGraphComparisonMode["Relative"] = "relative";
})(FlameGraphComparisonMode || (exports.FlameGraphComparisonMode = FlameGraphComparisonMode = {}));
// createBaseFlameGraph encapsulates the tree representation into a serialized form.
function createBaseFlameGraph(tree, totalSeconds) {
  const graph = {
    Size: tree.Size,
    Edges: new Array(tree.Size),
    FileID: tree.FileID.slice(0, tree.Size),
    FrameType: tree.FrameType.slice(0, tree.Size),
    ExeFilename: tree.ExeFilename.slice(0, tree.Size),
    AddressOrLine: tree.AddressOrLine.slice(0, tree.Size),
    FunctionName: tree.FunctionName.slice(0, tree.Size),
    FunctionOffset: tree.FunctionOffset.slice(0, tree.Size),
    SourceFilename: tree.SourceFilename.slice(0, tree.Size),
    SourceLine: tree.SourceLine.slice(0, tree.Size),
    CountInclusive: tree.CountInclusive.slice(0, tree.Size),
    CountExclusive: tree.CountExclusive.slice(0, tree.Size),
    TotalSeconds: totalSeconds
  };
  for (let i = 0; i < tree.Size; i++) {
    let j = 0;
    const nodes = new Array(tree.Edges[i].size);
    for (const [, n] of tree.Edges[i]) {
      nodes[j] = n;
      j++;
    }
    graph.Edges[i] = nodes;
  }
  return graph;
}
// createFlameGraph combines the base flamegraph with CPU-intensive values.
// This allows us to create a flamegraph in two steps (e.g. first on the server
// and finally in the browser).
function createFlameGraph(base) {
  const graph = {
    Size: base.Size,
    Edges: base.Edges,
    FileID: base.FileID,
    FrameType: base.FrameType,
    ExeFilename: base.ExeFilename,
    AddressOrLine: base.AddressOrLine,
    FunctionName: base.FunctionName,
    FunctionOffset: base.FunctionOffset,
    SourceFilename: base.SourceFilename,
    SourceLine: base.SourceLine,
    CountInclusive: base.CountInclusive,
    CountExclusive: base.CountExclusive,
    ID: new Array(base.Size),
    Label: new Array(base.Size),
    TotalSeconds: base.TotalSeconds
  };
  const rootFrameGroupID = (0, _frame_group.createFrameGroupID)(graph.FileID[0], graph.AddressOrLine[0], graph.ExeFilename[0], graph.SourceFilename[0], graph.FunctionName[0]);
  graph.ID[0] = (0, _hash.fnv1a64)(new TextEncoder().encode(rootFrameGroupID));
  const queue = [0];
  while (queue.length > 0) {
    const parent = queue.pop();
    for (const child of graph.Edges[parent]) {
      const frameGroupID = (0, _frame_group.createFrameGroupID)(graph.FileID[child], graph.AddressOrLine[child], graph.ExeFilename[child], graph.SourceFilename[child], graph.FunctionName[child]);
      const bytes = new TextEncoder().encode(graph.ID[parent] + frameGroupID);
      graph.ID[child] = (0, _hash.fnv1a64)(bytes);
      queue.push(child);
    }
  }
  graph.Label[0] = 'root: Represents 100% of CPU time.';
  for (let i = 1; i < graph.Size; i++) {
    const metadata = (0, _profiling.createStackFrameMetadata)({
      FileID: graph.FileID[i],
      FrameType: graph.FrameType[i],
      ExeFileName: graph.ExeFilename[i],
      AddressOrLine: graph.AddressOrLine[i],
      FunctionName: graph.FunctionName[i],
      FunctionOffset: graph.FunctionOffset[i],
      SourceFilename: graph.SourceFilename[i],
      SourceLine: graph.SourceLine[i]
    });
    graph.Label[i] = (0, _profiling.getCalleeLabel)(metadata);
  }
  return graph;
}