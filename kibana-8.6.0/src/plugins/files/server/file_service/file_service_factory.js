"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileServiceFactoryImpl = void 0;
var _saved_objects = require("../saved_objects");
var _file_client = require("../file_client/file_client");
var _file_share_service = require("../file_share_service");
var _internal_file_service = require("./internal_file_service");
var _file_client2 = require("../file_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Factory for creating {@link FileServiceStart} instances.
 */
class FileServiceFactoryImpl {
  constructor(savedObjectsService, blobStorageService, security, fileKindRegistry, logger) {
    this.savedObjectsService = savedObjectsService;
    this.blobStorageService = blobStorageService;
    this.security = security;
    this.fileKindRegistry = fileKindRegistry;
    this.logger = logger;
  }
  createFileService(req) {
    var _this$security, _this$security2;
    const soClient = req ? this.savedObjectsService.getScopedClient(req, {
      includedHiddenTypes: _saved_objects.hiddenTypes
    }) : this.savedObjectsService.createInternalRepository(_saved_objects.hiddenTypes);
    const auditLogger = req ? (_this$security = this.security) === null || _this$security === void 0 ? void 0 : _this$security.audit.asScoped(req) : (_this$security2 = this.security) === null || _this$security2 === void 0 ? void 0 : _this$security2.audit.withoutRequest;
    const internalFileShareService = new _file_share_service.InternalFileShareService(soClient);
    const soMetadataClient = new _file_client2.SavedObjectsFileMetadataClient(_saved_objects.fileObjectType.name, soClient, this.logger.get('so-metadata-client'));
    const internalFileService = new _internal_file_service.InternalFileService(soMetadataClient, this.blobStorageService, internalFileShareService, auditLogger, this.fileKindRegistry, this.logger);
    return {
      async create(args) {
        return internalFileService.createFile(args);
      },
      async update(args) {
        await internalFileService.updateFile(args);
      },
      async delete(args) {
        return internalFileService.deleteFile(args);
      },
      async getById(args) {
        return internalFileService.getById(args);
      },
      async find(args) {
        return internalFileService.findFilesJSON(args);
      },
      async getUsageMetrics() {
        return internalFileService.getUsageMetrics();
      },
      async getByToken(token) {
        return internalFileService.getByToken(token);
      },
      getShareObject: internalFileShareService.get.bind(internalFileShareService),
      updateShareObject: internalFileShareService.update.bind(internalFileShareService),
      deleteShareObject: internalFileShareService.delete.bind(internalFileShareService),
      listShareObjects: internalFileShareService.list.bind(internalFileShareService)
    };
  }
  asScoped(req) {
    return this.createFileService(req);
  }
  asInternal() {
    return this.createFileService();
  }

  /**
   * This function can only called during Kibana's setup phase
   */
  static setup(savedObjectsSetup, usageCounter) {
    savedObjectsSetup.registerType(_saved_objects.fileObjectType);
    savedObjectsSetup.registerType(_saved_objects.fileShareObjectType);
    if (usageCounter) {
      _file_client.FileClientImpl.configureUsageCounter(usageCounter);
      _file_share_service.InternalFileShareService.configureUsageCounter(usageCounter);
    }
  }
}
exports.FileServiceFactoryImpl = FileServiceFactoryImpl;