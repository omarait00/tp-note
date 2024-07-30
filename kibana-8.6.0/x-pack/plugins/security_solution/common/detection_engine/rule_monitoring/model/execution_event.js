"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ruleExecutionEventTypeFromString = exports.TRuleExecutionEventType = exports.RuleExecutionEventType = exports.RuleExecutionEvent = exports.RULE_EXECUTION_EVENT_TYPES = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _securitysolutionIoTsTypes = require("@kbn/securitysolution-io-ts-types");
var _enum_from_string = require("../../../utils/enum_from_string");
var _log_level = require("./log_level");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
/**
 * Type of a plain rule execution event.
 */
let RuleExecutionEventType;
exports.RuleExecutionEventType = RuleExecutionEventType;
(function (RuleExecutionEventType) {
  RuleExecutionEventType["message"] = "message";
  RuleExecutionEventType["status-change"] = "status-change";
  RuleExecutionEventType["execution-metrics"] = "execution-metrics";
})(RuleExecutionEventType || (exports.RuleExecutionEventType = RuleExecutionEventType = {}));
const TRuleExecutionEventType = (0, _securitysolutionIoTsTypes.enumeration)('RuleExecutionEventType', RuleExecutionEventType);

/**
 * An array of supported types of rule execution events.
 */
exports.TRuleExecutionEventType = TRuleExecutionEventType;
const RULE_EXECUTION_EVENT_TYPES = Object.values(RuleExecutionEventType);
exports.RULE_EXECUTION_EVENT_TYPES = RULE_EXECUTION_EVENT_TYPES;
const ruleExecutionEventTypeFromString = (0, _enum_from_string.enumFromString)(RuleExecutionEventType);

/**
 * Plain rule execution event. A rule can write many of them during each execution. Events can be
 * of different types and log levels.
 *
 * NOTE: This is a read model of rule execution events and it is pretty generic. It contains only a
 * subset of their fields: only those fields that are common to all types of execution events.
 */
exports.ruleExecutionEventTypeFromString = ruleExecutionEventTypeFromString;
const RuleExecutionEvent = t.type({
  timestamp: _securitysolutionIoTsTypes.IsoDateString,
  sequence: t.number,
  level: _log_level.TLogLevel,
  type: TRuleExecutionEventType,
  message: t.string
});
exports.RuleExecutionEvent = RuleExecutionEvent;