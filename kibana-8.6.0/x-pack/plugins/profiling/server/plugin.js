"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProfilingPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _feature = require("./feature");
var _routes = require("./routes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class ProfilingPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.logger = initializerContext.logger.get();
  }
  setup(core, deps) {
    this.logger.debug('profiling: Setup');
    const router = core.http.createRouter();
    deps.features.registerKibanaFeature(_feature.PROFILING_FEATURE);
    core.getStartServices().then(([_, depsStart]) => {
      (0, _routes.registerRoutes)({
        router,
        logger: this.logger,
        dependencies: {
          start: depsStart,
          setup: deps
        }
      });
    });
    return {};
  }
  start(core) {
    this.logger.debug('profiling: Started');
    return {};
  }
  stop() {}
}
exports.ProfilingPlugin = ProfilingPlugin;