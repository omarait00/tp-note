"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineRoutes = defineRoutes;
var _guide_state_routes = require("./guide_state_routes");
var _plugin_state_routes = require("./plugin_state_routes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function defineRoutes(router) {
  (0, _guide_state_routes.registerGetGuideStateRoute)(router);
  (0, _plugin_state_routes.registerGetPluginStateRoute)(router);
  (0, _plugin_state_routes.registerPutPluginStateRoute)(router);
}