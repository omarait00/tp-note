"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildFirstOrLastSeenQuery = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildFirstOrLastSeenQuery = ({
  field,
  value,
  defaultIndex,
  order
}) => {
  const filter = [{
    term: {
      [field]: value
    }
  }];
  const dslQuery = {
    allow_no_indices: true,
    index: defaultIndex,
    ignore_unavailable: true,
    track_total_hits: false,
    body: {
      query: {
        bool: {
          filter
        }
      },
      _source: false,
      fields: [{
        field: '@timestamp',
        format: 'strict_date_optional_time'
      }],
      size: 1,
      sort: [{
        '@timestamp': {
          order
        }
      }]
    }
  };
  return dslQuery;
};
exports.buildFirstOrLastSeenQuery = buildFirstOrLastSeenQuery;