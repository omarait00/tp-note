"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectActions = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class SavedObjectActions {
  constructor(versionNumber) {
    (0, _defineProperty2.default)(this, "prefix", void 0);
    this.prefix = `saved_object:${versionNumber}:`;
  }
  get(type, operation) {
    if (!type || !(0, _lodash.isString)(type)) {
      throw new Error('type is required and must be a string');
    }
    if (!operation || !(0, _lodash.isString)(operation)) {
      throw new Error('operation is required and must be a string');
    }
    return `${this.prefix}${type}/${operation}`;
  }
}
exports.SavedObjectActions = SavedObjectActions;