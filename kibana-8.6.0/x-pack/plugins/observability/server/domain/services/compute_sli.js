"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computeSLI = computeSLI;
var _number = require("../../utils/number");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function computeSLI(sliData) {
  const {
    good,
    total
  } = sliData;
  if (total === 0) {
    return 0;
  }
  if (good >= total) {
    return 1;
  }
  return (0, _number.toHighPrecision)(good / total);
}