"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRuleIdToCasesMap = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getRuleIdToCasesMap = cases => {
  return cases.reduce((cache, {
    attributes: casesObject
  }) => {
    if (casesObject.type === 'alert') {
      const ruleId = casesObject.rule.id;
      if (ruleId != null) {
        const cacheCount = cache.get(ruleId);
        if (cacheCount === undefined) {
          cache.set(ruleId, 1);
        } else {
          cache.set(ruleId, cacheCount + 1);
        }
      }
      return cache;
    } else {
      return cache;
    }
  }, new Map());
};
exports.getRuleIdToCasesMap = getRuleIdToCasesMap;