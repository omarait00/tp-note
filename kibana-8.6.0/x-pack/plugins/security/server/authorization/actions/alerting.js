"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertingActions = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class AlertingActions {
  constructor(versionNumber) {
    (0, _defineProperty2.default)(this, "prefix", void 0);
    this.prefix = `alerting:${versionNumber}:`;
  }
  get(ruleTypeId, consumer, alertingEntity, operation) {
    if (!ruleTypeId || !(0, _lodash.isString)(ruleTypeId)) {
      throw new Error('ruleTypeId is required and must be a string');
    }
    if (!operation || !(0, _lodash.isString)(operation)) {
      throw new Error('operation is required and must be a string');
    }
    if (!consumer || !(0, _lodash.isString)(consumer)) {
      throw new Error('consumer is required and must be a string');
    }
    if (!alertingEntity || !(0, _lodash.isString)(alertingEntity)) {
      throw new Error('alertingEntity is required and must be a string');
    }
    return `${this.prefix}${ruleTypeId}/${consumer}/${alertingEntity}/${operation}`;
  }
}
exports.AlertingActions = AlertingActions;