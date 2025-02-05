"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractBulkResponseDeleteFailures = extractBulkResponseDeleteFailures;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function extractBulkResponseDeleteFailures(response) {
  const result = [];
  for (const item of response.body.items) {
    if (!item.delete || !item.delete.error) {
      continue;
    }
    result.push({
      _id: item.delete._id,
      status: item.delete.status,
      result: item.delete.result
    });
  }
  return result;
}