"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSLOIndexTemplate = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getSLOIndexTemplate = (name, indexPattern, composedOf) => ({
  name,
  index_patterns: [indexPattern],
  composed_of: composedOf,
  priority: 500,
  _meta: {
    description: 'Template for SLO rollup data',
    version: 1
  }
});
exports.getSLOIndexTemplate = getSLOIndexTemplate;