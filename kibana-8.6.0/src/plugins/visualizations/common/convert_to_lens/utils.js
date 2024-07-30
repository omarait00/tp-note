"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFieldValid = exports.isCollapseFunction = exports.isAnnotationsLayer = exports.getIndexPatternIds = void 0;
var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const isAnnotationsLayer = layer => layer.layerType === 'annotations';
exports.isAnnotationsLayer = isAnnotationsLayer;
const getIndexPatternIds = layers => layers.map(({
  indexPatternId
}) => indexPatternId);
exports.getIndexPatternIds = getIndexPatternIds;
const isValidFieldType = (visType, {
  supportedDataTypes
}, field) => {
  var _supportedDataTypes$v;
  const availableDataTypes = (_supportedDataTypes$v = supportedDataTypes[visType]) !== null && _supportedDataTypes$v !== void 0 ? _supportedDataTypes$v : supportedDataTypes.default;
  return availableDataTypes.includes(field.type);
};
const isFieldValid = (visType, field, aggregation) => {
  if (!field && aggregation.isFieldRequired) {
    return false;
  }
  if (field && (!field.aggregatable || !isValidFieldType(visType, aggregation, field))) {
    return false;
  }
  return true;
};
exports.isFieldValid = isFieldValid;
const isCollapseFunction = candidate => Boolean(candidate && _constants.CollapseFunctions.includes(candidate));
exports.isCollapseFunction = isCollapseFunction;