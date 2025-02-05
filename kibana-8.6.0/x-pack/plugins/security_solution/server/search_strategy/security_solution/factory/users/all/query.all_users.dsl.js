"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildUsersQuery = void 0;
var _build_query = require("../../../../../utils/build_query");
var _common = require("../../../../../../common/search_strategy/security_solution/users/common");
var _utility_types = require("../../../../../../common/utility_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildUsersQuery = ({
  defaultIndex,
  filterQuery,
  pagination: {
    querySize
  },
  sort,
  timerange: {
    from,
    to
  }
}) => {
  const filter = [...(0, _build_query.createQueryFilterClauses)(filterQuery), {
    range: {
      '@timestamp': {
        gte: from,
        lte: to,
        format: 'strict_date_optional_time'
      }
    }
  }];
  const dslQuery = {
    allow_no_indices: true,
    index: defaultIndex,
    ignore_unavailable: true,
    track_total_hits: false,
    body: {
      aggregations: {
        user_count: {
          cardinality: {
            field: 'user.name'
          }
        },
        user_data: {
          terms: {
            size: querySize,
            field: 'user.name',
            order: getQueryOrder(sort)
          },
          aggs: {
            lastSeen: {
              max: {
                field: '@timestamp'
              }
            },
            domain: {
              top_hits: {
                size: 1,
                sort: [{
                  '@timestamp': {
                    order: 'desc'
                  }
                }],
                _source: false
              }
            }
          }
        }
      },
      query: {
        bool: {
          filter
        }
      },
      _source: false,
      fields: ['user.name', 'user.domain', {
        field: '@timestamp',
        format: 'strict_date_optional_time'
      }],
      size: 0
    }
  };
  return dslQuery;
};
exports.buildUsersQuery = buildUsersQuery;
const getQueryOrder = sort => {
  switch (sort.field) {
    case _common.UsersFields.lastSeen:
      return {
        lastSeen: sort.direction
      };
    case _common.UsersFields.name:
      return {
        _key: sort.direction
      };
    default:
      return (0, _utility_types.assertUnreachable)(sort.field);
  }
};