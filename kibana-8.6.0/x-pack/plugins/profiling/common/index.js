"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PLUGIN_NAME = exports.PLUGIN_ID = exports.NOT_AVAILABLE_LABEL = exports.INDEX_TRACES = exports.INDEX_FRAMES = exports.INDEX_EXECUTABLES = exports.INDEX_EVENTS = void 0;
exports.fromMapToRecord = fromMapToRecord;
exports.getRoutePaths = getRoutePaths;
exports.timeRangeFromRequest = timeRangeFromRequest;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const PLUGIN_ID = 'profiling';
exports.PLUGIN_ID = PLUGIN_ID;
const PLUGIN_NAME = 'profiling';
exports.PLUGIN_NAME = PLUGIN_NAME;
const INDEX_EVENTS = 'profiling-events-all';
exports.INDEX_EVENTS = INDEX_EVENTS;
const INDEX_TRACES = 'profiling-stacktraces';
exports.INDEX_TRACES = INDEX_TRACES;
const INDEX_FRAMES = 'profiling-stackframes';
exports.INDEX_FRAMES = INDEX_FRAMES;
const INDEX_EXECUTABLES = 'profiling-executables';
exports.INDEX_EXECUTABLES = INDEX_EXECUTABLES;
const BASE_ROUTE_PATH = '/api/profiling/v1';
function getRoutePaths() {
  return {
    TopN: `${BASE_ROUTE_PATH}/topn`,
    TopNContainers: `${BASE_ROUTE_PATH}/topn/containers`,
    TopNDeployments: `${BASE_ROUTE_PATH}/topn/deployments`,
    TopNFunctions: `${BASE_ROUTE_PATH}/topn/functions`,
    TopNHosts: `${BASE_ROUTE_PATH}/topn/hosts`,
    TopNThreads: `${BASE_ROUTE_PATH}/topn/threads`,
    TopNTraces: `${BASE_ROUTE_PATH}/topn/traces`,
    Flamechart: `${BASE_ROUTE_PATH}/flamechart`,
    CacheExecutables: `${BASE_ROUTE_PATH}/cache/executables`,
    CacheStackFrames: `${BASE_ROUTE_PATH}/cache/stackframes`
  };
}
function timeRangeFromRequest(request) {
  const timeFrom = parseInt(request.query.timeFrom, 10);
  const timeTo = parseInt(request.query.timeTo, 10);
  return [timeFrom, timeTo];
}

// Converts from a Map object to a Record object since Map objects are not
// serializable to JSON by default
function fromMapToRecord(m) {
  const output = {};
  for (const [key, value] of m) {
    output[key] = value;
  }
  return output;
}
const NOT_AVAILABLE_LABEL = _i18n.i18n.translate('xpack.profiling.notAvailableLabel', {
  defaultMessage: 'N/A'
});
exports.NOT_AVAILABLE_LABEL = NOT_AVAILABLE_LABEL;