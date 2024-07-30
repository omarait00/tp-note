"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TriggersActionsPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _data = require("./data");
var _routes = require("./routes");
var _common = require("../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class TriggersActionsPlugin {
  constructor(ctx) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "data", void 0);
    this.logger = ctx.logger.get();
    this.data = (0, _data.getService)();
  }
  setup(core, plugins) {
    const router = core.http.createRouter();
    (0, _data.register)({
      logger: this.logger,
      data: this.data,
      router,
      baseRoute: _common.BASE_TRIGGERS_ACTIONS_UI_API_PATH
    });
    (0, _routes.createHealthRoute)(this.logger, router, _common.BASE_TRIGGERS_ACTIONS_UI_API_PATH, plugins.alerting !== undefined);
    (0, _routes.createConfigRoute)(this.logger, router, _common.BASE_TRIGGERS_ACTIONS_UI_API_PATH, plugins.alerting.getConfig);
  }
  start() {
    return {
      data: this.data
    };
  }
  async stop() {}
}
exports.TriggersActionsPlugin = TriggersActionsPlugin;