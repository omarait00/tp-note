"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.containerDiskIOOps = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const containerDiskIOOps = (timeField, indexPattern, interval) => ({
  id: 'containerDiskIOOps',
  requires: ['docker.disk'],
  index_pattern: indexPattern,
  interval,
  time_field: timeField,
  type: 'timeseries',
  series: [{
    id: 'read',
    split_mode: 'everything',
    metrics: [{
      field: 'docker.diskio.read.ops',
      id: 'max-diskio-read-ops',
      type: 'max'
    }, {
      field: 'max-diskio-read-ops',
      id: 'deriv-max-diskio-read-ops',
      type: 'derivative',
      unit: '1s'
    }, {
      id: 'posonly-deriv-max-diskio-read-ops',
      type: 'calculation',
      variables: [{
        id: 'var-rate',
        name: 'rate',
        field: 'deriv-max-diskio-read-ops'
      }],
      script: 'params.rate > 0.0 ? params.rate : 0.0'
    }]
  }, {
    id: 'write',
    split_mode: 'everything',
    metrics: [{
      field: 'docker.diskio.write.ops',
      id: 'max-diskio-write-ops',
      type: 'max'
    }, {
      field: 'max-diskio-write-ops',
      id: 'deriv-max-diskio-write-ops',
      type: 'derivative',
      unit: '1s'
    }, {
      id: 'posonly-deriv-max-diskio-write-ops',
      type: 'calculation',
      variables: [{
        id: 'var-rate',
        name: 'rate',
        field: 'deriv-max-diskio-write-ops'
      }],
      script: 'params.rate > 0.0 ? params.rate : 0.0'
    }, {
      id: 'calc-invert-rate',
      script: 'params.rate * -1',
      type: 'calculation',
      variables: [{
        field: 'posonly-deriv-max-diskio-write-ops',
        id: 'var-rate',
        name: 'rate'
      }]
    }]
  }]
});
exports.containerDiskIOOps = containerDiskIOOps;