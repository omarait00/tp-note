"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LaunchDarklyClient = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _launchdarklyNodeServerSdk = _interopRequireDefault(require("launchdarkly-node-server-sdk"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class LaunchDarklyClient {
  constructor(ldConfig, logger) {
    (0, _defineProperty2.default)(this, "launchDarklyClient", void 0);
    (0, _defineProperty2.default)(this, "launchDarklyUser", void 0);
    this.logger = logger;
    this.launchDarklyClient = _launchdarklyNodeServerSdk.default.init(ldConfig.sdk_key, {
      application: {
        id: `kibana-server`,
        version: ldConfig.kibana_version
      },
      logger: _launchdarklyNodeServerSdk.default.basicLogger({
        level: ldConfig.client_log_level
      }),
      // For some reason, the stream API does not work in Kibana. `.waitForInitialization()` hangs forever (doesn't throw, neither logs any errors).
      // Using polling for now until we resolve that issue.
      // Relevant issue: https://github.com/launchdarkly/node-server-sdk/issues/132
      stream: false
    });
    this.launchDarklyClient.waitForInitialization().then(() => this.logger.debug('LaunchDarkly is initialized!'), err => this.logger.warn(`Error initializing LaunchDarkly: ${err}`));
  }
  updateUserMetadata(userMetadata) {
    const {
      userId,
      name,
      firstName,
      lastName,
      email,
      avatar,
      ip,
      country,
      ...custom
    } = userMetadata;
    this.launchDarklyUser = {
      key: userId,
      name,
      firstName,
      lastName,
      email,
      avatar,
      ip,
      country,
      // This casting is needed because LDUser does not allow `Record<string, undefined>`
      custom: custom
    };
  }
  async getVariation(configKey, defaultValue) {
    if (!this.launchDarklyUser) return defaultValue; // Skip any action if no LD User is defined
    await this.launchDarklyClient.waitForInitialization();
    return await this.launchDarklyClient.variation(configKey, this.launchDarklyUser, defaultValue);
  }
  reportMetric(metricName, meta, value) {
    if (!this.launchDarklyUser) return; // Skip any action if no LD User is defined
    this.launchDarklyClient.track(metricName, this.launchDarklyUser, meta, value);
  }
  async getAllFlags() {
    if (!this.launchDarklyUser) return {
      initialized: false,
      flagNames: [],
      flags: {}
    };
    // According to the docs, this method does not send analytics back to LaunchDarkly, so it does not provide false results
    const flagsState = await this.launchDarklyClient.allFlagsState(this.launchDarklyUser);
    const flags = flagsState.allValues();
    return {
      initialized: flagsState.valid,
      flags,
      flagNames: Object.keys(flags)
    };
  }
  stop() {
    var _this$launchDarklyCli;
    (_this$launchDarklyCli = this.launchDarklyClient) === null || _this$launchDarklyCli === void 0 ? void 0 : _this$launchDarklyCli.flush().catch(err => this.logger.error(err));
  }
}
exports.LaunchDarklyClient = LaunchDarklyClient;