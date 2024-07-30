"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = registerRoutes;
var _rest_api_routes = require("./rest_api_routes");
var _fields_for = require("./routes/fields_for");
var _has_data_views = require("./routes/has_data_views");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function registerRoutes(http, getStartServices, dataViewRestCounter) {
  const router = http.createRouter();
  _rest_api_routes.routes.forEach(route => route(router, getStartServices, dataViewRestCounter));
  (0, _fields_for.registerFieldForWildcard)(router, getStartServices);
  (0, _has_data_views.registerHasDataViewsRoute)(router);
}