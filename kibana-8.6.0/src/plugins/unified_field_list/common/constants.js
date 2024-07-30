"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FIELD_STATS_API_PATH = exports.FIELD_EXISTING_API_PATH = exports.BASE_API_PATH = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const BASE_API_PATH = '/api/unified_field_list';
exports.BASE_API_PATH = BASE_API_PATH;
const FIELD_STATS_API_PATH = `${BASE_API_PATH}/field_stats`;
exports.FIELD_STATS_API_PATH = FIELD_STATS_API_PATH;
const FIELD_EXISTING_API_PATH = `${BASE_API_PATH}/existing_fields/{dataViewId}`;
exports.FIELD_EXISTING_API_PATH = FIELD_EXISTING_API_PATH;