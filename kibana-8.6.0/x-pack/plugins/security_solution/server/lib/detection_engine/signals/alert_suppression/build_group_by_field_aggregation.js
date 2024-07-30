"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildGroupByFieldAggregation = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildGroupByFieldAggregation = ({
  groupByFields,
  maxSignals,
  aggregatableTimestampField
}) => ({
  eventGroups: {
    composite: {
      sources: groupByFields.map(field => ({
        [field]: {
          terms: {
            field,
            missing_bucket: true
          }
        }
      })),
      size: maxSignals
    },
    aggs: {
      topHits: {
        top_hits: {
          size: 1,
          sort: [{
            [aggregatableTimestampField]: {
              order: 'asc',
              unmapped_type: 'date'
            }
          }]
        }
      },
      max_timestamp: {
        max: {
          field: aggregatableTimestampField
        }
      },
      min_timestamp: {
        min: {
          field: aggregatableTimestampField
        }
      }
    }
  }
});
exports.buildGroupByFieldAggregation = buildGroupByFieldAggregation;