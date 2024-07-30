"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GuidedOnboardingPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _routes = require("./routes");
var _saved_objects = require("./saved_objects");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

class GuidedOnboardingPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.logger = initializerContext.logger.get();
  }
  setup(core) {
    this.logger.debug('guidedOnboarding: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    (0, _routes.defineRoutes)(router);

    // register saved objects
    core.savedObjects.registerType(_saved_objects.guideStateSavedObjects);
    core.savedObjects.registerType(_saved_objects.pluginStateSavedObjects);
    return {};
  }
  start() {
    this.logger.debug('guidedOnboarding: Started');
    return {};
  }
  stop() {}
}
exports.GuidedOnboardingPlugin = GuidedOnboardingPlugin;