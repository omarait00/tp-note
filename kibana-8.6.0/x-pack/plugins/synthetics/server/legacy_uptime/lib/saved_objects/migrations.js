"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add820Indices = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const add820Indices = doc => {
  var _doc$attributes;
  const heartbeatIndices = (_doc$attributes = doc.attributes) === null || _doc$attributes === void 0 ? void 0 : _doc$attributes.heartbeatIndices;
  const indicesArr = !heartbeatIndices ? [] : heartbeatIndices.split(',');
  if (!indicesArr.includes('synthetics-*')) {
    indicesArr.push('synthetics-*');
  }
  if (!indicesArr.includes('heartbeat-8*')) {
    indicesArr.push('heartbeat-8*');
  }
  const migratedObj = {
    ...doc,
    attributes: {
      ...doc.attributes,
      heartbeatIndices: indicesArr.join(',')
    }
  };
  return migratedObj;
};
exports.add820Indices = add820Indices;