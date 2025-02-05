"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpacesPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _licensing = require("../common/licensing");
var _capabilities = require("./capabilities");
var _default_space = require("./default_space");
var _request_interceptors = require("./lib/request_interceptors");
var _spaces_tutorial_context_factory = require("./lib/spaces_tutorial_context_factory");
var _external = require("./routes/api/external");
var _internal = require("./routes/api/internal");
var _views = require("./routes/views");
var _saved_objects = require("./saved_objects");
var _spaces_client = require("./spaces_client");
var _spaces_service = require("./spaces_service");
var _usage_collection = require("./usage_collection");
var _usage_stats = require("./usage_stats");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class SpacesPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "config$", void 0);
    (0, _defineProperty2.default)(this, "log", void 0);
    (0, _defineProperty2.default)(this, "spacesLicenseService", new _licensing.SpacesLicenseService());
    (0, _defineProperty2.default)(this, "spacesClientService", void 0);
    (0, _defineProperty2.default)(this, "spacesService", void 0);
    (0, _defineProperty2.default)(this, "spacesServiceStart", void 0);
    (0, _defineProperty2.default)(this, "defaultSpaceService", void 0);
    this.config$ = initializerContext.config.create();
    this.log = initializerContext.logger.get();
    this.spacesService = new _spaces_service.SpacesService();
    this.spacesClientService = new _spaces_client.SpacesClientService(message => this.log.debug(message));
  }
  setup(core, plugins) {
    const spacesClientSetup = this.spacesClientService.setup({
      config$: this.config$
    });
    const spacesServiceSetup = this.spacesService.setup({
      basePath: core.http.basePath
    });
    const getSpacesService = () => {
      if (!this.spacesServiceStart) {
        throw new Error('spaces service has not been initialized!');
      }
      return this.spacesServiceStart;
    };
    const usageStatsServicePromise = new _usage_stats.UsageStatsService(this.log).setup({
      getStartServices: core.getStartServices
    });
    const savedObjectsService = new _saved_objects.SpacesSavedObjectsService();
    savedObjectsService.setup({
      core,
      getSpacesService
    });
    const {
      license
    } = this.spacesLicenseService.setup({
      license$: plugins.licensing.license$
    });
    this.defaultSpaceService = new _default_space.DefaultSpaceService();
    this.defaultSpaceService.setup({
      coreStatus: core.status,
      getSavedObjects: async () => (await core.getStartServices())[0].savedObjects,
      license$: plugins.licensing.license$,
      spacesLicense: license,
      logger: this.log
    });
    (0, _views.initSpacesViewsRoutes)({
      httpResources: core.http.resources,
      basePath: core.http.basePath,
      logger: this.log
    });
    const externalRouter = core.http.createRouter();
    (0, _external.initExternalSpacesApi)({
      externalRouter,
      log: this.log,
      getStartServices: core.getStartServices,
      getSpacesService,
      usageStatsServicePromise
    });
    const internalRouter = core.http.createRouter();
    (0, _internal.initInternalSpacesApi)({
      internalRouter,
      getSpacesService
    });
    (0, _request_interceptors.initSpacesRequestInterceptors)({
      http: core.http,
      log: this.log,
      getSpacesService,
      features: plugins.features
    });
    (0, _capabilities.setupCapabilities)(core, getSpacesService, this.log);
    if (plugins.usageCollection) {
      (0, _usage_collection.registerSpacesUsageCollector)(plugins.usageCollection, {
        kibanaIndex: core.savedObjects.getKibanaIndex(),
        features: plugins.features,
        licensing: plugins.licensing,
        usageStatsServicePromise
      });
    }
    if (plugins.home) {
      plugins.home.tutorials.addScopedTutorialContextFactory((0, _spaces_tutorial_context_factory.createSpacesTutorialContextFactory)(getSpacesService));
    }
    return {
      spacesClient: spacesClientSetup,
      spacesService: spacesServiceSetup
    };
  }
  start(core) {
    const spacesClientStart = this.spacesClientService.start(core);
    this.spacesServiceStart = this.spacesService.start({
      basePath: core.http.basePath,
      spacesClientService: spacesClientStart
    });
    return {
      spacesService: this.spacesServiceStart
    };
  }
  stop() {
    if (this.defaultSpaceService) {
      this.defaultSpaceService.stop();
    }
  }
}
exports.SpacesPlugin = SpacesPlugin;