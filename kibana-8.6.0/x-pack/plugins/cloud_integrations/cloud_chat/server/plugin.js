"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CloudChatPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _routes = require("./routes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class CloudChatPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "isDev", void 0);
    this.config = initializerContext.config.get();
    this.isDev = initializerContext.env.mode.dev;
  }
  setup(core, {
    cloud,
    security
  }) {
    if (cloud.isCloudEnabled && this.config.chatIdentitySecret) {
      (0, _routes.registerChatRoute)({
        router: core.http.createRouter(),
        chatIdentitySecret: this.config.chatIdentitySecret,
        security,
        isDev: this.isDev
      });
    }
  }
  start() {}
  stop() {}
}
exports.CloudChatPlugin = CloudChatPlugin;