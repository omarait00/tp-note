"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UpgradeAssistantServerPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _server = require("../../../../src/core/server");
var _constants = require("../common/constants");
var _credential_store = require("./lib/reindexing/credential_store");
var _telemetry = require("./lib/telemetry");
var _version = require("./lib/version");
var _reindex_indices = require("./routes/reindex_indices");
var _register_routes = require("./routes/register_routes");
var _saved_object_types = require("./saved_object_types");
var _shared_imports = require("./shared_imports");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class UpgradeAssistantServerPlugin {
  // Properties set at setup

  // Properties set at start

  constructor({
    logger,
    env,
    config
  }) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "credentialStore", void 0);
    (0, _defineProperty2.default)(this, "kibanaVersion", void 0);
    (0, _defineProperty2.default)(this, "initialFeatureSet", void 0);
    (0, _defineProperty2.default)(this, "licensing", void 0);
    (0, _defineProperty2.default)(this, "savedObjectsServiceStart", void 0);
    (0, _defineProperty2.default)(this, "securityPluginStart", void 0);
    (0, _defineProperty2.default)(this, "worker", void 0);
    this.logger = logger.get();
    this.credentialStore = (0, _credential_store.credentialStoreFactory)(this.logger);
    this.kibanaVersion = env.packageInfo.version;
    const {
      featureSet
    } = config.get();
    this.initialFeatureSet = featureSet;
  }
  getWorker() {
    if (!this.worker) {
      throw new Error('Worker unavailable');
    }
    return this.worker;
  }
  setup({
    http,
    getStartServices,
    savedObjects
  }, {
    usageCollection,
    features,
    licensing,
    infra,
    security
  }) {
    this.licensing = licensing;
    savedObjects.registerType(_saved_object_types.reindexOperationSavedObjectType);
    savedObjects.registerType(_saved_object_types.telemetrySavedObjectType);
    savedObjects.registerType(_saved_object_types.mlSavedObjectType);
    features.registerElasticsearchFeature({
      id: 'upgrade_assistant',
      management: {
        stack: ['upgrade_assistant']
      },
      privileges: [{
        requiredClusterPrivileges: ['manage'],
        ui: []
      }]
    });

    // We need to initialize the deprecation logs plugin so that we can
    // navigate from this app to the observability app using a source_id.
    infra === null || infra === void 0 ? void 0 : infra.defineInternalSourceConfiguration(_constants.DEPRECATION_LOGS_SOURCE_ID, {
      name: 'deprecationLogs',
      description: 'deprecation logs',
      logIndices: {
        type: 'index_name',
        indexName: _constants.DEPRECATION_LOGS_INDEX
      },
      logColumns: [{
        timestampColumn: {
          id: 'timestampField'
        }
      }, {
        messageColumn: {
          id: 'messageField'
        }
      }]
    });
    const router = http.createRouter();
    const dependencies = {
      router,
      credentialStore: this.credentialStore,
      log: this.logger,
      licensing,
      getSavedObjectsService: () => {
        if (!this.savedObjectsServiceStart) {
          throw new Error('Saved Objects Start service not available');
        }
        return this.savedObjectsServiceStart;
      },
      getSecurityPlugin: () => this.securityPluginStart,
      lib: {
        handleEsError: _shared_imports.handleEsError
      },
      config: {
        featureSet: this.initialFeatureSet,
        isSecurityEnabled: () => security !== undefined && security.license.isEnabled()
      }
    };

    // Initialize version service with current kibana version
    _version.versionService.setup(this.kibanaVersion);
    (0, _register_routes.registerRoutes)(dependencies, this.getWorker.bind(this));
    if (usageCollection) {
      getStartServices().then(([{
        elasticsearch
      }]) => {
        (0, _telemetry.registerUpgradeAssistantUsageCollector)({
          elasticsearch,
          usageCollection
        });
      });
    }
  }
  start({
    savedObjects,
    elasticsearch
  }, {
    security
  }) {
    this.savedObjectsServiceStart = savedObjects;
    this.securityPluginStart = security;

    // The ReindexWorker uses a map of request headers that contain the authentication credentials
    // for a given reindex. We cannot currently store these in an the .kibana index b/c we do not
    // want to expose these credentials to any unauthenticated users. We also want to avoid any need
    // to add a user for a special index just for upgrading. This in-memory cache allows us to
    // process jobs without the browser staying on the page, but will require that jobs go into
    // a paused state if no Kibana nodes have the required credentials.

    this.worker = (0, _reindex_indices.createReindexWorker)({
      credentialStore: this.credentialStore,
      licensing: this.licensing,
      elasticsearchService: elasticsearch,
      logger: this.logger,
      savedObjects: new _server.SavedObjectsClient(this.savedObjectsServiceStart.createInternalRepository()),
      security: this.securityPluginStart
    });
    this.worker.start();
  }
  stop() {
    if (this.worker) {
      this.worker.stop();
    }
  }
}
exports.UpgradeAssistantServerPlugin = UpgradeAssistantServerPlugin;