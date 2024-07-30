"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorBudgetSchema = exports.dateType = exports.dateRangeSchema = exports.allOrAnyString = exports.ALL_VALUE = void 0;
var _Either = require("fp-ts/lib/Either");
var t = _interopRequireWildcard(require("io-ts"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ALL_VALUE = '*';
exports.ALL_VALUE = ALL_VALUE;
const allOrAnyString = t.union([t.literal(ALL_VALUE), t.string]);
exports.allOrAnyString = allOrAnyString;
const dateType = new t.Type('DateType', input => input instanceof Date, (input, context) => _Either.either.chain(t.string.validate(input, context), value => {
  const decoded = new Date(value);
  return isNaN(decoded.getTime()) ? t.failure(input, context) : t.success(decoded);
}), date => date.toISOString());
exports.dateType = dateType;
const errorBudgetSchema = t.type({
  initial: t.number,
  consumed: t.number,
  remaining: t.number
});
exports.errorBudgetSchema = errorBudgetSchema;
const dateRangeSchema = t.type({
  from: dateType,
  to: dateType
});
exports.dateRangeSchema = dateRangeSchema;