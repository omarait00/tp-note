"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "CoreQueryParamsSchemaProperties", {
  enumerable: true,
  get: function () {
    return _lib.CoreQueryParamsSchemaProperties;
  }
});
exports.MAX_INTERVALS = exports.MAX_GROUPS = exports.DEFAULT_GROUPS = void 0;
Object.defineProperty(exports, "TIME_SERIES_BUCKET_SELECTOR_FIELD", {
  enumerable: true,
  get: function () {
    return _lib.TIME_SERIES_BUCKET_SELECTOR_FIELD;
  }
});
exports.getService = getService;
exports.register = register;
Object.defineProperty(exports, "validateCoreQueryBody", {
  enumerable: true,
  get: function () {
    return _lib.validateCoreQueryBody;
  }
});
Object.defineProperty(exports, "validateTimeWindowUnits", {
  enumerable: true,
  get: function () {
    return _lib.validateTimeWindowUnits;
  }
});
var _time_series_query = require("./lib/time_series_query");
var _routes = require("./routes");
var _lib = require("./lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// future enhancement: make these configurable?
const MAX_INTERVALS = 1000;
exports.MAX_INTERVALS = MAX_INTERVALS;
const MAX_GROUPS = 1000;
exports.MAX_GROUPS = MAX_GROUPS;
const DEFAULT_GROUPS = 100;
exports.DEFAULT_GROUPS = DEFAULT_GROUPS;
function getService() {
  return {
    timeSeriesQuery: _time_series_query.timeSeriesQuery
  };
}
function register(params) {
  const {
    logger,
    router,
    data,
    baseRoute
  } = params;
  const baseBuiltInRoute = `${baseRoute}/data`;
  (0, _routes.registerRoutes)({
    logger,
    router,
    data,
    baseRoute: baseBuiltInRoute
  });
}