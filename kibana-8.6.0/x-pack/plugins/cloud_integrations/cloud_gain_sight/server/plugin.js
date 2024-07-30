"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CloudGainsightPlugin = void 0;
var _routes = require("./routes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class CloudGainsightPlugin {
  constructor(initializerContext) {
    this.initializerContext = initializerContext;
  }
  setup(core, {
    cloud
  }) {
    if (cloud.isCloudEnabled) {
      (0, _routes.registerGainsightRoute)({
        httpResources: core.http.resources,
        packageInfo: this.initializerContext.env.packageInfo
      });
      (0, _routes.registerGainsightWidgetRoute)({
        httpResources: core.http.resources,
        packageInfo: this.initializerContext.env.packageInfo
      });
      (0, _routes.registerGainsightStyleRoute)({
        httpResources: core.http.resources,
        packageInfo: this.initializerContext.env.packageInfo
      });
    }
  }
  start() {}
  stop() {}
}
exports.CloudGainsightPlugin = CloudGainsightPlugin;