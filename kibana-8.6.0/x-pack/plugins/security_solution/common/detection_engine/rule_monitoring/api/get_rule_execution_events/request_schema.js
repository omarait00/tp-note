"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetRuleExecutionEventsRequestQuery = exports.GetRuleExecutionEventsRequestParams = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _securitysolutionIoTsAlertingTypes = require("@kbn/securitysolution-io-ts-alerting-types");
var _securitysolutionIoTsTypes = require("@kbn/securitysolution-io-ts-types");
var _common = require("../../../schemas/common");
var _execution_event = require("../../model/execution_event");
var _log_level = require("../../model/log_level");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const GetRuleExecutionEventsRequestParams = t.exact(t.type({
  ruleId: _securitysolutionIoTsTypes.NonEmptyString
}));

/**
 * Query string parameters of the API route.
 */
exports.GetRuleExecutionEventsRequestParams = GetRuleExecutionEventsRequestParams;
const GetRuleExecutionEventsRequestQuery = t.exact(t.type({
  event_types: (0, _securitysolutionIoTsTypes.defaultCsvArray)(_execution_event.TRuleExecutionEventType),
  log_levels: (0, _securitysolutionIoTsTypes.defaultCsvArray)(_log_level.TLogLevel),
  sort_order: _common.DefaultSortOrderDesc,
  // defaults to 'desc'
  page: _securitysolutionIoTsAlertingTypes.DefaultPage,
  // defaults to 1
  per_page: _securitysolutionIoTsAlertingTypes.DefaultPerPage // defaults to 20
}));
exports.GetRuleExecutionEventsRequestQuery = GetRuleExecutionEventsRequestQuery;