"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProfilingESField = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let ProfilingESField;
exports.ProfilingESField = ProfilingESField;
(function (ProfilingESField) {
  ProfilingESField["Timestamp"] = "@timestamp";
  ProfilingESField["ContainerName"] = "container.name";
  ProfilingESField["ProcessThreadName"] = "process.thread.name";
  ProfilingESField["StacktraceCount"] = "Stacktrace.count";
  ProfilingESField["HostID"] = "host.id";
  ProfilingESField["HostName"] = "host.name";
  ProfilingESField["HostIP"] = "host.ip";
  ProfilingESField["OrchestratorResourceName"] = "orchestrator.resource.name";
  ProfilingESField["ServiceName"] = "service.name";
  ProfilingESField["StacktraceID"] = "Stacktrace.id";
  ProfilingESField["StacktraceFrameIDs"] = "Stacktrace.frame.ids";
  ProfilingESField["StacktraceFrameTypes"] = "Stacktrace.frame.types";
  ProfilingESField["StackframeFileName"] = "Stackframe.file.name";
  ProfilingESField["StackframeFunctionName"] = "Stackframe.function.name";
  ProfilingESField["StackframeLineNumber"] = "Stackframe.line.number";
  ProfilingESField["StackframeFunctionOffset"] = "Stackframe.function.offset";
  ProfilingESField["StackframeSourceType"] = "Stackframe.source.type";
  ProfilingESField["ExecutableBuildID"] = "Executable.build.id";
  ProfilingESField["ExecutableFileName"] = "Executable.file.name";
})(ProfilingESField || (exports.ProfilingESField = ProfilingESField = {}));