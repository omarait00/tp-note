"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFileInfo = exports.getFileDownloadStream = void 0;
var _server = require("../../../../../../../src/plugins/files/server");
var _elasticsearch = require("@elastic/elasticsearch");
var _errors = require("../../errors");
var _constants = require("../../../../common/endpoint/constants");
var _errors2 = require("../../../../common/endpoint/errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getFileClient = (esClient, logger) => {
  return (0, _server.createEsFileClient)({
    metadataIndex: _constants.FILE_STORAGE_METADATA_INDEX,
    blobStorageIndex: _constants.FILE_STORAGE_DATA_INDEX,
    elasticsearchClient: esClient,
    logger
  });
};
const getFileRetrievalError = (error, fileId) => {
  if (error instanceof _elasticsearch.errors.ResponseError) {
    const statusCode = error.statusCode;

    // 404 will be returned if file id is not found -or- index does not exist yet.
    // Using the `NotFoundError` error class will result in the API returning a 404
    if (statusCode === 404) {
      return new _errors.NotFoundError(`File with id [${fileId}] not found`, error);
    }
  }
  return new _errors2.EndpointError(`Failed to get file using id [${fileId}]: ${error.message}`, error);
};

/**
 * Returns a NodeJS `Readable` data stream to a file
 * @param esClient
 * @param logger
 * @param fileId
 */
const getFileDownloadStream = async (esClient, logger, fileId) => {
  try {
    const fileClient = getFileClient(esClient, logger);
    const file = await fileClient.get({
      id: fileId
    });
    const {
      name: fileName,
      mimeType
    } = file.data;
    return {
      stream: await file.downloadContent(),
      fileName,
      mimeType
    };
  } catch (error) {
    throw getFileRetrievalError(error, fileId);
  }
};

/**
 * Retrieve information about a file
 *
 * @param esClient
 * @param logger
 * @param fileId
 */
exports.getFileDownloadStream = getFileDownloadStream;
const getFileInfo = async (esClient, logger, fileId) => {
  try {
    const fileClient = getFileClient(esClient, logger);
    const file = await fileClient.get({
      id: fileId
    });
    const {
      name,
      id,
      mimeType,
      size,
      status,
      created
    } = file.data;
    let fileHasChunks = true;
    if (status === 'READY') {
      fileHasChunks = await doesFileHaveChunks(esClient, fileId);
      if (!fileHasChunks) {
        logger.debug(`File with id [${fileId}] has no data chunks. Status will be adjusted to DELETED`);
      }
    }
    return {
      name,
      id,
      mimeType,
      size,
      created,
      status: fileHasChunks ? status : 'DELETED'
    };
  } catch (error) {
    throw getFileRetrievalError(error, fileId);
  }
};
exports.getFileInfo = getFileInfo;
const doesFileHaveChunks = async (esClient, fileId) => {
  var _chunks$hits, _chunks$hits$total;
  const chunks = await esClient.search({
    index: _constants.FILE_STORAGE_DATA_INDEX,
    body: {
      query: {
        term: {
          bid: fileId
        }
      },
      // Setting `_source` to false - we don't need the actual document to be returned
      _source: false
    }
  });
  return Boolean((_chunks$hits = chunks.hits) === null || _chunks$hits === void 0 ? void 0 : (_chunks$hits$total = _chunks$hits.total) === null || _chunks$hits$total === void 0 ? void 0 : _chunks$hits$total.value);
};