"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = carry;
var _lodash = _interopRequireDefault(require("lodash"));
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

// Upsampling of non-cumulative sets
// Good: average, min, max
// Bad: sum, count

// Don't use this to down sample, it simply won't do the right thing.
function carry(dataTuples, targetTuples) {
  if (dataTuples.length > targetTuples.length) {
    throw new Error(_i18n.i18n.translate('timelion.fitFunctions.carry.downSampleErrorMessage', {
      defaultMessage: `Don't use the 'carry' fit method to down sample, use 'scale' or 'average'`,
      description: '"carry", "scale" and "average" are parameter values that must not be translated.'
    }));
  }
  let currentCarry = dataTuples[0][1];
  return _lodash.default.map(targetTuples, function (bucket) {
    const targetTime = bucket[0];
    const dataTime = dataTuples[0][0];
    if (dataTuples[0] && targetTime >= dataTime) {
      currentCarry = dataTuples[0][1];
      if (dataTuples.length > 1) {
        dataTuples.shift();
      }
    }
    return [bucket[0], currentCarry];
  });
}
module.exports = exports.default;