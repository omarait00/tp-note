"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FeatureUsageService = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const FEATURES = {
  HOST_ISOLATION: 'Host isolation',
  HOST_ISOLATION_EXCEPTION: 'Host isolation exception',
  HOST_ISOLATION_EXCEPTION_BY_POLICY: 'Host isolation exception by policy',
  TRUSTED_APP_BY_POLICY: 'Trusted app by policy',
  EVENT_FILTERS_BY_POLICY: 'Event filters by policy',
  BLOCKLIST_BY_POLICY: 'Blocklists by policy',
  RANSOMWARE_PROTECTION: 'Ransomeware protection',
  MEMORY_THREAT_PROTECTION: 'Memory threat protection',
  BEHAVIOR_PROTECTION: 'Behavior protection',
  KILL_PROCESS: 'Kill process',
  SUSPEND_PROCESS: 'Suspend process',
  RUNNING_PROCESSES: 'Get running processes',
  GET_FILE: 'Get file',
  ALERTS_BY_PROCESS_ANCESTRY: 'Get related alerts by process ancestry'
};
class FeatureUsageService {
  constructor() {
    (0, _defineProperty2.default)(this, "licensingPluginStart", void 0);
  }
  get notify() {
    var _this$licensingPlugin;
    return ((_this$licensingPlugin = this.licensingPluginStart) === null || _this$licensingPlugin === void 0 ? void 0 : _this$licensingPlugin.featureUsage.notifyUsage) || function () {};
  }
  setup(licensingPluginSetup) {
    Object.values(FEATURES).map(featureValue => licensingPluginSetup.featureUsage.register(featureValue, 'platinum'));
  }
  start(licensingPluginStart) {
    this.licensingPluginStart = licensingPluginStart;
  }
  notifyUsage(featureKey) {
    this.notify(FEATURES[featureKey]);
  }
}
exports.FeatureUsageService = FeatureUsageService;