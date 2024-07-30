"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InternalFileService = void 0;
var _server = require("../../../../core/server");
var _file = require("../file");
var _errors = require("./errors");
var _file_client = require("../file_client/file_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Service containing methods for working with files.
 *
 * All file business logic is encapsulated in the {@link File} class.
 *
 * @internal
 */
class InternalFileService {
  constructor(metadataClient, blobStorageService, fileShareService, auditLogger, fileKindRegistry, logger) {
    this.metadataClient = metadataClient;
    this.blobStorageService = blobStorageService;
    this.fileShareService = fileShareService;
    this.auditLogger = auditLogger;
    this.fileKindRegistry = fileKindRegistry;
    this.logger = logger;
  }
  async createFile(args) {
    return this.createFileClient(args.fileKind).create({
      metadata: {
        ...args
      }
    });
  }
  writeAuditLog(event) {
    if (this.auditLogger) {
      this.auditLogger.log(event);
    } else {
      // Otherwise just log to info
      this.logger.info(event.message);
    }
  }
  async updateFile({
    attributes,
    fileKind,
    id
  }) {
    const file = await this.getById({
      fileKind,
      id
    });
    return await file.update(attributes);
  }
  async deleteFile({
    id,
    fileKind
  }) {
    const file = await this.getById({
      id,
      fileKind
    });
    await file.delete();
  }
  async get(id) {
    try {
      const {
        metadata
      } = await this.metadataClient.get({
        id
      });
      if (metadata.Status === 'DELETED') {
        throw new _errors.FileNotFoundError('File has been deleted');
      }
      return this.toFile(id, metadata, metadata.FileKind);
    } catch (e) {
      if (_server.SavedObjectsErrorHelpers.isNotFoundError(e)) {
        throw new _errors.FileNotFoundError('File not found');
      }
      this.logger.error(`Could not retrieve file: ${e}`);
      throw e;
    }
  }
  async getById({
    fileKind,
    id
  }) {
    const file = await this.get(id);
    if (file.data.fileKind !== fileKind) {
      throw new Error(`Unexpected file kind "${file.data.fileKind}", expected "${fileKind}".`);
    }
    return file;
  }
  getFileKind(id) {
    return this.fileKindRegistry.get(id);
  }
  async findFilesJSON(args) {
    const {
      total,
      files
    } = await this.metadataClient.find(args);
    return {
      total,
      files: files.map(({
        id,
        metadata
      }) => (0, _file.toJSON)(id, metadata))
    };
  }
  async getUsageMetrics() {
    return this.metadataClient.getUsageMetrics({
      esFixedSizeIndex: {
        capacity: this.blobStorageService.getStaticBlobStorageSettings().esFixedSizeIndex.capacity
      }
    });
  }
  async getByToken(token) {
    const {
      fileId
    } = await this.fileShareService.getByToken(token);
    return this.get(fileId);
  }
  toFile(id, fileMetadata, fileKind, fileClient) {
    return new _file.File(id, (0, _file.toJSON)(id, fileMetadata), fileClient !== null && fileClient !== void 0 ? fileClient : this.createFileClient(fileKind), this.logger.get(`file-${id}`));
  }
  createFileClient(fileKindId) {
    const fileKind = this.fileKindRegistry.get(fileKindId);
    return (0, _file_client.createFileClient)({
      auditLogger: this.auditLogger,
      blobStorageClient: this.blobStorageService.createBlobStorageClient(fileKind.blobStoreSettings),
      fileKindDescriptor: fileKind,
      internalFileShareService: this.fileShareService,
      logger: this.logger,
      metadataClient: this.metadataClient
    });
  }
}
exports.InternalFileService = InternalFileService;