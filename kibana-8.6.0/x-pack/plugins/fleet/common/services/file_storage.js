"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIntegrationNameFromFileDataIndexName = exports.getFileWriteIndexName = exports.getFileStorageWriteIndexBody = exports.getFileMetadataIndexName = exports.getFileDataIndexName = void 0;
var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Returns the index name for File Metadata storage for a given integration
 * @param integrationName
 */
const getFileMetadataIndexName = integrationName => {
  if (_constants.FILE_STORAGE_METADATA_INDEX_PATTERN.indexOf('*') !== -1) {
    return _constants.FILE_STORAGE_METADATA_INDEX_PATTERN.replace('*', integrationName);
  }
  throw new Error(`Unable to define integration file data index. No '*' in index pattern: ${_constants.FILE_STORAGE_METADATA_INDEX_PATTERN}`);
};
/**
 * Returns the index name for File data (chunks) storage for a given integration
 * @param integrationName
 */
exports.getFileMetadataIndexName = getFileMetadataIndexName;
const getFileDataIndexName = integrationName => {
  if (_constants.FILE_STORAGE_DATA_INDEX_PATTERN.indexOf('*') !== -1) {
    return _constants.FILE_STORAGE_DATA_INDEX_PATTERN.replace('*', integrationName);
  }
  throw new Error(`Unable to define integration file data index. No '*' in index pattern: ${_constants.FILE_STORAGE_DATA_INDEX_PATTERN}`);
};

/**
 * Returns the write index name for a given file upload alias name, this is the same for metadata and chunks
 * @param aliasName
 */
exports.getFileDataIndexName = getFileDataIndexName;
const getFileWriteIndexName = aliasName => aliasName + '-000001';
/**
 * Returns back the integration name for a given File Data (chunks) index name.
 *
 * @example
 * // Given a File data index pattern of `.fleet-file-data-*`:
 *
 * getIntegrationNameFromFileDataIndexName('.fleet-file-data-agent');
 * // return 'agent'
 *
 * getIntegrationNameFromFileDataIndexName('.fleet-file-data-agent-00001');
 * // return 'agent'
 */
exports.getFileWriteIndexName = getFileWriteIndexName;
const getIntegrationNameFromFileDataIndexName = indexName => {
  const integrationNameIndexPosition = _constants.FILE_STORAGE_DATA_INDEX_PATTERN.split('-').indexOf('*');
  if (integrationNameIndexPosition === -1) {
    throw new Error(`Unable to parse index name. No '*' in index pattern: ${_constants.FILE_STORAGE_DATA_INDEX_PATTERN}`);
  }
  const indexPieces = indexName.split('-');
  if (indexPieces[integrationNameIndexPosition]) {
    return indexPieces[integrationNameIndexPosition];
  }
  throw new Error(`Index name ${indexName} does not seem to be a File Data storage index`);
};
exports.getIntegrationNameFromFileDataIndexName = getIntegrationNameFromFileDataIndexName;
const getFileStorageWriteIndexBody = aliasName => ({
  aliases: {
    [aliasName]: {
      is_write_index: true
    }
  },
  settings: {
    'index.lifecycle.rollover_alias': aliasName,
    'index.hidden': true
  }
});
exports.getFileStorageWriteIndexBody = getFileStorageWriteIndexBody;