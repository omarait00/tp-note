"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tagUsageCollectorSchema = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const perTypeSchema = {
  usedTags: {
    type: 'integer'
  },
  taggedObjects: {
    type: 'integer'
  }
};
const tagUsageCollectorSchema = {
  usedTags: {
    type: 'integer'
  },
  taggedObjects: {
    type: 'integer'
  },
  types: {
    dashboard: perTypeSchema,
    lens: perTypeSchema,
    visualization: perTypeSchema,
    map: perTypeSchema,
    search: perTypeSchema,
    'osquery-pack': perTypeSchema,
    'osquery-pack-asset': perTypeSchema,
    'osquery-saved-query': perTypeSchema
  }
};
exports.tagUsageCollectorSchema = tagUsageCollectorSchema;