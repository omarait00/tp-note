"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExecutorError = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class ExecutorError extends Error {
  constructor(message, data, retry = false) {
    super(message);
    (0, _defineProperty2.default)(this, "data", void 0);
    (0, _defineProperty2.default)(this, "retry", void 0);
    this.data = data;
    this.retry = retry;
  }
}
exports.ExecutorError = ExecutorError;