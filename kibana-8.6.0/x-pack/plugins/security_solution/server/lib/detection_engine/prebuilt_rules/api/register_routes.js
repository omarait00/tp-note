"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerPrebuiltRulesRoutes = void 0;
var _route = require("./get_prebuilt_rules_and_timelines_status/route");
var _route2 = require("./install_prebuilt_rules_and_timelines/route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const registerPrebuiltRulesRoutes = (router, config, security) => {
  (0, _route.getPrebuiltRulesAndTimelinesStatusRoute)(router, config, security);
  (0, _route2.installPrebuiltRulesAndTimelinesRoute)(router);
};
exports.registerPrebuiltRulesRoutes = registerPrebuiltRulesRoutes;