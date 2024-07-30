"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ruleExecutionType = exports.RULE_EXECUTION_SO_TYPE = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const RULE_EXECUTION_SO_TYPE = 'siem-detection-engine-rule-execution-info';

/**
 * This side-car SO stores information about rule executions (like last status and metrics).
 * Eventually we're going to replace it with data stored in the rule itself:
 * https://github.com/elastic/kibana/issues/112193
 */
exports.RULE_EXECUTION_SO_TYPE = RULE_EXECUTION_SO_TYPE;
const ruleExecutionMappings = {
  properties: {
    last_execution: {
      type: 'object',
      properties: {
        date: {
          type: 'date'
        },
        status: {
          type: 'keyword',
          ignore_above: 1024
        },
        status_order: {
          type: 'long'
        },
        message: {
          type: 'text'
        },
        metrics: {
          type: 'object',
          properties: {
            total_search_duration_ms: {
              type: 'long'
            },
            total_indexing_duration_ms: {
              type: 'long'
            },
            total_enrichment_duration_ms: {
              type: 'long'
            },
            execution_gap_duration_s: {
              type: 'long'
            }
          }
        }
      }
    }
  }
};
const ruleExecutionType = {
  name: RULE_EXECUTION_SO_TYPE,
  mappings: ruleExecutionMappings,
  hidden: false,
  namespaceType: 'multiple-isolated',
  convertToMultiNamespaceTypeVersion: '8.0.0'
};
exports.ruleExecutionType = ruleExecutionType;