"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildKpiRiskScoreQuery = void 0;
var _search_strategy = require("../../../../../../common/search_strategy");
var _build_query = require("../../../../../utils/build_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildKpiRiskScoreQuery = ({
  defaultIndex,
  filterQuery,
  entity
}) => {
  const filter = [...(0, _build_query.createQueryFilterClauses)(filterQuery)];
  const dslQuery = {
    index: defaultIndex,
    allow_no_indices: false,
    ignore_unavailable: true,
    track_total_hits: false,
    body: {
      aggs: {
        risk: {
          terms: {
            field: entity === _search_strategy.RiskScoreEntity.user ? _search_strategy.RiskScoreFields.userRisk : _search_strategy.RiskScoreFields.hostRisk
          },
          aggs: {
            unique_entries: {
              cardinality: {
                field: entity === _search_strategy.RiskScoreEntity.user ? _search_strategy.RiskScoreFields.userName : _search_strategy.RiskScoreFields.hostName
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
      size: 0
    }
  };
  return dslQuery;
};
exports.buildKpiRiskScoreQuery = buildKpiRiskScoreQuery;