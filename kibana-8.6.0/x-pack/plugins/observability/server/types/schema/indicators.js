"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kqlCustomIndicatorTypeSchema = exports.kqlCustomIndicatorSchema = exports.indicatorTypesSchema = exports.indicatorSchema = exports.indicatorDataSchema = exports.apmTransactionErrorRateIndicatorTypeSchema = exports.apmTransactionErrorRateIndicatorSchema = exports.apmTransactionDurationIndicatorTypeSchema = exports.apmTransactionDurationIndicatorSchema = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _common = require("./common");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const apmTransactionDurationIndicatorTypeSchema = t.literal('sli.apm.transaction_duration');
exports.apmTransactionDurationIndicatorTypeSchema = apmTransactionDurationIndicatorTypeSchema;
const apmTransactionDurationIndicatorSchema = t.type({
  type: apmTransactionDurationIndicatorTypeSchema,
  params: t.type({
    environment: _common.allOrAnyString,
    service: _common.allOrAnyString,
    transaction_type: _common.allOrAnyString,
    transaction_name: _common.allOrAnyString,
    'threshold.us': t.number
  })
});
exports.apmTransactionDurationIndicatorSchema = apmTransactionDurationIndicatorSchema;
const apmTransactionErrorRateIndicatorTypeSchema = t.literal('sli.apm.transaction_error_rate');
exports.apmTransactionErrorRateIndicatorTypeSchema = apmTransactionErrorRateIndicatorTypeSchema;
const apmTransactionErrorRateIndicatorSchema = t.type({
  type: apmTransactionErrorRateIndicatorTypeSchema,
  params: t.intersection([t.type({
    environment: _common.allOrAnyString,
    service: _common.allOrAnyString,
    transaction_type: _common.allOrAnyString,
    transaction_name: _common.allOrAnyString
  }), t.partial({
    good_status_codes: t.array(t.union([t.literal('2xx'), t.literal('3xx'), t.literal('4xx'), t.literal('5xx')]))
  })])
});
exports.apmTransactionErrorRateIndicatorSchema = apmTransactionErrorRateIndicatorSchema;
const kqlCustomIndicatorTypeSchema = t.literal('sli.kql.custom');
exports.kqlCustomIndicatorTypeSchema = kqlCustomIndicatorTypeSchema;
const kqlCustomIndicatorSchema = t.type({
  type: kqlCustomIndicatorTypeSchema,
  params: t.type({
    index: t.string,
    query_filter: t.string,
    numerator: t.string,
    denominator: t.string
  })
});
exports.kqlCustomIndicatorSchema = kqlCustomIndicatorSchema;
const indicatorDataSchema = t.type({
  date_range: _common.dateRangeSchema,
  good: t.number,
  total: t.number
});
exports.indicatorDataSchema = indicatorDataSchema;
const indicatorTypesSchema = t.union([apmTransactionDurationIndicatorTypeSchema, apmTransactionErrorRateIndicatorTypeSchema, kqlCustomIndicatorTypeSchema]);
exports.indicatorTypesSchema = indicatorTypesSchema;
const indicatorSchema = t.union([apmTransactionDurationIndicatorSchema, apmTransactionErrorRateIndicatorSchema, kqlCustomIndicatorSchema]);
exports.indicatorSchema = indicatorSchema;