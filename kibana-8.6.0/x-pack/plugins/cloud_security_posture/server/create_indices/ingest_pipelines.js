"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scorePipelineIngestConfig = exports.latestFindingsPipelineIngestConfig = void 0;
var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const scorePipelineIngestConfig = {
  id: _constants.CSP_INGEST_TIMESTAMP_PIPELINE,
  description: 'Pipeline for adding event timestamp',
  processors: [{
    set: {
      field: '@timestamp',
      value: '{{_ingest.timestamp}}'
    }
  }],
  on_failure: [{
    set: {
      field: 'error.message',
      value: '{{ _ingest.on_failure_message }}'
    }
  }]
};
exports.scorePipelineIngestConfig = scorePipelineIngestConfig;
const latestFindingsPipelineIngestConfig = {
  id: _constants.CSP_LATEST_FINDINGS_INGEST_TIMESTAMP_PIPELINE,
  description: 'Pipeline for cloudbeat latest findings index',
  processors: [{
    set: {
      field: 'event.ingested',
      value: '{{_ingest.timestamp}}'
    }
  }],
  on_failure: [{
    set: {
      field: 'error.message',
      value: '{{ _ingest.on_failure_message }}'
    }
  }]
};
exports.latestFindingsPipelineIngestConfig = latestFindingsPipelineIngestConfig;