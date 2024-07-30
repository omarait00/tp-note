"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SortFieldOfRuleExecutionResult = exports.RuleExecutionResult = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _securitysolutionIoTsTypes = require("@kbn/securitysolution-io-ts-types");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const RuleExecutionResult = t.type({
  execution_uuid: t.string,
  timestamp: _securitysolutionIoTsTypes.IsoDateString,
  duration_ms: t.number,
  status: t.string,
  message: t.string,
  num_active_alerts: t.number,
  num_new_alerts: t.number,
  num_recovered_alerts: t.number,
  num_triggered_actions: t.number,
  num_succeeded_actions: t.number,
  num_errored_actions: t.number,
  total_search_duration_ms: t.number,
  es_search_duration_ms: t.number,
  schedule_delay_ms: t.number,
  timed_out: t.boolean,
  indexing_duration_ms: t.number,
  search_duration_ms: t.number,
  gap_duration_s: t.number,
  security_status: t.string,
  security_message: t.string
});

/**
 * We support sorting rule execution results by these fields.
 */
exports.RuleExecutionResult = RuleExecutionResult;
const SortFieldOfRuleExecutionResult = t.keyof({
  timestamp: _securitysolutionIoTsTypes.IsoDateString,
  duration_ms: t.number,
  gap_duration_s: t.number,
  indexing_duration_ms: t.number,
  search_duration_ms: t.number,
  schedule_delay_ms: t.number
});
exports.SortFieldOfRuleExecutionResult = SortFieldOfRuleExecutionResult;