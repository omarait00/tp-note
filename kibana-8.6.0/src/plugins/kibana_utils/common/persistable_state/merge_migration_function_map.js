"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeMigrationFunctionMaps = void 0;
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const mergeMigrationFunctionMaps = (obj1, obj2) => {
  const customizer = (objValue, srcValue) => {
    if (!srcValue || !objValue) {
      return srcValue || objValue;
    }
    return state => objValue(srcValue(state));
  };
  return (0, _lodash.mergeWith)({
    ...obj1
  }, obj2, customizer);
};
exports.mergeMigrationFunctionMaps = mergeMigrationFunctionMaps;