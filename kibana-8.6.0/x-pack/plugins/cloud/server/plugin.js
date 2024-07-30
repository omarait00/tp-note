"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CloudPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _register_cloud_deployment_id_analytics_context = require("../common/register_cloud_deployment_id_analytics_context");
var _collectors = require("./collectors");
var _is_cloud_enabled = require("../common/is_cloud_enabled");
var _utils = require("./utils");
var _env = require("./env");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class CloudPlugin {
  constructor(context) {
    (0, _defineProperty2.default)(this, "config", void 0);
    this.context = context;
    this.config = this.context.config.get();
  }
  setup(core, {
    usageCollection
  }) {
    var _this$config$apm, _this$config$apm2;
    const isCloudEnabled = (0, _is_cloud_enabled.getIsCloudEnabled)(this.config.id);
    (0, _register_cloud_deployment_id_analytics_context.registerCloudDeploymentMetadataAnalyticsContext)(core.analytics, this.config);
    (0, _collectors.registerCloudUsageCollector)(usageCollection, {
      isCloudEnabled,
      trialEndDate: this.config.trial_end_date,
      isElasticStaffOwned: this.config.is_elastic_staff_owned
    });
    return {
      cloudId: this.config.id,
      instanceSizeMb: (0, _env.readInstanceSizeMb)(),
      deploymentId: (0, _utils.parseDeploymentIdFromDeploymentUrl)(this.config.deployment_url),
      isCloudEnabled,
      trialEndDate: this.config.trial_end_date ? new Date(this.config.trial_end_date) : undefined,
      isElasticStaffOwned: this.config.is_elastic_staff_owned,
      apm: {
        url: (_this$config$apm = this.config.apm) === null || _this$config$apm === void 0 ? void 0 : _this$config$apm.url,
        secretToken: (_this$config$apm2 = this.config.apm) === null || _this$config$apm2 === void 0 ? void 0 : _this$config$apm2.secret_token
      }
    };
  }
  start() {}
}
exports.CloudPlugin = CloudPlugin;