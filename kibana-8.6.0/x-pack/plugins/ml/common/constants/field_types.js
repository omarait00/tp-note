"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._DOC_COUNT = exports.OMIT_FIELDS = exports.ML_JOB_FIELD_TYPES = exports.MLCATEGORY = exports.DOC_COUNT = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ML_JOB_FIELD_TYPES = {
  BOOLEAN: 'boolean',
  DATE: 'date',
  GEO_POINT: 'geo_point',
  GEO_SHAPE: 'geo_shape',
  IP: 'ip',
  KEYWORD: 'keyword',
  NUMBER: 'number',
  TEXT: 'text',
  UNKNOWN: 'unknown'
};
exports.ML_JOB_FIELD_TYPES = ML_JOB_FIELD_TYPES;
const MLCATEGORY = 'mlcategory';

/**
 * For use as summary_count_field_name in datafeeds which use aggregations.
 */
exports.MLCATEGORY = MLCATEGORY;
const DOC_COUNT = 'doc_count';

/**
 * Elasticsearch field showing number of documents aggregated in a single summary field for
 * pre-aggregated data. For use as summary_count_field_name in datafeeds which do not use aggregations.
 */
exports.DOC_COUNT = DOC_COUNT;
const _DOC_COUNT = '_doc_count';

// List of system fields we don't want to display.
exports._DOC_COUNT = _DOC_COUNT;
const OMIT_FIELDS = ['_source', '_type', '_index', '_id', '_version', '_score'];
exports.OMIT_FIELDS = OMIT_FIELDS;