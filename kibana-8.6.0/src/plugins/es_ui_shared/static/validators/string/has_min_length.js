"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasMinLengthString = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const hasMinLengthString = length => str => str.length >= length;
exports.hasMinLengthString = hasMinLengthString;