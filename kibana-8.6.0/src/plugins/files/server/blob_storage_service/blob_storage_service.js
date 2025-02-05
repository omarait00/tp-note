"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BlobStorageService = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _common = require("../../common");
var _adapters = require("./adapters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

class BlobStorageService {
  /**
   * The number of uploads per Kibana instance that can be running simultaneously
   */

  constructor(esClient, logger) {
    (0, _defineProperty2.default)(this, "concurrentUploadsToES", 20);
    this.esClient = esClient;
    this.logger = logger;
    _adapters.ElasticsearchBlobStorageClient.configureConcurrentUpload(this.concurrentUploadsToES);
  }
  createESBlobStorage({
    index,
    chunkSize
  }) {
    return new _adapters.ElasticsearchBlobStorageClient(this.esClient, index, chunkSize, this.logger.get('elasticsearch-blob-storage'));
  }
  createBlobStorageClient(args) {
    return this.createESBlobStorage({
      ...(args === null || args === void 0 ? void 0 : args.esFixedSizeIndex)
    });
  }
  getStaticBlobStorageSettings() {
    return {
      [_common.ES_FIXED_SIZE_INDEX_BLOB_STORE]: {
        capacity: _adapters.MAX_BLOB_STORE_SIZE_BYTES
      }
    };
  }
}
exports.BlobStorageService = BlobStorageService;