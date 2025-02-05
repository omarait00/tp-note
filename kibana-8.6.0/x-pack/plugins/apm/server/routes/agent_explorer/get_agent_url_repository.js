"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAgentDocsPageUrl = void 0;
var _agent_name = require("../../../common/agent_name");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const agentsDocPageName = {
  go: 'go',
  java: 'java',
  'js-base': 'rum-js',
  'iOS/swift': 'swift',
  'rum-js': 'rum-js',
  nodejs: 'nodejs',
  python: 'python',
  dotnet: 'dotnet',
  ruby: 'ruby',
  php: 'php',
  'opentelemetry/cpp': 'cpp',
  'opentelemetry/dotnet': 'net',
  'opentelemetry/erlang': 'erlang',
  'opentelemetry/go': 'go',
  'opentelemetry/java': 'java',
  'opentelemetry/nodejs': 'js',
  'opentelemetry/php': 'php',
  'opentelemetry/python': 'python',
  'opentelemetry/ruby': 'ruby',
  'opentelemetry/swift': 'swift',
  'opentelemetry/webjs': 'js'
};
const getAgentDocsPageUrl = agentName => {
  const agentDocsPageName = agentsDocPageName[agentName];
  if (!agentDocsPageName) {
    return undefined;
  }
  if ((0, _agent_name.isOpenTelemetryAgentName)(agentName)) {
    return `https://opentelemetry.io/docs/instrumentation/${agentDocsPageName}`;
  }
  return `https://www.elastic.co/guide/en/apm/agent/${agentDocsPageName}/current/`;
};
exports.getAgentDocsPageUrl = getAgentDocsPageUrl;