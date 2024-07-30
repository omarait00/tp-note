"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FILE_STORAGE_METADATA_INDEX_PATTERN = exports.FILE_STORAGE_INTEGRATION_NAMES = exports.FILE_STORAGE_INTEGRATION_INDEX_NAMES = exports.FILE_STORAGE_DATA_INDEX_PATTERN = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// File storage indexes supporting endpoint Upload/download
// If needing to get an integration specific index name, use the utility functions
// found in `common/services/file_storage`
const FILE_STORAGE_METADATA_INDEX_PATTERN = '.fleet-files-*';
exports.FILE_STORAGE_METADATA_INDEX_PATTERN = FILE_STORAGE_METADATA_INDEX_PATTERN;
const FILE_STORAGE_DATA_INDEX_PATTERN = '.fleet-file-data-*';

// which integrations support file upload and the name to use for the file upload index
exports.FILE_STORAGE_DATA_INDEX_PATTERN = FILE_STORAGE_DATA_INDEX_PATTERN;
const FILE_STORAGE_INTEGRATION_INDEX_NAMES = {
  elastic_agent: 'agent',
  endpoint: 'endpoint'
};
exports.FILE_STORAGE_INTEGRATION_INDEX_NAMES = FILE_STORAGE_INTEGRATION_INDEX_NAMES;
const FILE_STORAGE_INTEGRATION_NAMES = Object.keys(FILE_STORAGE_INTEGRATION_INDEX_NAMES);
exports.FILE_STORAGE_INTEGRATION_NAMES = FILE_STORAGE_INTEGRATION_NAMES;