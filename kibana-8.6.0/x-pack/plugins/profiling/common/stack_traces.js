"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TopNType = exports.StackTracesDisplayOption = void 0;
exports.getFieldNameForTopNType = getFieldNameForTopNType;
var _elasticsearch = require("./elasticsearch");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let StackTracesDisplayOption;
exports.StackTracesDisplayOption = StackTracesDisplayOption;
(function (StackTracesDisplayOption) {
  StackTracesDisplayOption["StackTraces"] = "stackTraces";
  StackTracesDisplayOption["Percentage"] = "percentage";
})(StackTracesDisplayOption || (exports.StackTracesDisplayOption = StackTracesDisplayOption = {}));
let TopNType;
exports.TopNType = TopNType;
(function (TopNType) {
  TopNType["Containers"] = "containers";
  TopNType["Deployments"] = "deployments";
  TopNType["Threads"] = "threads";
  TopNType["Hosts"] = "hosts";
  TopNType["Traces"] = "traces";
})(TopNType || (exports.TopNType = TopNType = {}));
function getFieldNameForTopNType(type) {
  return {
    [TopNType.Containers]: _elasticsearch.ProfilingESField.ContainerName,
    [TopNType.Deployments]: _elasticsearch.ProfilingESField.OrchestratorResourceName,
    [TopNType.Threads]: _elasticsearch.ProfilingESField.ProcessThreadName,
    [TopNType.Hosts]: _elasticsearch.ProfilingESField.HostID,
    [TopNType.Traces]: _elasticsearch.ProfilingESField.StacktraceID
  }[type];
}