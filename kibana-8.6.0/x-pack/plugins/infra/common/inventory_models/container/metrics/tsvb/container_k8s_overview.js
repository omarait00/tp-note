"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.containerK8sOverview = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const containerK8sOverview = (timeField, indexPattern, interval) => ({
  id: 'containerK8sOverview',
  requires: ['kubernetes.container'],
  index_pattern: indexPattern,
  interval,
  time_field: timeField,
  type: 'timeseries',
  series: [{
    id: 'cpu',
    split_mode: 'everything',
    metrics: [{
      field: 'kubernetes.container.cpu.usage.limit.pct',
      id: 'avg-cpu-total',
      type: 'avg'
    }]
  }, {
    id: 'memory',
    split_mode: 'everything',
    metrics: [{
      field: 'kubernetes.container.memory.usage.limit.pct',
      id: 'avg-memory-total',
      type: 'avg'
    }]
  }]
});
exports.containerK8sOverview = containerK8sOverview;