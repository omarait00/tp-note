"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildRecentTermsAgg = exports.buildNewTermsAgg = exports.buildDocFetchAgg = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const PAGE_SIZE = 10000;

/**
 * Creates an aggregation that pages through all terms. Used to find the terms that have appeared recently,
 * without regard to whether or not they're actually new.
 */
const buildRecentTermsAgg = ({
  fields,
  after
}) => {
  const sources = fields.map(field => ({
    [field]: {
      terms: {
        field
      }
    }
  }));
  return {
    new_terms: {
      composite: {
        sources,
        size: PAGE_SIZE,
        after
      }
    }
  };
};

/**
 * Creates an aggregation that returns a bucket for each term in the `include` array
 * that only appears after the time `newValueWindowStart`.
 */
exports.buildRecentTermsAgg = buildRecentTermsAgg;
const buildNewTermsAgg = ({
  newValueWindowStart,
  field,
  timestampField,
  include
}) => {
  return {
    new_terms: {
      terms: {
        field,
        size: PAGE_SIZE,
        // include actually accepts strings or numbers, so we cast to string[] to make TS happy
        include: include
      },
      aggs: {
        first_seen: {
          min: {
            field: timestampField
          }
        },
        filtering_agg: {
          bucket_selector: {
            buckets_path: {
              first_seen_value: 'first_seen'
            },
            script: {
              params: {
                start_time: newValueWindowStart.valueOf()
              },
              source: 'params.first_seen_value > params.start_time'
            }
          }
        }
      }
    }
  };
};

/**
 * Creates an aggregation that fetches the oldest document for each value in the `include` array.
 */
exports.buildNewTermsAgg = buildNewTermsAgg;
const buildDocFetchAgg = ({
  field,
  timestampField,
  include
}) => {
  return {
    new_terms: {
      terms: {
        field,
        size: PAGE_SIZE,
        // include actually accepts strings or numbers, so we cast to string[] to make TS happy
        include: include
      },
      aggs: {
        docs: {
          top_hits: {
            size: 1,
            sort: [{
              [timestampField]: 'asc'
            }]
          }
        }
      }
    }
  };
};
exports.buildDocFetchAgg = buildDocFetchAgg;