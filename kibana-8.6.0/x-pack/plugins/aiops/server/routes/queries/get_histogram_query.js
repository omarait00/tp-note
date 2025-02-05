"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHistogramQuery = getHistogramQuery;
var _get_query_with_params = require("./get_query_with_params");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getHistogramQuery(params, filter = []) {
  const histogramQuery = (0, _get_query_with_params.getQueryWithParams)({
    params
  });
  if (Array.isArray(histogramQuery.bool.filter)) {
    const existingFilter = histogramQuery.bool.filter.filter(d => Object.keys(d)[0] !== 'range');
    histogramQuery.bool.filter = [...existingFilter, ...filter, {
      range: {
        [params.timeFieldName]: {
          gte: params.start,
          lte: params.end,
          format: 'epoch_millis'
        }
      }
    }];
  }
  return histogramQuery;
}