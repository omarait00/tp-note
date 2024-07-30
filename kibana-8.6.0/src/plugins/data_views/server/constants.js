"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SPECIFIC_SCRIPTED_FIELD_PATH_LEGACY = exports.SPECIFIC_SCRIPTED_FIELD_PATH = exports.SPECIFIC_RUNTIME_FIELD_PATH_LEGACY = exports.SPECIFIC_RUNTIME_FIELD_PATH = exports.SPECIFIC_DATA_VIEW_PATH_LEGACY = exports.SPECIFIC_DATA_VIEW_PATH = exports.SERVICE_PATH_LEGACY = exports.SERVICE_PATH = exports.SERVICE_KEY_LEGACY = exports.SERVICE_KEY = exports.SCRIPTED_FIELD_PATH_LEGACY = exports.SCRIPTED_FIELD_PATH = exports.RUNTIME_FIELD_PATH_LEGACY = exports.RUNTIME_FIELD_PATH = exports.DATA_VIEW_PATH_LEGACY = exports.DATA_VIEW_PATH = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Service path for data views REST API
 */
const SERVICE_PATH = '/api/data_views';
/**
 * Legacy service path for data views REST API
 */
exports.SERVICE_PATH = SERVICE_PATH;
const SERVICE_PATH_LEGACY = '/api/index_patterns';
/**
 * Path for data view creation
 */
exports.SERVICE_PATH_LEGACY = SERVICE_PATH_LEGACY;
const DATA_VIEW_PATH = `${SERVICE_PATH}/data_view`;
/**
 * Legacy path for data view creation
 */
exports.DATA_VIEW_PATH = DATA_VIEW_PATH;
const DATA_VIEW_PATH_LEGACY = `${SERVICE_PATH_LEGACY}/index_pattern`;
/**
 * Path for single data view
 */
exports.DATA_VIEW_PATH_LEGACY = DATA_VIEW_PATH_LEGACY;
const SPECIFIC_DATA_VIEW_PATH = `${DATA_VIEW_PATH}/{id}`;
/**
 * Legacy path for single data view
 */
exports.SPECIFIC_DATA_VIEW_PATH = SPECIFIC_DATA_VIEW_PATH;
const SPECIFIC_DATA_VIEW_PATH_LEGACY = `${DATA_VIEW_PATH_LEGACY}/{id}`;
/**
 * Path to create runtime field
 */
exports.SPECIFIC_DATA_VIEW_PATH_LEGACY = SPECIFIC_DATA_VIEW_PATH_LEGACY;
const RUNTIME_FIELD_PATH = `${SPECIFIC_DATA_VIEW_PATH}/runtime_field`;
/**
 * Legacy path to create runtime field
 */
exports.RUNTIME_FIELD_PATH = RUNTIME_FIELD_PATH;
const RUNTIME_FIELD_PATH_LEGACY = `${SPECIFIC_DATA_VIEW_PATH_LEGACY}/runtime_field`;
/**
 * Path for runtime field
 */
exports.RUNTIME_FIELD_PATH_LEGACY = RUNTIME_FIELD_PATH_LEGACY;
const SPECIFIC_RUNTIME_FIELD_PATH = `${RUNTIME_FIELD_PATH}/{name}`;
/**
 * Legacy path for runtime field
 */
exports.SPECIFIC_RUNTIME_FIELD_PATH = SPECIFIC_RUNTIME_FIELD_PATH;
const SPECIFIC_RUNTIME_FIELD_PATH_LEGACY = `${RUNTIME_FIELD_PATH_LEGACY}/{name}`;

/**
 * Path to create scripted field
 */
exports.SPECIFIC_RUNTIME_FIELD_PATH_LEGACY = SPECIFIC_RUNTIME_FIELD_PATH_LEGACY;
const SCRIPTED_FIELD_PATH = `${SPECIFIC_DATA_VIEW_PATH}/scripted_field`;
/**
 * Legacy path to create scripted field
 */
exports.SCRIPTED_FIELD_PATH = SCRIPTED_FIELD_PATH;
const SCRIPTED_FIELD_PATH_LEGACY = `${SPECIFIC_DATA_VIEW_PATH_LEGACY}/scripted_field`;
/**
 * Path for scripted field
 */
exports.SCRIPTED_FIELD_PATH_LEGACY = SCRIPTED_FIELD_PATH_LEGACY;
const SPECIFIC_SCRIPTED_FIELD_PATH = `${SCRIPTED_FIELD_PATH}/{name}`;
/**
 * Legacy path for scripted field
 */
exports.SPECIFIC_SCRIPTED_FIELD_PATH = SPECIFIC_SCRIPTED_FIELD_PATH;
const SPECIFIC_SCRIPTED_FIELD_PATH_LEGACY = `${SCRIPTED_FIELD_PATH_LEGACY}/{name}`;

/**
 * name of service in path form
 */
exports.SPECIFIC_SCRIPTED_FIELD_PATH_LEGACY = SPECIFIC_SCRIPTED_FIELD_PATH_LEGACY;
const SERVICE_KEY = 'data_view';
/**
 * Legacy name of service in path form
 */
exports.SERVICE_KEY = SERVICE_KEY;
const SERVICE_KEY_LEGACY = 'index_pattern';
/**
 * Service keys as type
 */
exports.SERVICE_KEY_LEGACY = SERVICE_KEY_LEGACY;