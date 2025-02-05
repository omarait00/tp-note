"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SessionViewPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _routes = require("./routes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class SessionViewPlugin {
  /**
   * Initialize SessionViewPlugin class properties (logger, etc) that is accessible
   * through the initializerContext.
   */
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "router", void 0);
    this.logger = initializerContext.logger.get();
  }
  setup(core, plugins) {
    this.logger.debug('session view: Setup');
    this.router = core.http.createRouter();
  }
  start(core, plugins) {
    this.logger.debug('session view: Start');

    // Register server routes
    if (this.router) {
      (0, _routes.registerRoutes)(this.router, plugins.ruleRegistry);
    }
  }
  stop() {
    this.logger.debug('session view: Stop');
  }
}
exports.SessionViewPlugin = SessionViewPlugin;