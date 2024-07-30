"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetRuleExecutionResultsRequestQuery = exports.GetRuleExecutionResultsRequestParams = exports.DefaultSortField = exports.DefaultRuleExecutionStatusCsvArray = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _securitysolutionIoTsAlertingTypes = require("@kbn/securitysolution-io-ts-alerting-types");
var _securitysolutionIoTsTypes = require("@kbn/securitysolution-io-ts-types");
var _common = require("../../../schemas/common");
var _execution_result = require("../../model/execution_result");
var _execution_status = require("../../model/execution_status");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Types the DefaultRuleExecutionStatusCsvArray as:
 *   - If not specified, then a default empty array will be set
 *   - If an array is sent in, then the array will be validated to ensure all elements are a RuleExecutionStatus
 *     (or that the array is empty)
 *   - If a CSV string is sent in, then it will be parsed to an array which will be validated
 */
const DefaultRuleExecutionStatusCsvArray = (0, _securitysolutionIoTsTypes.defaultCsvArray)(_execution_status.TRuleExecutionStatus);

/**
 * Types the DefaultSortField as:
 *   - If undefined, then a default sort field of 'timestamp' will be set
 *   - If a string is sent in, then the string will be validated to ensure it is as valid sortFields
 */
exports.DefaultRuleExecutionStatusCsvArray = DefaultRuleExecutionStatusCsvArray;
const DefaultSortField = (0, _securitysolutionIoTsTypes.defaultValue)(_execution_result.SortFieldOfRuleExecutionResult, 'timestamp', 'DefaultSortField');

/**
 * Path parameters of the API route.
 */
exports.DefaultSortField = DefaultSortField;
const GetRuleExecutionResultsRequestParams = t.exact(t.type({
  ruleId: _securitysolutionIoTsTypes.NonEmptyString
}));

/**
 * Query string parameters of the API route.
 */
exports.GetRuleExecutionResultsRequestParams = GetRuleExecutionResultsRequestParams;
const GetRuleExecutionResultsRequestQuery = t.exact(t.type({
  start: _securitysolutionIoTsTypes.IsoDateString,
  end: _securitysolutionIoTsTypes.IsoDateString,
  query_text: _securitysolutionIoTsTypes.DefaultEmptyString,
  // defaults to ''
  status_filters: DefaultRuleExecutionStatusCsvArray,
  // defaults to []
  sort_field: DefaultSortField,
  // defaults to 'timestamp'
  sort_order: _common.DefaultSortOrderDesc,
  // defaults to 'desc'
  page: _securitysolutionIoTsAlertingTypes.DefaultPage,
  // defaults to 1
  per_page: _securitysolutionIoTsAlertingTypes.DefaultPerPage // defaults to 20
}));
exports.GetRuleExecutionResultsRequestQuery = GetRuleExecutionResultsRequestQuery;