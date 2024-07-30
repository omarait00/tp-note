"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.incrementApiUsageCounter = incrementApiUsageCounter;
exports.registerRoutes = registerRoutes;
var _constants = require("../../common/constants");
var _deprecations = require("./deprecations/deprecations");
var _diagnostic = require("./diagnostic");
var _generate = require("./generate");
var _management = require("./management");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function incrementApiUsageCounter(method, path, usageCounter) {
  usageCounter === null || usageCounter === void 0 ? void 0 : usageCounter.incrementCounter({
    counterName: `${method} ${path}`,
    counterType: _constants.API_USAGE_COUNTER_TYPE
  });
}
function registerRoutes(reporting, logger) {
  (0, _deprecations.registerDeprecationsRoutes)(reporting, logger);
  (0, _diagnostic.registerDiagnosticRoutes)(reporting, logger);
  (0, _generate.registerGenerateCsvFromSavedObjectImmediate)(reporting, logger);
  (0, _generate.registerJobGenerationRoutes)(reporting, logger);
  (0, _management.registerJobInfoRoutes)(reporting);
}