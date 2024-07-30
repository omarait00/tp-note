"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StackConnectorsPlugin = void 0;
var _connector_types = require("./connector_types");
var _routes = require("./routes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class StackConnectorsPlugin {
  constructor(context) {}
  setup(core, plugins) {
    const router = core.http.createRouter();
    const {
      actions
    } = plugins;
    (0, _routes.getWellKnownEmailServiceRoute)(router);
    (0, _connector_types.registerConnectorTypes)({
      actions,
      publicBaseUrl: core.http.basePath.publicBaseUrl
    });
  }
  start() {}
  stop() {}
}
exports.StackConnectorsPlugin = StackConnectorsPlugin;