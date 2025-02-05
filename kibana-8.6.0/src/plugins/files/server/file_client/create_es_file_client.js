"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEsFileClient = createEsFileClient;
var _blob_storage_service = require("../blob_storage_service");
var _file_client = require("./file_client");
var _file_metadata_client = require("./file_metadata_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const NO_FILE_KIND = 'none';

/**
 * Arguments to create an ES file client.
 */

/**
 * A utility function for creating an instance of {@link FileClient}
 * that will speak with ES indices only for file functionality.
 *
 * @note This client is not intended to be aware of {@link FileKind}s.
 *
 * @param arg - See {@link CreateEsFileClientArgs}
 */
function createEsFileClient(arg) {
  const {
    blobStorageIndex,
    elasticsearchClient,
    logger,
    metadataIndex,
    maxSizeBytes
  } = arg;
  return new _file_client.FileClientImpl({
    id: NO_FILE_KIND,
    http: {},
    maxSizeBytes
  }, new _file_metadata_client.EsIndexFilesMetadataClient(metadataIndex, elasticsearchClient, logger), new _blob_storage_service.ElasticsearchBlobStorageClient(elasticsearchClient, blobStorageIndex, undefined, logger), undefined, undefined, logger);
}