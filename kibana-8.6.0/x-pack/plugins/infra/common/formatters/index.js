"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFormatter = exports.FORMATTERS = void 0;
var _bytes = require("./bytes");
var _number = require("./number");
var _percent = require("./percent");
var _high_precision = require("./high_precision");
var _types = require("./types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const FORMATTERS = {
  number: _number.formatNumber,
  // Because the implimentation for formatting large numbers is the same as formatting
  // bytes we are re-using the same code, we just format the number using the abbreviated number format.
  abbreviatedNumber: (0, _bytes.createBytesFormatter)(_types.InfraWaffleMapDataFormat.abbreviatedNumber),
  // bytes in bytes formatted string out
  bytes: (0, _bytes.createBytesFormatter)(_types.InfraWaffleMapDataFormat.bytesDecimal),
  // bytes in bits formatted string out
  bits: (0, _bytes.createBytesFormatter)(_types.InfraWaffleMapDataFormat.bitsDecimal),
  percent: _percent.formatPercent,
  highPrecision: _high_precision.formatHighPrecision
};
exports.FORMATTERS = FORMATTERS;
const createFormatter = (format, template = '{{value}}') => val => {
  if (val == null) {
    return '';
  }
  const fmtFn = FORMATTERS[format];
  const value = fmtFn(Number(val));
  return template.replace(/{{value}}/g, value);
};
exports.createFormatter = createFormatter;