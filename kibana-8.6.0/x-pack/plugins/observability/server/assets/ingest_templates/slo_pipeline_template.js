"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSLOPipelineTemplate = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getSLOPipelineTemplate = (id, indexNamePrefix) => ({
  id,
  description: 'Monthly date-time index naming for SLO data',
  processors: [{
    date_index_name: {
      field: '@timestamp',
      index_name_prefix: indexNamePrefix,
      date_rounding: 'M'
    }
  }],
  _meta: {
    description: 'SLO ingest pipeline',
    version: 1
  }
});
exports.getSLOPipelineTemplate = getSLOPipelineTemplate;