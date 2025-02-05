"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.containerMemory = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const containerMemory = (timeField, indexPattern, interval) => ({
  id: 'containerMemory',
  requires: ['docker.memory'],
  index_pattern: indexPattern,
  interval,
  time_field: timeField,
  type: 'timeseries',
  series: [{
    id: 'memory',
    split_mode: 'everything',
    metrics: [{
      field: 'docker.memory.usage.pct',
      id: 'avg-memory',
      type: 'avg'
    }]
  }]
});
exports.containerMemory = containerMemory;