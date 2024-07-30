"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logLevelToNumber = exports.logLevelFromString = exports.logLevelFromNumber = exports.logLevelFromExecutionStatus = exports.TLogLevel = exports.LogLevel = exports.LOG_LEVELS = void 0;
var _securitysolutionIoTsTypes = require("@kbn/securitysolution-io-ts-types");
var _enum_from_string = require("../../../utils/enum_from_string");
var _utility_types = require("../../../utility_types");
var _execution_status = require("./execution_status");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let LogLevel;
exports.LogLevel = LogLevel;
(function (LogLevel) {
  LogLevel["trace"] = "trace";
  LogLevel["debug"] = "debug";
  LogLevel["info"] = "info";
  LogLevel["warn"] = "warn";
  LogLevel["error"] = "error";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
const TLogLevel = (0, _securitysolutionIoTsTypes.enumeration)('LogLevel', LogLevel);

/**
 * An array of supported log levels.
 */
exports.TLogLevel = TLogLevel;
const LOG_LEVELS = Object.values(LogLevel);
exports.LOG_LEVELS = LOG_LEVELS;
const logLevelToNumber = level => {
  if (!level) {
    return 0;
  }
  switch (level) {
    case 'trace':
      return 0;
    case 'debug':
      return 10;
    case 'info':
      return 20;
    case 'warn':
      return 30;
    case 'error':
      return 40;
    default:
      (0, _utility_types.assertUnreachable)(level);
      return 0;
  }
};
exports.logLevelToNumber = logLevelToNumber;
const logLevelFromNumber = num => {
  if (num === null || num === undefined || num < 10) {
    return LogLevel.trace;
  }
  if (num < 20) {
    return LogLevel.debug;
  }
  if (num < 30) {
    return LogLevel.info;
  }
  if (num < 40) {
    return LogLevel.warn;
  }
  return LogLevel.error;
};
exports.logLevelFromNumber = logLevelFromNumber;
const logLevelFromString = (0, _enum_from_string.enumFromString)(LogLevel);
exports.logLevelFromString = logLevelFromString;
const logLevelFromExecutionStatus = status => {
  switch (status) {
    case _execution_status.RuleExecutionStatus['going to run']:
    case _execution_status.RuleExecutionStatus.running:
    case _execution_status.RuleExecutionStatus.succeeded:
      return LogLevel.info;
    case _execution_status.RuleExecutionStatus['partial failure']:
      return LogLevel.warn;
    case _execution_status.RuleExecutionStatus.failed:
      return LogLevel.error;
    default:
      (0, _utility_types.assertUnreachable)(status);
      return LogLevel.trace;
  }
};
exports.logLevelFromExecutionStatus = logLevelFromExecutionStatus;