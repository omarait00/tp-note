"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildHostDetailsQuery = void 0;
var _ecs_fields = require("../../../../../../common/ecs/ecs_fields");
var _reduce_fields = require("../../../../../utils/build_query/reduce_fields");
var _helpers = require("./helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildHostDetailsQuery = ({
  hostName,
  defaultIndex,
  timerange: {
    from,
    to
  }
}) => {
  const esFields = (0, _reduce_fields.reduceFields)(_helpers.HOST_DETAILS_FIELDS, {
    ..._ecs_fields.hostFieldsMap,
    ..._ecs_fields.cloudFieldsMap
  });
  const filter = [{
    term: {
      'host.name': hostName
    }
  }, {
    range: {
      '@timestamp': {
        format: 'strict_date_optional_time',
        gte: from,
        lte: to
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
        ...(0, _helpers.buildFieldsTermAggregation)(esFields.filter(field => !['@timestamp'].includes(field))),
        endpoint_id: {
          filter: {
            term: {
              'agent.type': 'endpoint'
            }
          },
          aggs: {
            value: {
              terms: {
                field: 'agent.id'
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
      fields: [...esFields, 'agent.type', 'agent.id', {
        field: '@timestamp',
        format: 'strict_date_optional_time'
      }],
      size: 0
    }
  };
  return dslQuery;
};
exports.buildHostDetailsQuery = buildHostDetailsQuery;