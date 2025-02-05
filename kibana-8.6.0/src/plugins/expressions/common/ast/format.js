"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.format = format;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {
  toExpression
} = require('@kbn/interpreter');
function format(ast, type) {
  return toExpression(ast, type);
}