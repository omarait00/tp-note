"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MAX_BLOB_STORE_SIZE_BYTES = exports.ElasticsearchBlobStorageClient = exports.BLOB_STORAGE_SYSTEM_INDEX_NAME = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _assert = _interopRequireDefault(require("assert"));
var _lodash = require("lodash");
var _elasticsearch = require("@elastic/elasticsearch");
var _std = require("@kbn/std");
var _promises = require("stream/promises");
var _util = require("util");
var _rxjs = require("rxjs");
var _ebtTools = require("@kbn/ebt-tools");
var _plugin = require("../../../plugin");
var _performance = require("../../../performance");
var _content_stream = require("./content_stream");
var _mappings = require("./mappings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Export this value for convenience to be used in tests. Do not use outside of
 * this adapter.
 * @internal
 */
const BLOB_STORAGE_SYSTEM_INDEX_NAME = '.kibana_blob_storage';
exports.BLOB_STORAGE_SYSTEM_INDEX_NAME = BLOB_STORAGE_SYSTEM_INDEX_NAME;
const MAX_BLOB_STORE_SIZE_BYTES = 50 * 1024 * 1024 * 1024; // 50 GiB
exports.MAX_BLOB_STORE_SIZE_BYTES = MAX_BLOB_STORE_SIZE_BYTES;
class ElasticsearchBlobStorageClient {
  /**
   * Call this function once to globally set a concurrent upload limit for
   * all {@link ElasticsearchBlobStorageClient} instances.
   */
  static configureConcurrentUpload(capacity) {
    this.defaultSemaphore = new _std.Semaphore(capacity);
  }
  constructor(esClient, index = BLOB_STORAGE_SYSTEM_INDEX_NAME, chunkSize, logger,
  /**
   * Override the default concurrent upload limit by passing in a different
   * semaphore
   */
  uploadSemaphore = ElasticsearchBlobStorageClient.defaultSemaphore) {
    this.esClient = esClient;
    this.index = index;
    this.chunkSize = chunkSize;
    this.logger = logger;
    this.uploadSemaphore = uploadSemaphore;
    (0, _assert.default)(this.uploadSemaphore, `No default semaphore provided and no semaphore was passed in.`);
  }

  /**
   * This function acts as a singleton i.t.o. execution: it can only be called once.
   * Subsequent calls should not re-execute it.
   *
   * There is a known issue where calling this function simultaneously can result
   * in a race condition where one of the calls will fail because the index is already
   * being created. This is only an issue for the very first time the index is being
   * created.
   */

  async upload(src, options = {}) {
    const {
      transforms,
      id
    } = options;
    await ElasticsearchBlobStorageClient.createIndexIfNotExists(this.index, this.esClient, this.logger);
    const processUpload = async () => {
      try {
        const analytics = _plugin.FilesPlugin.getAnalytics();
        const dest = (0, _content_stream.getWritableContentStream)({
          id,
          client: this.esClient,
          index: this.index,
          logger: this.logger.get('content-stream-upload'),
          parameters: {
            maxChunkSize: this.chunkSize
          }
        });
        const start = performance.now();
        await (0, _promises.pipeline)([src, ...(transforms !== null && transforms !== void 0 ? transforms : []), dest]);
        const end = performance.now();
        const _id = dest.getContentReferenceId();
        const size = dest.getBytesWritten();
        const perfArgs = {
          eventName: _performance.FILE_UPLOAD_PERFORMANCE_EVENT_NAME,
          duration: end - start,
          key1: 'size',
          value1: size,
          meta: {
            datasource: 'es',
            id: _id,
            index: this.index,
            chunkSize: this.chunkSize
          }
        };
        if (analytics) {
          (0, _ebtTools.reportPerformanceMetricEvent)(analytics, perfArgs);
        }
        return {
          id: _id,
          size
        };
      } catch (e) {
        this.logger.error(`Could not write chunks to Elasticsearch for id ${id}: ${e}`);
        throw e;
      }
    };
    return (0, _rxjs.lastValueFrom)((0, _rxjs.defer)(processUpload).pipe(this.uploadSemaphore.acquire()));
  }
  getReadableContentStream(id, size) {
    return (0, _content_stream.getReadableContentStream)({
      id,
      client: this.esClient,
      index: this.index,
      logger: this.logger.get('content-stream-download'),
      parameters: {
        size
      }
    });
  }
  async download({
    id,
    size
  }) {
    return this.getReadableContentStream(id, size);
  }
  async delete(id) {
    try {
      const dest = (0, _content_stream.getWritableContentStream)({
        id,
        client: this.esClient,
        index: this.index,
        logger: this.logger.get('content-stream-delete')
      });
      /** @note Overwriting existing content with an empty buffer to remove all the chunks. */
      await (0, _util.promisify)(dest.end.bind(dest, '', 'utf8'))();
    } catch (e) {
      this.logger.error(`Could not delete file: ${e}`);
      throw e;
    }
  }
}
exports.ElasticsearchBlobStorageClient = ElasticsearchBlobStorageClient;
(0, _defineProperty2.default)(ElasticsearchBlobStorageClient, "defaultSemaphore", void 0);
(0, _defineProperty2.default)(ElasticsearchBlobStorageClient, "createIndexIfNotExists", (0, _lodash.once)(async (index, esClient, logger) => {
  try {
    if (await esClient.indices.exists({
      index
    })) {
      logger.debug(`${index} already exists.`);
      return;
    }
    logger.info(`Creating ${index} for Elasticsearch blob store.`);
    await esClient.indices.create({
      index,
      wait_for_active_shards: 'all',
      body: {
        settings: {
          number_of_shards: 1,
          auto_expand_replicas: '0-1'
        },
        mappings: _mappings.mappings
      }
    });
  } catch (e) {
    if (e instanceof _elasticsearch.errors.ResponseError && e.statusCode === 400) {
      logger.warn('Unable to create blob storage index, it may have been created already.');
    }
    // best effort
  }
}));