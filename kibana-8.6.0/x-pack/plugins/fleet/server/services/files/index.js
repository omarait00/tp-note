"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fileIdsWithoutChunksByIndex = fileIdsWithoutChunksByIndex;
exports.getFilesByStatus = getFilesByStatus;
exports.updateFilesStatus = updateFilesStatus;
var _constants = require("../../../common/constants");
var _services = require("../../../common/services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Gets files with given status
 *
 * @param esClient
 * @param abortController
 * @param status
 */
async function getFilesByStatus(esClient, abortController, status = 'READY') {
  const result = await esClient.search({
    index: _constants.FILE_STORAGE_METADATA_INDEX_PATTERN,
    body: {
      size: _constants.ES_SEARCH_LIMIT,
      query: {
        term: {
          'file.Status': status
        }
      },
      _source: false
    },
    ignore_unavailable: true
  }, {
    signal: abortController.signal
  });
  return result.hits.hits;
}
/**
 * Returns subset of fileIds that don't have any file chunks
 *
 * @param esClient
 * @param abortController
 * @param files
 */
async function fileIdsWithoutChunksByIndex(esClient, abortController, files) {
  const allFileIds = new Set();
  const noChunkFileIdsByIndex = files.reduce((acc, file) => {
    allFileIds.add(file._id);
    const fileIds = acc[file._index];
    acc[file._index] = fileIds ? fileIds.add(file._id) : new Set([file._id]);
    return acc;
  }, {});
  const chunks = await esClient.search({
    index: _constants.FILE_STORAGE_DATA_INDEX_PATTERN,
    body: {
      size: _constants.ES_SEARCH_LIMIT,
      query: {
        bool: {
          must: [{
            terms: {
              bid: Array.from(allFileIds)
            }
          }, {
            term: {
              last: true
            }
          }]
        }
      },
      _source: ['bid']
    }
  }, {
    signal: abortController.signal
  });
  chunks.hits.hits.forEach(hit => {
    var _hit$_source, _noChunkFileIdsByInde;
    const fileId = (_hit$_source = hit._source) === null || _hit$_source === void 0 ? void 0 : _hit$_source.bid;
    if (!fileId) return;
    const integration = (0, _services.getIntegrationNameFromFileDataIndexName)(hit._index);
    const metadataIndex = (0, _services.getFileMetadataIndexName)(integration);
    if ((_noChunkFileIdsByInde = noChunkFileIdsByIndex[metadataIndex]) !== null && _noChunkFileIdsByInde !== void 0 && _noChunkFileIdsByInde.delete(fileId)) {
      allFileIds.delete(fileId);
    }
  });
  return {
    fileIdsByIndex: noChunkFileIdsByIndex,
    allFileIds
  };
}

/**
 * Updates given files to provided status
 *
 * @param esClient
 * @param abortController
 * @param fileIdsByIndex
 * @param status
 */
function updateFilesStatus(esClient, abortController, fileIdsByIndex, status) {
  return Promise.all(Object.entries(fileIdsByIndex).map(([index, fileIds]) => {
    return esClient.updateByQuery({
      index,
      refresh: true,
      query: {
        ids: {
          values: Array.from(fileIds)
        }
      },
      script: {
        source: `ctx._source.file.Status = '${status}'`,
        lang: 'painless'
      }
    }, {
      signal: abortController.signal
    });
  }));
}