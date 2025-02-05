"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unquoteString = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Removes single or double quotes if any exist around the given string
 * @param str the string to unquote
 * @returns the unquoted string
 */
const unquoteString = str => {
  if (/^"/.test(str)) {
    return str.replace(/^"(.+(?="$))"$/, '$1');
  }
  if (/^'/.test(str)) {
    return str.replace(/^'(.+(?='$))'$/, '$1');
  }
  return str;
};
exports.unquoteString = unquoteString;