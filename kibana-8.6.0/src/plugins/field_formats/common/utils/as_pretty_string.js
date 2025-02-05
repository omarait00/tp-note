"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asPrettyString = asPrettyString;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Convert a value to a presentable string
 */
function asPrettyString(val, options) {
  if (val === null || val === undefined) return ' - ';
  switch (typeof val) {
    case 'string':
      return val;
    case 'object':
      return options !== null && options !== void 0 && options.skipFormattingInStringifiedJSON ? JSON.stringify(val) : JSON.stringify(val, null, '  ');
    default:
      return '' + val;
  }
}