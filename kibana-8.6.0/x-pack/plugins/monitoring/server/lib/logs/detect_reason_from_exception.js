"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.detectReasonFromException = detectReasonFromException;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function detectReasonFromException(exception) {
  const reason = {
    correctIndexName: true
  };
  if (exception) {
    if (exception.status === 400 && exception.message.indexOf('Fielddata is disabled on text fields by default') > -1) {
      reason.correctIndexName = false;
    }
  }
  return reason;
}