"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPartialResponse = exports.isErrorResponse = exports.isCompleteResponse = exports.getUserTimeZone = void 0;
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * @returns true if response had an error while executing in ES
 */
const isErrorResponse = response => {
  return !response || !response.rawResponse || !response.isRunning && !!response.isPartial;
};

/**
 * @returns true if response is completed successfully
 */
exports.isErrorResponse = isErrorResponse;
const isCompleteResponse = response => {
  return Boolean(response && !response.isRunning && !response.isPartial);
};

/**
 * @returns true if request is still running an/d response contains partial results
 */
exports.isCompleteResponse = isCompleteResponse;
const isPartialResponse = response => {
  return Boolean(response && response.isRunning && response.isPartial);
};
exports.isPartialResponse = isPartialResponse;
const getUserTimeZone = (getConfig, shouldDetectTimezone = true) => {
  const defaultTimeZone = 'UTC';
  const userTimeZone = getConfig('dateFormat:tz');
  if (userTimeZone === 'Browser') {
    if (!shouldDetectTimezone) {
      return defaultTimeZone;
    }

    // If the typeMeta data index template does not have a timezone assigned to the selected field, use the configured tz
    const detectedTimezone = _momentTimezone.default.tz.guess();
    const tzOffset = (0, _momentTimezone.default)().format('Z');
    return detectedTimezone || tzOffset;
  }
  return userTimeZone !== null && userTimeZone !== void 0 ? userTimeZone : defaultTimeZone;
};
exports.getUserTimeZone = getUserTimeZone;