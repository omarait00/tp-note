"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGroupFilter = getGroupFilter;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// Transforms a list of change point items from a group in a query filter.
// Uses a `term` filter for single field value combinations.
// For fields with multiple values it creates a single `terms` filter that includes
// all values. This avoids queries not returning any results otherwise because
// separate `term` filter for multiple values for the same field would rule each other out.
function getGroupFilter(changePointGroup) {
  return Object.entries(changePointGroup.group.reduce((p, c) => {
    if (p[c.fieldName]) {
      p[c.fieldName].push(c.fieldValue);
    } else {
      p[c.fieldName] = [c.fieldValue];
    }
    return p;
  }, {})).reduce((p, [key, values]) => {
    p.push(values.length > 1 ? {
      terms: {
        [key]: values
      }
    } : {
      term: {
        [key]: values[0]
      }
    });
    return p;
  }, []);
}