"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ApiActions = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class ApiActions {
  constructor(versionNumber) {
    (0, _defineProperty2.default)(this, "prefix", void 0);
    this.prefix = `api:${versionNumber}:`;
  }
  get(operation) {
    if (!operation || !(0, _lodash.isString)(operation)) {
      throw new Error('operation is required and must be a string');
    }
    return `${this.prefix}${operation}`;
  }
}
exports.ApiActions = ApiActions;