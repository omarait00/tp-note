"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractVisualizationType = exports.extractContainerType = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const extractContainerType = context => {
  if (context) {
    var _recursiveGet;
    const recursiveGet = item => {
      if (item.type) {
        return item;
      } else if (item.child) {
        return recursiveGet(item.child);
      }
    };
    return (_recursiveGet = recursiveGet(context)) === null || _recursiveGet === void 0 ? void 0 : _recursiveGet.type;
  }
};
exports.extractContainerType = extractContainerType;
const extractVisualizationType = context => {
  if (context) {
    var _recursiveGet2;
    const recursiveGet = item => {
      if (item.child) {
        return recursiveGet(item.child);
      } else {
        return item;
      }
    };
    return (_recursiveGet2 = recursiveGet(context)) === null || _recursiveGet2 === void 0 ? void 0 : _recursiveGet2.type;
  }
};
exports.extractVisualizationType = extractVisualizationType;