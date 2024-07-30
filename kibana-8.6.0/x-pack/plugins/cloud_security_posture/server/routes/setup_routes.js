"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupRoutes = setupRoutes;
var _common = require("../../common");
var _compliance_dashboard = require("./compliance_dashboard/compliance_dashboard");
var _benchmarks = require("./benchmarks/benchmarks");
var _status = require("./status/status");
var _es_pit = require("./es_pit/es_pit");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * 1. Registers routes
 * 2. Registers routes handler context
 */
function setupRoutes({
  core,
  logger
}) {
  const router = core.http.createRouter();
  (0, _compliance_dashboard.defineGetComplianceDashboardRoute)(router);
  (0, _benchmarks.defineGetBenchmarksRoute)(router);
  (0, _status.defineGetCspStatusRoute)(router);
  (0, _es_pit.defineEsPitRoute)(router);
  core.http.registerRouteHandlerContext(_common.PLUGIN_ID, async (context, request) => {
    const [, {
      security,
      fleet
    }] = await core.getStartServices();
    const coreContext = await context.core;
    await fleet.fleetSetupCompleted();
    let user = null;
    return {
      get user() {
        // We want to call getCurrentUser only when needed and only once
        if (!user) {
          user = security.authc.getCurrentUser(request);
        }
        return user;
      },
      logger,
      esClient: coreContext.elasticsearch.client,
      soClient: coreContext.savedObjects.client,
      agentPolicyService: fleet.agentPolicyService,
      agentService: fleet.agentService,
      packagePolicyService: fleet.packagePolicyService,
      packageService: fleet.packageService
    };
  });
}