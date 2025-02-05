"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilesPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _constants = require("../common/constants");
var _file_kinds_registry = require("../common/file_kinds_registry");
var _blob_storage_service = require("./blob_storage_service");
var _file_service = require("./file_service");
var _routes = require("./routes");
var _usage = require("./usage");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

class FilesPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "fileServiceFactory", void 0);
    (0, _defineProperty2.default)(this, "securitySetup", void 0);
    (0, _defineProperty2.default)(this, "securityStart", void 0);
    this.logger = initializerContext.logger.get();
  }
  static getAnalytics() {
    return this.analytics;
  }
  static setAnalytics(analytics) {
    this.analytics = analytics;
  }
  setup(core, {
    security,
    usageCollection
  }) {
    const usageCounter = usageCollection === null || usageCollection === void 0 ? void 0 : usageCollection.createUsageCounter(_constants.PLUGIN_ID);
    _file_service.FileServiceFactory.setup(core.savedObjects, usageCounter);
    this.securitySetup = security;
    core.http.registerRouteHandlerContext(_constants.PLUGIN_ID, async (ctx, req) => {
      return {
        security: this.securityStart,
        fileService: {
          asCurrentUser: () => this.fileServiceFactory.asScoped(req),
          asInternalUser: () => this.fileServiceFactory.asInternal(),
          logger: this.logger.get('files-routes'),
          usageCounter: usageCounter ? counter => usageCounter.incrementCounter({
            counterName: counter
          }) : undefined
        }
      };
    });
    const router = core.http.createRouter();
    (0, _routes.registerRoutes)(router);
    (0, _file_kinds_registry.setFileKindsRegistry)(new _file_kinds_registry.FileKindsRegistryImpl(fk => {
      (0, _routes.registerFileKindRoutes)(router, fk);
    }));
    (0, _usage.registerUsageCollector)({
      usageCollection,
      getFileService: () => {
        var _this$fileServiceFact;
        return (_this$fileServiceFact = this.fileServiceFactory) === null || _this$fileServiceFact === void 0 ? void 0 : _this$fileServiceFact.asInternal();
      }
    });
    return {
      registerFileKind(fileKind) {
        (0, _file_kinds_registry.getFileKindsRegistry)().register(fileKind);
      }
    };
  }
  start(coreStart, {
    security
  }) {
    const {
      savedObjects,
      analytics
    } = coreStart;
    this.securityStart = security;
    FilesPlugin.setAnalytics(analytics);
    const esClient = coreStart.elasticsearch.client.asInternalUser;
    const blobStorageService = new _blob_storage_service.BlobStorageService(esClient, this.logger.get('blob-storage-service'));
    this.fileServiceFactory = new _file_service.FileServiceFactory(savedObjects, blobStorageService, this.securitySetup, (0, _file_kinds_registry.getFileKindsRegistry)(), this.logger.get('files-service'));
    return {
      fileServiceFactory: this.fileServiceFactory
    };
  }
  stop() {}
}
exports.FilesPlugin = FilesPlugin;
(0, _defineProperty2.default)(FilesPlugin, "analytics", void 0);