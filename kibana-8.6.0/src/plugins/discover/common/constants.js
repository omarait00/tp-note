"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ROWS_PER_PAGE_OPTIONS = exports.DEFAULT_ROWS_PER_PAGE = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const DEFAULT_ROWS_PER_PAGE = 100;
exports.DEFAULT_ROWS_PER_PAGE = DEFAULT_ROWS_PER_PAGE;
const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, DEFAULT_ROWS_PER_PAGE, 250, 500];
exports.ROWS_PER_PAGE_OPTIONS = ROWS_PER_PAGE_OPTIONS;