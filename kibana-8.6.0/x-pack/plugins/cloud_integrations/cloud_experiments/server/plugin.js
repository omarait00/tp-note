"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CloudExperimentsPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _lodash = require("lodash");
var _crypto = require("@kbn/crypto");
var _rxjs = require("rxjs");
var _metadata_service = require("../common/metadata_service");
var _launch_darkly_client = require("./launch_darkly_client");
var _usage = require("./usage");
var _constants = require("../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class CloudExperimentsPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "launchDarklyClient", void 0);
    (0, _defineProperty2.default)(this, "flagOverrides", void 0);
    (0, _defineProperty2.default)(this, "metadataService", void 0);
    (0, _defineProperty2.default)(this, "getVariation", async (featureFlagName, defaultValue) => {
      const configKey = _constants.FEATURE_FLAG_NAMES[featureFlagName];
      // Apply overrides if they exist without asking LaunchDarkly.
      if (this.flagOverrides && (0, _lodash.has)(this.flagOverrides, configKey)) {
        return (0, _lodash.get)(this.flagOverrides, configKey, defaultValue);
      }
      if (!this.launchDarklyClient) return defaultValue;
      return await this.launchDarklyClient.getVariation(configKey, defaultValue);
    });
    (0, _defineProperty2.default)(this, "reportMetric", ({
      name,
      meta,
      value
    }) => {
      var _this$launchDarklyCli;
      const metricName = _constants.METRIC_NAMES[name];
      (_this$launchDarklyCli = this.launchDarklyClient) === null || _this$launchDarklyCli === void 0 ? void 0 : _this$launchDarklyCli.reportMetric(metricName, meta, value);
      this.logger.debug(`Reported experimentation metric ${metricName}`, {
        experimentationMetric: {
          name,
          meta,
          value
        }
      });
    });
    this.initializerContext = initializerContext;
    this.logger = initializerContext.logger.get();
    const config = initializerContext.config.get();
    this.metadataService = new _metadata_service.MetadataService({
      metadata_refresh_interval: config.metadata_refresh_interval
    });
    if (config.flag_overrides) {
      this.flagOverrides = config.flag_overrides;
    }
    const ldConfig = config.launch_darkly; // If the plugin is enabled and no flag_overrides are provided (dev mode only), launch_darkly must exist
    if (!ldConfig && !initializerContext.env.mode.dev) {
      // If the plugin is enabled, and it's in prod mode, launch_darkly must exist
      // (config-schema should enforce it, but just in case).
      throw new Error('xpack.cloud_integrations.experiments.launch_darkly configuration should exist');
    }
    if (ldConfig) {
      this.launchDarklyClient = new _launch_darkly_client.LaunchDarklyClient({
        ...ldConfig,
        kibana_version: initializerContext.env.packageInfo.version
      }, this.logger.get('launch_darkly'));
    }
  }
  setup(core, deps) {
    if (deps.usageCollection) {
      (0, _usage.registerUsageCollector)(deps.usageCollection, () => ({
        launchDarklyClient: this.launchDarklyClient
      }));
    }
    if (deps.cloud.isCloudEnabled && deps.cloud.cloudId) {
      var _deps$cloud$trialEndD;
      this.metadataService.setup({
        // We use the Cloud ID as the userId in the Cloud Experiments
        userId: (0, _crypto.createSHA256Hash)(deps.cloud.cloudId),
        kibanaVersion: this.initializerContext.env.packageInfo.version,
        trialEndDate: (_deps$cloud$trialEndD = deps.cloud.trialEndDate) === null || _deps$cloud$trialEndD === void 0 ? void 0 : _deps$cloud$trialEndD.toISOString(),
        isElasticStaff: deps.cloud.isElasticStaffOwned
      });

      // We only subscribe to the user metadata updates if Cloud is enabled.
      // This way, since the user is not identified, it cannot retrieve Feature Flags from LaunchDarkly when not running on Cloud.
      this.metadataService.userMetadata$.pipe((0, _rxjs.filter)(Boolean),
      // Filter out undefined
      (0, _rxjs.map)(userMetadata => {
        var _this$launchDarklyCli2;
        return (_this$launchDarklyCli2 = this.launchDarklyClient) === null || _this$launchDarklyCli2 === void 0 ? void 0 : _this$launchDarklyCli2.updateUserMetadata(userMetadata);
      })).subscribe(); // This subscription will stop on when the metadataService stops because it completes the Observable
    }
  }

  start(core, deps) {
    this.metadataService.start({
      hasDataFetcher: async () => await this.addHasDataMetadata(core, deps.dataViews)
    });
    return {
      getVariation: this.getVariation,
      reportMetric: this.reportMetric
    };
  }
  stop() {
    var _this$launchDarklyCli3;
    (_this$launchDarklyCli3 = this.launchDarklyClient) === null || _this$launchDarklyCli3 === void 0 ? void 0 : _this$launchDarklyCli3.stop();
    this.metadataService.stop();
  }
  async addHasDataMetadata(core, dataViews) {
    const dataViewsService = await dataViews.dataViewsServiceFactory(core.savedObjects.createInternalRepository(), core.elasticsearch.client.asInternalUser, void 0,
    // No Kibana Request to scope the check
    true // Ignore capabilities checks
    );

    return {
      hasData: await dataViewsService.hasUserDataView()
    };
  }
}
exports.CloudExperimentsPlugin = CloudExperimentsPlugin;