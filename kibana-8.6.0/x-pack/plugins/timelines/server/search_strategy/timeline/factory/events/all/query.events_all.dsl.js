"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildTimelineEventsAllQuery = void 0;
var _ruleDataUtils = require("@kbn/rule-data-utils");
var _fp = require("lodash/fp");
var _build_query = require("../../../../../utils/build_query");
var _helpers = require("./helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildTimelineEventsAllQuery = ({
  authFilter,
  defaultIndex,
  fields,
  filterQuery,
  pagination: {
    activePage,
    querySize
  },
  runtimeMappings,
  sort,
  timerange
}) => {
  const filterClause = [...(0, _build_query.createQueryFilterClauses)(filterQuery)];
  const getTimerangeFilter = timerangeOption => {
    if (timerangeOption) {
      const {
        to,
        from
      } = timerangeOption;
      return !(0, _fp.isEmpty)(to) && !(0, _fp.isEmpty)(from) ? [{
        range: {
          '@timestamp': {
            gte: from,
            lte: to,
            format: 'strict_date_optional_time'
          }
        }
      }] : [];
    }
    return [];
  };
  const filters = [...filterClause, ...getTimerangeFilter(timerange), {
    match_all: {}
  }];
  const filter = authFilter != null ? [...filters, authFilter] : filters;
  const getSortField = sortFields => sortFields.map(item => {
    const field = item.field === 'timestamp' ? '@timestamp' : item.field;
    return {
      [field]: {
        order: item.direction,
        unmapped_type: (0, _helpers.getPreferredEsType)(item.esTypes)
      }
    };
  });
  const dslQuery = {
    allow_no_indices: true,
    index: defaultIndex,
    ignore_unavailable: true,
    body: {
      aggregations: {
        producers: {
          terms: {
            field: _ruleDataUtils.ALERT_RULE_PRODUCER,
            exclude: ['alerts']
          }
        }
      },
      query: {
        bool: {
          filter
        }
      },
      runtime_mappings: runtimeMappings,
      from: activePage * querySize,
      size: querySize,
      track_total_hits: true,
      sort: getSortField(sort),
      fields: ['signal.*', 'kibana.alert.*', ...fields, {
        field: '@timestamp',
        format: 'strict_date_optional_time'
      }],
      _source: false
    }
  };
  return dslQuery;
};
exports.buildTimelineEventsAllQuery = buildTimelineEventsAllQuery;