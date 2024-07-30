"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AiopsPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _common = require("../common");
var _license = require("./lib/license");
var _routes = require("./routes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class AiopsPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "licenseSubscription", null);
    this.logger = initializerContext.logger.get();
  }
  setup(core, plugins) {
    this.logger.debug('aiops: Setup');

    // Subscribe to license changes and store the current license in `currentLicense`.
    // This way we can pass on license changes to the route factory having always
    // the current license because it's stored in a mutable attribute.
    const aiopsLicense = {
      isActivePlatinumLicense: false
    };
    this.licenseSubscription = plugins.licensing.license$.subscribe(async license => {
      aiopsLicense.isActivePlatinumLicense = (0, _license.isActiveLicense)('platinum', license);
    });
    const router = core.http.createRouter();

    // Register server side APIs
    if (_common.AIOPS_ENABLED) {
      core.getStartServices().then(([_, depsStart]) => {
        (0, _routes.defineExplainLogRateSpikesRoute)(router, aiopsLicense, this.logger);
      });
    }
    return {};
  }
  start(core) {
    this.logger.debug('aiops: Started');
    return {};
  }
  stop() {
    var _this$licenseSubscrip;
    this.logger.debug('aiops: Stop');
    (_this$licenseSubscrip = this.licenseSubscription) === null || _this$licenseSubscrip === void 0 ? void 0 : _this$licenseSubscrip.unsubscribe();
  }
}
exports.AiopsPlugin = AiopsPlugin;