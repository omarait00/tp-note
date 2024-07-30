"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UnifiedFieldListPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _routes = require("./routes");
var _ui_settings = require("./ui_settings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

class UnifiedFieldListPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.logger = initializerContext.logger.get();
  }
  setup(core, plugins) {
    this.logger.debug('unifiedFieldList: Setup');
    core.uiSettings.register((0, _ui_settings.getUiSettings)());
    (0, _routes.defineRoutes)(core, this.logger);
    return {};
  }
  start(core, plugins) {
    this.logger.debug('unifiedFieldList: Started');
    return {};
  }
  stop() {}
}
exports.UnifiedFieldListPlugin = UnifiedFieldListPlugin;