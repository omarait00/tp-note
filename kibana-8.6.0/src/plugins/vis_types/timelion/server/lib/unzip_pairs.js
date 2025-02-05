"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = unzipPairs;
var _lodash = _interopRequireDefault(require("lodash"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function unzipPairs(timeValObject) {
  const paired = _lodash.default.chain(timeValObject).toPairs().map(function (point) {
    return [parseInt(point[0], 10), point[1]];
  }).sortBy(function (point) {
    return point[0];
  }).value();
  return paired;
}
module.exports = exports.default;