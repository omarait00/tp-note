"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FILES_SHARE_API_BASE_PATH = exports.FILES_PUBLIC_API_BASE_PATH = exports.FILES_API_BASE_PATH = exports.API_BASE_PATH = void 0;
var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const API_BASE_PATH = `/api/${_constants.PLUGIN_ID}`;
exports.API_BASE_PATH = API_BASE_PATH;
const FILES_API_BASE_PATH = `${API_BASE_PATH}/files`;
exports.FILES_API_BASE_PATH = FILES_API_BASE_PATH;
const FILES_SHARE_API_BASE_PATH = `${API_BASE_PATH}/shares`;
exports.FILES_SHARE_API_BASE_PATH = FILES_SHARE_API_BASE_PATH;
const FILES_PUBLIC_API_BASE_PATH = `${API_BASE_PATH}/public`;
exports.FILES_PUBLIC_API_BASE_PATH = FILES_PUBLIC_API_BASE_PATH;