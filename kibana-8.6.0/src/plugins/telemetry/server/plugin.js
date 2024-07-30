"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TelemetryPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _url = require("url");
var _rxjs = require("rxjs");
var _analyticsShippersElasticV3Server = require("@kbn/analytics-shippers-elastic-v3-server");
var _server = require("../../../core/server");
var _routes = require("./routes");
var _telemetry_collection = require("./telemetry_collection");
var _collectors = require("./collectors");
var _fetcher = require("./fetcher");
var _telemetry_repository = require("./telemetry_repository");
var _constants = require("../common/constants");
var _telemetry_config = require("../common/telemetry_config");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

class TelemetryPlugin {
  /**
   * @private Used to mark the completion of the old UI Settings migration
   */

  /**
   * @private
   * Used to interact with the Telemetry Saved Object.
   * Some users may not have access to the document but some queries
   * are still relevant to them like fetching when was the last time it was reported.
   *
   * Using the internal client in all cases ensures the permissions to interact the document.
   */

  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "currentKibanaVersion", void 0);
    (0, _defineProperty2.default)(this, "initialConfig", void 0);
    (0, _defineProperty2.default)(this, "config$", void 0);
    (0, _defineProperty2.default)(this, "isOptedIn$", void 0);
    (0, _defineProperty2.default)(this, "isOptedIn", void 0);
    (0, _defineProperty2.default)(this, "isDev", void 0);
    (0, _defineProperty2.default)(this, "fetcherTask", void 0);
    (0, _defineProperty2.default)(this, "savedObjectsInternalRepository", void 0);
    (0, _defineProperty2.default)(this, "savedObjectsInternalClient$", new _rxjs.ReplaySubject(1));
    (0, _defineProperty2.default)(this, "pluginStop$", new _rxjs.ReplaySubject(1));
    (0, _defineProperty2.default)(this, "security", void 0);
    this.logger = initializerContext.logger.get();
    this.isDev = initializerContext.env.mode.dev;
    this.currentKibanaVersion = initializerContext.env.packageInfo.version;
    this.config$ = initializerContext.config.create();
    this.initialConfig = initializerContext.config.get();
    this.fetcherTask = new _fetcher.FetcherTask({
      ...initializerContext,
      logger: this.logger
    });

    // If the opt-in selection cannot be changed, set it as early as possible.
    const {
      optIn,
      allowChangingOptInStatus
    } = this.initialConfig;
    this.isOptedIn = allowChangingOptInStatus === false ? optIn : undefined;

    // Poll for the opt-in status
    this.isOptedIn$ = (0, _rxjs.timer)(0, _constants.OPT_IN_POLL_INTERVAL_MS).pipe((0, _rxjs.exhaustMap)(() => this.getOptInStatus()), (0, _rxjs.takeUntil)(this.pluginStop$), (0, _rxjs.startWith)(this.isOptedIn), (0, _rxjs.filter)(isOptedIn => typeof isOptedIn === 'boolean'), (0, _rxjs.distinctUntilChanged)(), (0, _rxjs.tap)(optedIn => this.isOptedIn = optedIn), (0, _rxjs.shareReplay)(1));
  }
  setup({
    analytics,
    http,
    savedObjects
  }, {
    usageCollection,
    telemetryCollectionManager
  }) {
    if (this.isOptedIn !== undefined) {
      analytics.optIn({
        global: {
          enabled: this.isOptedIn
        }
      });
    }
    const currentKibanaVersion = this.currentKibanaVersion;
    analytics.registerShipper(_analyticsShippersElasticV3Server.ElasticV3ServerShipper, {
      channelName: 'kibana-server',
      version: currentKibanaVersion,
      sendTo: this.initialConfig.sendUsageTo === 'prod' ? 'production' : 'staging'
    });
    analytics.registerContextProvider({
      name: 'telemetry labels',
      context$: this.config$.pipe((0, _rxjs.map)(({
        labels
      }) => ({
        labels
      }))),
      schema: {
        labels: {
          type: 'pass_through',
          _meta: {
            description: 'Custom labels added to the telemetry.labels config in the kibana.yml'
          }
        }
      }
    });
    const config$ = this.config$;
    const isDev = this.isDev;
    (0, _telemetry_collection.registerCollection)(telemetryCollectionManager);
    const router = http.createRouter();
    (0, _routes.registerRoutes)({
      config$,
      currentKibanaVersion,
      isDev,
      logger: this.logger,
      router,
      telemetryCollectionManager,
      savedObjectsInternalClient$: this.savedObjectsInternalClient$,
      getSecurity: () => this.security
    });
    this.registerMappings(opts => savedObjects.registerType(opts));
    this.registerUsageCollectors(usageCollection);
    return {
      getTelemetryUrl: async () => {
        const {
          sendUsageTo
        } = await (0, _rxjs.firstValueFrom)(config$);
        const telemetryUrl = (0, _telemetry_config.getTelemetryChannelEndpoint)({
          env: sendUsageTo,
          channelName: 'snapshot'
        });
        return new _url.URL(telemetryUrl);
      }
    };
  }
  start(core, {
    telemetryCollectionManager,
    security
  }) {
    const {
      analytics,
      savedObjects
    } = core;
    this.isOptedIn$.subscribe(enabled => analytics.optIn({
      global: {
        enabled
      }
    }));
    const savedObjectsInternalRepository = savedObjects.createInternalRepository();
    this.savedObjectsInternalRepository = savedObjectsInternalRepository;
    this.savedObjectsInternalClient$.next(new _server.SavedObjectsClient(savedObjectsInternalRepository));
    this.security = security;
    this.startFetcher(core, telemetryCollectionManager);
    return {
      getIsOptedIn: async () => this.isOptedIn === true
    };
  }
  stop() {
    this.pluginStop$.next();
    this.pluginStop$.complete();
    this.savedObjectsInternalClient$.complete();
    this.fetcherTask.stop();
  }
  async getOptInStatus() {
    const internalRepositoryClient = await (0, _rxjs.firstValueFrom)(this.savedObjectsInternalClient$, {
      defaultValue: undefined
    });
    if (!internalRepositoryClient) return;
    let telemetrySavedObject;
    try {
      telemetrySavedObject = await (0, _telemetry_repository.getTelemetrySavedObject)(internalRepositoryClient);
    } catch (err) {
      this.logger.debug('Failed to check telemetry opt-in status: ' + err.message);
    }

    // If we can't get the saved object due to permissions or other error other than 404, skip this round.
    if (typeof telemetrySavedObject === 'undefined' || telemetrySavedObject === false) {
      return;
    }
    const config = await (0, _rxjs.firstValueFrom)(this.config$);
    const allowChangingOptInStatus = config.allowChangingOptInStatus;
    const configTelemetryOptIn = typeof config.optIn === 'undefined' ? null : config.optIn;
    const currentKibanaVersion = this.currentKibanaVersion;
    const isOptedIn = (0, _telemetry_config.getTelemetryOptIn)({
      currentKibanaVersion,
      telemetrySavedObject,
      allowChangingOptInStatus,
      configTelemetryOptIn
    });
    if (typeof isOptedIn === 'boolean') {
      return isOptedIn;
    }
  }
  startFetcher(core, telemetryCollectionManager) {
    // We start the fetcher having updated everything we need to using the config settings
    this.fetcherTask.start(core, {
      telemetryCollectionManager
    });
  }
  registerMappings(registerType) {
    registerType({
      name: 'telemetry',
      hidden: false,
      namespaceType: 'agnostic',
      mappings: {
        properties: {
          enabled: {
            type: 'boolean'
          },
          sendUsageFrom: {
            type: 'keyword'
          },
          lastReported: {
            type: 'date'
          },
          lastVersionChecked: {
            type: 'keyword'
          },
          userHasSeenNotice: {
            type: 'boolean'
          },
          reportFailureCount: {
            type: 'integer'
          },
          reportFailureVersion: {
            type: 'keyword'
          },
          allowChangingOptInStatus: {
            type: 'boolean'
          }
        }
      }
    });
  }
  registerUsageCollectors(usageCollection) {
    const getSavedObjectsClient = () => this.savedObjectsInternalRepository;
    (0, _collectors.registerTelemetryPluginUsageCollector)(usageCollection, {
      currentKibanaVersion: this.currentKibanaVersion,
      config$: this.config$,
      getSavedObjectsClient
    });
    (0, _collectors.registerTelemetryUsageCollector)(usageCollection, this.config$);
  }
}
exports.TelemetryPlugin = TelemetryPlugin;