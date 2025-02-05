"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RuleNotifyWhenTypeValues = void 0;
exports.validateNotifyWhenType = validateNotifyWhenType;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const RuleNotifyWhenTypeValues = ['onActionGroupChange', 'onActiveAlert', 'onThrottleInterval'];
exports.RuleNotifyWhenTypeValues = RuleNotifyWhenTypeValues;
function validateNotifyWhenType(notifyWhen) {
  if (RuleNotifyWhenTypeValues.includes(notifyWhen)) {
    return;
  }
  return `string is not a valid RuleNotifyWhenType: ${notifyWhen}`;
}