"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRuleNotifyWhenType = getRuleNotifyWhenType;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getRuleNotifyWhenType(notifyWhen, throttle) {
  // We allow notifyWhen to be null for backwards compatibility. If it is null, determine its
  // value based on whether the throttle is set to a value or null
  return notifyWhen ? notifyWhen : throttle ? 'onThrottleInterval' : 'onActiveAlert';
}