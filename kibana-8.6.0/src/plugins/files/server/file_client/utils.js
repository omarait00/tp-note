"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDefaultFileAttributes = createDefaultFileAttributes;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function createDefaultFileAttributes() {
  const dateString = new Date().toISOString();
  return {
    created: dateString,
    Status: 'AWAITING_UPLOAD',
    Updated: dateString
  };
}