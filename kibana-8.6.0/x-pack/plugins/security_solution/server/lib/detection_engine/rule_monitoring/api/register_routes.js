"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRuleMonitoringRoutes = void 0;
var _route = require("./get_rule_execution_events/route");
var _route2 = require("./get_rule_execution_results/route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const registerRuleMonitoringRoutes = router => {
  (0, _route.getRuleExecutionEventsRoute)(router);
  (0, _route2.getRuleExecutionResultsRoute)(router);
};
exports.registerRuleMonitoringRoutes = registerRuleMonitoringRoutes;