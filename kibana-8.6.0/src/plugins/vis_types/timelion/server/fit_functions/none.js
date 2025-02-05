"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = none;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

// **DON'T USE THIS**
// Performing joins/math with other sets that don't match perfectly will be wrong
// Does not resample at all.
function none(dataTuples) {
  return dataTuples;
}
module.exports = exports.default;