"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStorageSizeRt = getStorageSizeRt;
var t = _interopRequireWildcard(require("io-ts"));
var _Either = require("fp-ts/lib/Either");
var _amount_and_unit = require("../amount_and_unit");
var _get_range_type_message = require("./get_range_type_message");
var _is_finite_number = require("../../utils/is_finite_number");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
function toBytes(amount, unit, decimalUnitBase) {
  const base = decimalUnitBase ? 1000 : 1024;
  const unitExponent = unit ? units.indexOf(unit.toUpperCase()) : 0;
  if (unitExponent < 0) {
    return;
  }
  return amount * base ** unitExponent;
}
function amountAndUnitToBytes({
  value,
  decimalUnitBase
}) {
  if (value) {
    const {
      amount,
      unit
    } = (0, _amount_and_unit.amountAndUnitToObject)(value);
    if ((0, _is_finite_number.isFiniteNumber)(amount) && unit) {
      return toBytes(amount, unit, decimalUnitBase);
    }
  }
}
function getStorageSizeRt({
  min,
  max
}) {
  var _amountAndUnitToBytes, _amountAndUnitToBytes2;
  const minAsBytes = (_amountAndUnitToBytes = amountAndUnitToBytes({
    value: min,
    decimalUnitBase: true
  })) !== null && _amountAndUnitToBytes !== void 0 ? _amountAndUnitToBytes : -Infinity;
  const maxAsBytes = (_amountAndUnitToBytes2 = amountAndUnitToBytes({
    value: max,
    decimalUnitBase: true
  })) !== null && _amountAndUnitToBytes2 !== void 0 ? _amountAndUnitToBytes2 : Infinity;
  const message = (0, _get_range_type_message.getRangeTypeMessage)(min, max);
  return new t.Type('storageSizeRt', t.string.is, (input, context) => {
    return _Either.either.chain(t.string.validate(input, context), inputAsString => {
      const inputAsBytes = amountAndUnitToBytes({
        value: inputAsString,
        decimalUnitBase: true
      });
      const isValidAmount = inputAsBytes !== undefined && inputAsBytes >= minAsBytes && inputAsBytes <= maxAsBytes;
      return isValidAmount ? t.success(inputAsString) : t.failure(input, context, message);
    });
  }, t.identity);
}