"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileClientImpl = void 0;
exports.createFileClient = createFileClient;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _moment = _interopRequireDefault(require("moment"));
var _mime = _interopRequireDefault(require("mime"));
var _cuid = _interopRequireDefault(require("cuid"));
var _server = require("../../../../core/server");
var _usage = require("../usage");
var _file = require("../file");
var _stream_transforms = require("./stream_transforms");
var _audit_events = require("../audit_events");
var _to_json = require("../file/to_json");
var _utils = require("./utils");
var _performance = require("../performance");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function createFileClient({
  fileKindDescriptor,
  auditLogger,
  blobStorageClient,
  internalFileShareService,
  logger,
  metadataClient
}) {
  return new FileClientImpl(fileKindDescriptor, metadataClient, blobStorageClient, internalFileShareService, auditLogger, logger);
}
class FileClientImpl {
  /**
   * A usage counter instance that is shared across all FileClient instances.
   */

  static configureUsageCounter(uc) {
    FileClientImpl.usageCounter = uc;
  }
  constructor(fileKindDescriptor, metadataClient, blobStorageClient, internalFileShareService, auditLogger, logger) {
    (0, _defineProperty2.default)(this, "logAuditEvent", void 0);
    (0, _defineProperty2.default)(this, "deleteContent", arg => {
      return this.blobStorageClient.delete(arg);
    });
    (0, _defineProperty2.default)(this, "upload", async (id, rs, options) => {
      var _this$fileKindDescrip;
      return this.blobStorageClient.upload(rs, {
        ...options,
        transforms: [...((options === null || options === void 0 ? void 0 : options.transforms) || []), (0, _stream_transforms.enforceMaxByteSizeTransform)((_this$fileKindDescrip = this.fileKindDescriptor.maxSizeBytes) !== null && _this$fileKindDescrip !== void 0 ? _this$fileKindDescrip : Infinity)],
        id
      });
    });
    (0, _defineProperty2.default)(this, "download", async args => {
      this.incrementUsageCounter('DOWNLOAD');
      try {
        const perf = {
          eventData: {
            eventName: _performance.FILE_DOWNLOAD_PERFORMANCE_EVENT_NAME,
            key1: 'size',
            value1: args.size,
            meta: {
              id: args.id
            }
          }
        };
        return (0, _performance.withReportPerformanceMetric)(perf, () => this.blobStorageClient.download(args));
      } catch (e) {
        this.incrementUsageCounter('DOWNLOAD_ERROR');
        throw e;
      }
    });
    (0, _defineProperty2.default)(this, "unshare", async arg => {
      if (!this.internalFileShareService) {
        throw new Error('#delete shares is not implemented');
      }
      const result = await this.internalFileShareService.delete(arg);
      this.logAuditEvent((0, _audit_events.createAuditEvent)({
        action: 'delete',
        message: `Removed share with id "${arg.id}"`
      }));
      return result;
    });
    (0, _defineProperty2.default)(this, "listShares", args => {
      if (!this.internalFileShareService) {
        throw new Error('#list shares not implemented');
      }
      return this.internalFileShareService.list(args);
    });
    this.fileKindDescriptor = fileKindDescriptor;
    this.metadataClient = metadataClient;
    this.blobStorageClient = blobStorageClient;
    this.internalFileShareService = internalFileShareService;
    this.logger = logger;
    this.logAuditEvent = e => {
      if (auditLogger) {
        auditLogger.log(e);
      } else if (e) {
        this.logger.info(JSON.stringify(e.event, null, 2));
      }
    };
  }
  getCounters() {
    return (0, _usage.getCounters)(this.fileKind);
  }
  incrementUsageCounter(counter) {
    var _FileClientImpl$usage;
    (_FileClientImpl$usage = FileClientImpl.usageCounter) === null || _FileClientImpl$usage === void 0 ? void 0 : _FileClientImpl$usage.incrementCounter({
      counterName: this.getCounters()[counter]
    });
  }
  instantiateFile(id, metadata) {
    return new _file.File(id, (0, _to_json.toJSON)(id, {
      ...(0, _utils.createDefaultFileAttributes)(),
      ...metadata
    }), this, this.logger);
  }
  get fileKind() {
    return this.fileKindDescriptor.id;
  }
  async create({
    id,
    metadata
  }) {
    var _ref;
    const serializedMetadata = (0, _to_json.serializeJSON)({
      ...metadata,
      mimeType: metadata.mime
    });
    const result = await this.metadataClient.create({
      id: id || (0, _cuid.default)(),
      metadata: {
        ...(0, _utils.createDefaultFileAttributes)(),
        ...serializedMetadata,
        name: serializedMetadata.name,
        extension: (_ref = serializedMetadata.mime_type && _mime.default.getExtension(serializedMetadata.mime_type)) !== null && _ref !== void 0 ? _ref : undefined,
        FileKind: this.fileKind
      }
    });
    this.logAuditEvent((0, _audit_events.createAuditEvent)({
      action: 'create',
      message: `Created file "${result.metadata.name}" of kind "${this.fileKind}" and id "${result.id}"`
    }));
    return this.instantiateFile(result.id, {
      ...result.metadata,
      FileKind: this.fileKind
    });
  }
  async get(arg) {
    const {
      id,
      metadata
    } = await this.metadataClient.get(arg);
    return this.instantiateFile(id, metadata);
  }
  async internalUpdate(id, metadata) {
    await this.metadataClient.update({
      id,
      metadata: (0, _to_json.serializeJSON)(metadata)
    });
  }
  async update(id, metadata) {
    const {
      alt,
      meta,
      name
    } = metadata;
    const payload = {
      name,
      alt,
      meta,
      updated: (0, _moment.default)().toISOString()
    };
    await this.internalUpdate(id, payload);
  }
  async find(arg) {
    const result = await this.metadataClient.find(arg);
    return {
      total: result.total,
      files: result.files.map(({
        id,
        metadata
      }) => this.instantiateFile(id, metadata))
    };
  }
  async delete({
    id,
    hasContent = true
  }) {
    this.incrementUsageCounter('DELETE');
    try {
      if (this.internalFileShareService) {
        // Stop sharing this file
        await this.internalFileShareService.deleteForFile({
          id
        });
      }
      if (hasContent) await this.blobStorageClient.delete(id);
      await this.metadataClient.delete({
        id
      });
      this.logAuditEvent((0, _audit_events.createAuditEvent)({
        action: 'delete',
        outcome: 'success',
        message: `Deleted file with "${id}"`
      }));
    } catch (e) {
      if (_server.SavedObjectsErrorHelpers.isNotFoundError(e)) {
        this.incrementUsageCounter('DELETE_ERROR_NOT_FOUND');
      } else {
        this.incrementUsageCounter('DELETE_ERROR');
      }
      throw e;
    }
  }
  async share({
    file,
    name,
    validUntil
  }) {
    if (!this.internalFileShareService) {
      throw new Error('#share not implemented');
    }
    const shareObject = await this.internalFileShareService.share({
      file,
      name,
      validUntil
    });
    this.logAuditEvent((0, _audit_events.createAuditEvent)({
      action: 'create',
      message: `Shared file "${file.data.name}" with id "${file.data.id}"`
    }));
    return shareObject;
  }
}
exports.FileClientImpl = FileClientImpl;
(0, _defineProperty2.default)(FileClientImpl, "usageCounter", void 0);