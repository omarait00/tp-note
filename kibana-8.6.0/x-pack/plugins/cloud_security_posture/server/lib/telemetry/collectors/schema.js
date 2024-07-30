"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cspmUsageSchema = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const cspmUsageSchema = {
  indices: {
    findings: {
      doc_count: {
        type: 'long'
      },
      deleted: {
        type: 'long'
      },
      size_in_bytes: {
        type: 'long'
      },
      last_doc_timestamp: {
        type: 'date'
      }
    },
    latest_findings: {
      doc_count: {
        type: 'long'
      },
      deleted: {
        type: 'long'
      },
      size_in_bytes: {
        type: 'long'
      },
      last_doc_timestamp: {
        type: 'date'
      }
    },
    score: {
      doc_count: {
        type: 'long'
      },
      deleted: {
        type: 'long'
      },
      size_in_bytes: {
        type: 'long'
      },
      last_doc_timestamp: {
        type: 'date'
      }
    }
  }
};
exports.cspmUsageSchema = cspmUsageSchema;