"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildHostsQuery = void 0;
var _search_strategy = require("../../../../../../common/search_strategy");
var _build_query = require("../../../../../utils/build_query");
var _utility_types = require("../../../../../../common/utility_types");
var _helpers = require("./helpers");
var _ecs_fields = require("../../../../../../common/ecs/ecs_fields");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildHostsQuery = ({
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
  const esFields = (0, _build_query.reduceFields)(_helpers.HOSTS_FIELDS, {
    ..._ecs_fields.hostFieldsMap
  });
  const filter = [...(0, _build_query.createQueryFilterClauses)(filterQuery), {
    range: {
      '@timestamp': {
        gte: from,
        lte: to,
        format: 'strict_date_optional_time'
      }
    }
  }];
  const agg = {
    host_count: {
      cardinality: {
        field: 'host.name'
      }
    }
  };
  const dslQuery = {
    allow_no_indices: true,
    index: defaultIndex,
    ignore_unavailable: true,
    track_total_hits: false,
    body: {
      aggregations: {
        ...agg,
        host_data: {
          terms: {
            size: querySize,
            field: 'host.name',
            order: getQueryOrder(sort)
          },
          aggs: {
            lastSeen: {
              max: {
                field: '@timestamp'
              }
            },
            os: {
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
      fields: [...esFields, {
        field: '@timestamp',
        format: 'strict_date_optional_time'
      }],
      size: 0
    }
  };
  return dslQuery;
};
exports.buildHostsQuery = buildHostsQuery;
const getQueryOrder = sort => {
  switch (sort.field) {
    case _search_strategy.HostsFields.lastSeen:
      return {
        lastSeen: sort.direction
      };
    case _search_strategy.HostsFields.hostName:
      return {
        _key: sort.direction
      };
    default:
      return (0, _utility_types.assertUnreachable)(sort.field);
  }
};