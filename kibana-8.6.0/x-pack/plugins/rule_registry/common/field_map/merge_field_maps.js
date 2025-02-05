"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeFieldMaps = mergeFieldMaps;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function mergeFieldMaps(first, second) {
  const conflicts = [];
  Object.keys(second).forEach(name => {
    const field = second[name];
    const parts = name.split('.');
    const parents = parts.slice(0, parts.length - 2).map((part, index, array) => {
      return [...array.slice(0, index - 1), part].join('.');
    });
    parents.filter(parent => first[parent] !== undefined).forEach(parent => {
      conflicts.push({
        [parent]: [{
          type: 'object'
        }, first[parent]]
      });
    });
    if (first[name]) {
      conflicts.push({
        [name]: [field, first[name]]
      });
    }
  });
  if (conflicts.length) {
    const err = new Error(`Could not merge mapping due to conflicts`);
    Object.assign(err, {
      conflicts
    });
    throw err;
  }
  return {
    ...first,
    ...second
  };
}