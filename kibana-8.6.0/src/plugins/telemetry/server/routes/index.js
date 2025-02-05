"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = registerRoutes;
var _telemetry_opt_in = require("./telemetry_opt_in");
var _telemetry_usage_stats = require("./telemetry_usage_stats");
var _telemetry_opt_in_stats = require("./telemetry_opt_in_stats");
var _telemetry_user_has_seen_notice = require("./telemetry_user_has_seen_notice");
var _telemetry_last_reported = require("./telemetry_last_reported");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function registerRoutes(options) {
  const {
    isDev,
    telemetryCollectionManager,
    router,
    savedObjectsInternalClient$,
    getSecurity
  } = options;
  (0, _telemetry_opt_in.registerTelemetryOptInRoutes)(options);
  (0, _telemetry_usage_stats.registerTelemetryUsageStatsRoutes)(router, telemetryCollectionManager, isDev, getSecurity);
  (0, _telemetry_opt_in_stats.registerTelemetryOptInStatsRoutes)(router, telemetryCollectionManager);
  (0, _telemetry_user_has_seen_notice.registerTelemetryUserHasSeenNotice)(router);
  (0, _telemetry_last_reported.registerTelemetryLastReported)(router, savedObjectsInternalClient$);
}