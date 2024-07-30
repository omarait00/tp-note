"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = registerRoutes;
var _cache = require("./cache");
var _flamechart = require("./flamechart");
var _functions = require("./functions");
var _topn = require("./topn");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerRoutes(params) {
  (0, _cache.registerCacheExecutablesRoute)(params);
  (0, _cache.registerCacheStackFramesRoute)(params);
  (0, _flamechart.registerFlameChartSearchRoute)(params);
  (0, _functions.registerTopNFunctionsSearchRoute)(params);
  (0, _topn.registerTraceEventsTopNContainersSearchRoute)(params);
  (0, _topn.registerTraceEventsTopNDeploymentsSearchRoute)(params);
  (0, _topn.registerTraceEventsTopNHostsSearchRoute)(params);
  (0, _topn.registerTraceEventsTopNStackTracesSearchRoute)(params);
  (0, _topn.registerTraceEventsTopNThreadsSearchRoute)(params);
}