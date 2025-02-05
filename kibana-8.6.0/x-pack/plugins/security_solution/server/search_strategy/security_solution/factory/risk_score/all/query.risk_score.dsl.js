"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildRiskScoreQuery = exports.QUERY_SIZE = void 0;
var _search_strategy = require("../../../../../../common/search_strategy");
var _build_query = require("../../../../../utils/build_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const QUERY_SIZE = 10;
exports.QUERY_SIZE = QUERY_SIZE;
const buildRiskScoreQuery = ({
  timerange,
  filterQuery,
  defaultIndex,
  pagination: {
    querySize,
    cursorStart
  } = {
    querySize: QUERY_SIZE,
    cursorStart: 0
  },
  sort
}) => {
  const filter = (0, _build_query.createQueryFilterClauses)(filterQuery);
  if (timerange) {
    filter.push({
      range: {
        '@timestamp': {
          gte: timerange.from,
          lte: timerange.to,
          format: 'strict_date_optional_time'
        }
      }
    });
  }
  const dslQuery = {
    index: defaultIndex,
    allow_no_indices: false,
    ignore_unavailable: true,
    track_total_hits: true,
    size: querySize,
    from: cursorStart,
    body: {
      query: {
        bool: {
          filter
        }
      },
      sort: getQueryOrder(sort)
    }
  };
  return dslQuery;
};
exports.buildRiskScoreQuery = buildRiskScoreQuery;
const getQueryOrder = sort => {
  if (!sort) {
    return [{
      '@timestamp': _search_strategy.Direction.desc
    }];
  }
  if (sort.field === _search_strategy.RiskScoreFields.hostRisk) {
    return [{
      [_search_strategy.RiskScoreFields.hostRiskScore]: sort.direction
    }];
  }
  if (sort.field === _search_strategy.RiskScoreFields.userRisk) {
    return [{
      [_search_strategy.RiskScoreFields.userRiskScore]: sort.direction
    }];
  }
  return [{
    [sort.field]: sort.direction
  }];
};