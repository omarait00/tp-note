"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configService = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Kibana config observable service, *NOT* agent policy
 */
class ConfigService {
  constructor() {
    (0, _defineProperty2.default)(this, "observable", null);
    (0, _defineProperty2.default)(this, "subscription", null);
    (0, _defineProperty2.default)(this, "config", null);
  }
  updateInformation(config) {
    this.config = config;
  }
  start(config$) {
    this.observable = config$;
    this.subscription = this.observable.subscribe(this.updateInformation.bind(this));
  }
  stop() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  getConfig() {
    return this.config;
  }
}
const configService = new ConfigService();
exports.configService = configService;