"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCcsIndexPattern = getCcsIndexPattern;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getCcsIndexPattern(indexPattern, availableCcs) {
  if (!availableCcs) {
    return indexPattern;
  }
  const patternsToAdd = [];
  for (const index of indexPattern.split(',')) {
    patternsToAdd.push(`*:${index}`);
  }
  return [...indexPattern.split(','), ...patternsToAdd].join(',');
}