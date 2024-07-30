"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActionExecutionErrorReason = exports.ActionExecutionError = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let ActionExecutionErrorReason;
exports.ActionExecutionErrorReason = ActionExecutionErrorReason;
(function (ActionExecutionErrorReason) {
  ActionExecutionErrorReason["Validation"] = "validation";
})(ActionExecutionErrorReason || (exports.ActionExecutionErrorReason = ActionExecutionErrorReason = {}));
class ActionExecutionError extends Error {
  constructor(message, reason, result) {
    super(message);
    (0, _defineProperty2.default)(this, "reason", void 0);
    (0, _defineProperty2.default)(this, "result", void 0);
    this.reason = reason;
    this.result = result;
  }
}
exports.ActionExecutionError = ActionExecutionError;