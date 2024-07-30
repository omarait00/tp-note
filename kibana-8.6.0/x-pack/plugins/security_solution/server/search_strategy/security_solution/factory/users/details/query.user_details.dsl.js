"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildUserDetailsQuery = void 0;
var _helpers = require("../../hosts/details/helpers");
var _helpers2 = require("./helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildUserDetailsQuery = ({
  userName,
  defaultIndex,
  timerange: {
    from,
    to
  }
}) => {
  const filter = [{
    term: {
      'user.name': userName
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
        ...(0, _helpers.buildFieldsTermAggregation)(_helpers2.USER_FIELDS)
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
exports.buildUserDetailsQuery = buildUserDetailsQuery;