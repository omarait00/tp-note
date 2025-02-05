"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RuleDataService = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Either = require("fp-ts/lib/Either");
var _config = require("../config");
var _rule_data_client = require("../rule_data_client");
var _index_info = require("./index_info");
var _resource_installer = require("./resource_installer");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class RuleDataService {
  constructor(options) {
    (0, _defineProperty2.default)(this, "indicesByBaseName", void 0);
    (0, _defineProperty2.default)(this, "indicesByFeatureId", void 0);
    (0, _defineProperty2.default)(this, "registrationContextByFeatureId", void 0);
    (0, _defineProperty2.default)(this, "resourceInstaller", void 0);
    (0, _defineProperty2.default)(this, "installCommonResources", void 0);
    (0, _defineProperty2.default)(this, "isInitialized", void 0);
    this.options = options;
    this.indicesByBaseName = new Map();
    this.indicesByFeatureId = new Map();
    this.registrationContextByFeatureId = new Map();
    this.resourceInstaller = new _resource_installer.ResourceInstaller({
      getResourceName: name => this.getResourceName(name),
      getClusterClient: options.getClusterClient,
      logger: options.logger,
      disabledRegistrationContexts: options.disabledRegistrationContexts,
      isWriteEnabled: options.isWriteEnabled,
      pluginStop$: options.pluginStop$
    });
    this.installCommonResources = Promise.resolve((0, _Either.right)('ok'));
    this.isInitialized = false;
  }
  getResourcePrefix() {
    return _config.INDEX_PREFIX;
  }
  getResourceName(relativeName) {
    return (0, _utils.joinWithDash)(this.getResourcePrefix(), relativeName);
  }
  isWriteEnabled(registrationContext) {
    return this.options.isWriteEnabled && !this.isRegistrationContextDisabled(registrationContext);
  }
  isRegistrationContextDisabled(registrationContext) {
    return this.options.disabledRegistrationContexts.includes(registrationContext);
  }

  /**
   * If writer cache is enabled (the default), the writer will be cached
   * after being initialized. Disabling this is useful for tests, where we
   * expect to easily be able to clean up after ourselves between test cases.
   */
  isWriterCacheEnabled() {
    return this.options.isWriterCacheEnabled;
  }

  /**
   * Installs common Elasticsearch resources used by all alerts-as-data indices.
   */
  initializeService() {
    // Run the installation of common resources and handle exceptions.
    this.installCommonResources = this.resourceInstaller.installCommonResources().then(() => (0, _Either.right)('ok')).catch(e => {
      this.options.logger.error(e);
      return (0, _Either.left)(e); // propagates it to the index initialization phase
    });

    this.isInitialized = true;
  }
  initializeIndex(indexOptions) {
    var _this$indicesByFeatur;
    if (!this.isInitialized) {
      throw new Error('Rule data service is not initialized. Make sure to call initializeService() in the rule registry plugin setup phase');
    }
    const {
      registrationContext
    } = indexOptions;
    const indexInfo = new _index_info.IndexInfo({
      indexOptions,
      kibanaVersion: this.options.kibanaVersion
    });
    const indicesAssociatedWithFeature = (_this$indicesByFeatur = this.indicesByFeatureId.get(indexOptions.feature)) !== null && _this$indicesByFeatur !== void 0 ? _this$indicesByFeatur : [];
    this.indicesByFeatureId.set(indexOptions.feature, [...indicesAssociatedWithFeature, indexInfo]);
    this.indicesByBaseName.set(indexInfo.baseName, indexInfo);
    this.registrationContextByFeatureId.set(registrationContext, indexOptions.feature);
    const waitUntilClusterClientAvailable = async () => {
      try {
        const clusterClient = await this.options.getClusterClient();
        return (0, _Either.right)(clusterClient);
      } catch (e) {
        this.options.logger.error(e);
        return (0, _Either.left)(e);
      }
    };
    const waitUntilIndexResourcesInstalled = async () => {
      try {
        const result = await this.installCommonResources;
        if ((0, _Either.isLeft)(result)) {
          return result;
        }
        if (!this.isRegistrationContextDisabled(registrationContext)) {
          await this.resourceInstaller.installIndexLevelResources(indexInfo);
        }
        const clusterClient = await this.options.getClusterClient();
        return (0, _Either.right)(clusterClient);
      } catch (e) {
        this.options.logger.error(e);
        return (0, _Either.left)(e);
      }
    };

    // Start initialization now, including installation of index resources.
    // Let's unblock read operations since installation can take quite some time.
    // Write operations will have to wait, of course.
    // NOTE: these promises cannot reject, otherwise it will lead to an
    // unhandled promise rejection shutting down Kibana process.
    const waitUntilReadyForReading = waitUntilClusterClientAvailable();
    const waitUntilReadyForWriting = waitUntilIndexResourcesInstalled();
    return new _rule_data_client.RuleDataClient({
      indexInfo,
      resourceInstaller: this.resourceInstaller,
      isWriteEnabled: this.isWriteEnabled(registrationContext),
      isWriterCacheEnabled: this.isWriterCacheEnabled(),
      waitUntilReadyForReading,
      waitUntilReadyForWriting,
      logger: this.options.logger
    });
  }
  findIndexByName(registrationContext, dataset) {
    var _this$indicesByBaseNa;
    const baseName = this.getResourceName(`${registrationContext}.${dataset}`);
    return (_this$indicesByBaseNa = this.indicesByBaseName.get(baseName)) !== null && _this$indicesByBaseNa !== void 0 ? _this$indicesByBaseNa : null;
  }
  findFeatureIdsByRegistrationContexts(registrationContexts) {
    const featureIds = [];
    registrationContexts.forEach(rc => {
      const featureId = this.registrationContextByFeatureId.get(rc);
      if (featureId) {
        featureIds.push(featureId);
      }
    });
    return featureIds;
  }
  findIndexByFeature(featureId, dataset) {
    var _this$indicesByFeatur2;
    const foundIndices = (_this$indicesByFeatur2 = this.indicesByFeatureId.get(featureId)) !== null && _this$indicesByFeatur2 !== void 0 ? _this$indicesByFeatur2 : [];
    if (dataset && foundIndices.length > 0) {
      return foundIndices.filter(i => i.indexOptions.dataset === dataset)[0];
    } else if (foundIndices.length > 0) {
      return foundIndices[0];
    }
    return null;
  }
}
exports.RuleDataService = RuleDataService;