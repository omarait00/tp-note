"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Plugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _routes = require("./routes");
var _event_log_service = require("./event_log_service");
var _es = require("./es");
var _event_log_start_service = require("./event_log_start_service");
var _saved_object_provider_registry = require("./saved_object_provider_registry");
var _find_by_ids = require("./routes/find_by_ids");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const PROVIDER = 'eventLog';
const ACTIONS = {
  starting: 'starting',
  stopping: 'stopping'
};
class Plugin {
  constructor(context) {
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "systemLogger", void 0);
    (0, _defineProperty2.default)(this, "eventLogService", void 0);
    (0, _defineProperty2.default)(this, "esContext", void 0);
    (0, _defineProperty2.default)(this, "eventLogger", void 0);
    (0, _defineProperty2.default)(this, "eventLogClientService", void 0);
    (0, _defineProperty2.default)(this, "savedObjectProviderRegistry", void 0);
    (0, _defineProperty2.default)(this, "kibanaVersion", void 0);
    (0, _defineProperty2.default)(this, "createRouteHandlerContext", () => {
      return async (context, request) => {
        return {
          getEventLogClient: () => this.eventLogClientService.getClient(request)
        };
      };
    });
    this.context = context;
    this.systemLogger = this.context.logger.get();
    this.config = this.context.config.get();
    this.savedObjectProviderRegistry = new _saved_object_provider_registry.SavedObjectProviderRegistry();
    this.kibanaVersion = this.context.env.packageInfo.version;
  }
  setup(core) {
    const kibanaIndex = core.savedObjects.getKibanaIndex();
    this.systemLogger.debug('setting up plugin');
    this.esContext = (0, _es.createEsContext)({
      logger: this.systemLogger,
      // TODO: get index prefix from config.get(kibana.index)
      indexNameRoot: kibanaIndex,
      elasticsearchClientPromise: core.getStartServices().then(([{
        elasticsearch
      }]) => elasticsearch.client.asInternalUser),
      kibanaVersion: this.kibanaVersion
    });
    this.eventLogService = new _event_log_service.EventLogService({
      config: this.config,
      esContext: this.esContext,
      systemLogger: this.systemLogger,
      kibanaUUID: this.context.env.instanceUuid,
      savedObjectProviderRegistry: this.savedObjectProviderRegistry,
      kibanaVersion: this.kibanaVersion
    });
    this.eventLogService.registerProviderActions(PROVIDER, Object.values(ACTIONS));
    this.eventLogger = this.eventLogService.getLogger({
      event: {
        provider: PROVIDER
      }
    });
    core.http.registerRouteHandlerContext('eventLog', this.createRouteHandlerContext());

    // Routes
    const router = core.http.createRouter();
    // Register routes
    (0, _routes.findRoute)(router, this.systemLogger);
    (0, _find_by_ids.findByIdsRoute)(router, this.systemLogger);
    return this.eventLogService;
  }
  start(core, {
    spaces
  }) {
    this.systemLogger.debug('starting plugin');
    if (!this.esContext) throw new Error('esContext not initialized');
    if (!this.eventLogger) throw new Error('eventLogger not initialized');
    if (!this.eventLogService) throw new Error('eventLogService not initialized');

    // launches initialization async
    if (this.eventLogService.isIndexingEntries()) {
      this.esContext.initialize();
    }

    // Log an error if initialiization didn't succeed.
    // Note that waitTillReady() is used elsewhere as a gate to having the
    // event log initialization complete - successfully or not.  Other uses
    // of this do not bother logging when success is false, as they are in
    // paths that would cause log spamming.  So we do it once, here, just to
    // ensure an unsucccess initialization is logged when it occurs.
    this.esContext.waitTillReady().then(success => {
      if (!success) {
        this.systemLogger.error(`initialization failed, events will not be indexed`);
      }
    });

    // will log the event after initialization
    this.eventLogger.logEvent({
      event: {
        action: ACTIONS.starting
      },
      message: 'eventLog starting'
    });
    this.savedObjectProviderRegistry.registerDefaultProvider(request => {
      const client = core.savedObjects.getScopedClient(request);
      return client.bulkGet.bind(client);
    });
    this.eventLogClientService = new _event_log_start_service.EventLogClientService({
      esContext: this.esContext,
      savedObjectProviderRegistry: this.savedObjectProviderRegistry,
      spacesService: spaces === null || spaces === void 0 ? void 0 : spaces.spacesService
    });
    return this.eventLogClientService;
  }
  async stop() {
    var _this$esContext;
    this.systemLogger.debug('stopping plugin');
    if (!this.eventLogger) throw new Error('eventLogger not initialized');

    // note that it's unlikely this event would ever be written,
    // when Kibana is actuaelly stopping, as it's written asynchronously
    this.eventLogger.logEvent({
      event: {
        action: ACTIONS.stopping
      },
      message: 'eventLog stopping'
    });
    this.systemLogger.debug('shutdown: waiting to finish');
    await ((_this$esContext = this.esContext) === null || _this$esContext === void 0 ? void 0 : _this$esContext.shutdown());
    this.systemLogger.debug('shutdown: finished');
  }
}
exports.Plugin = Plugin;