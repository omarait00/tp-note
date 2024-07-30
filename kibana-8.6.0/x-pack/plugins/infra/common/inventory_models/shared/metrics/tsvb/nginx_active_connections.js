"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nginxActiveConnections = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const nginxActiveConnections = (timeField, indexPattern, interval) => ({
  id: 'nginxActiveConnections',
  requires: ['nginx.stubstatus'],
  index_pattern: indexPattern,
  interval,
  time_field: timeField,
  type: 'timeseries',
  series: [{
    id: 'connections',
    metrics: [{
      field: 'nginx.stubstatus.active',
      id: 'avg-active',
      type: 'avg'
    }],
    split_mode: 'everything'
  }]
});
exports.nginxActiveConnections = nginxActiveConnections;