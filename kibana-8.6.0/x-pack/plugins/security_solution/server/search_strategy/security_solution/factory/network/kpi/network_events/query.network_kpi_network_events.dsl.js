"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildNetworkEventsQuery = void 0;
var _build_query = require("../../../../../../utils/build_query");
var _common = require("../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildNetworkEventsQuery = ({
  filterQuery,
  timerange: {
    from,
    to
  },
  defaultIndex
}) => {
  const filter = [...(0, _build_query.createQueryFilterClauses)(filterQuery), ...(0, _common.getIpFilter)(), {
    range: {
      '@timestamp': {
        gte: from,
        lte: to,
        format: 'strict_date_optional_time'
      }
    }
  }];
  const dslQuery = {
    index: defaultIndex,
    allow_no_indices: true,
    ignore_unavailable: true,
    track_total_hits: true,
    body: {
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
exports.buildNetworkEventsQuery = buildNetworkEventsQuery;