"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.millisToNanos = millisToNanos;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function millisToNanos(millis) {
  const roundedMillis = Math.round(millis);
  if (roundedMillis === 0) {
    return '0';
  }
  return `${roundedMillis}000000`;
}