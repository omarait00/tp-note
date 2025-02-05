"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAfterKeyHandler = void 0;
var _saferLodashSet = require("@kbn/safer-lodash-set");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createAfterKeyHandler = (optionsAfterKeyPath, afterKeySelector) => (options, response) => {
  if (!response.aggregations) {
    return options;
  }
  const newOptions = {
    ...options
  };
  const afterKey = afterKeySelector(response);
  (0, _saferLodashSet.set)(newOptions, optionsAfterKeyPath, afterKey);
  return newOptions;
};
exports.createAfterKeyHandler = createAfterKeyHandler;