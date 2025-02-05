"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchDurationPercentiles = void 0;
var _constants = require("../../../../common/correlations/constants");
var _get_common_correlations_query = require("./get_common_correlations_query");
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const fetchDurationPercentiles = async ({
  chartType,
  apmEventClient,
  start,
  end,
  environment,
  kuery,
  query,
  percents,
  searchMetrics
}) => {
  var _response$aggregation;
  const durationField = (0, _utils.getDurationField)(chartType, searchMetrics);

  // when using metrics data, ensure we filter by docs with the appropriate duration field
  const filteredQuery = searchMetrics ? {
    bool: {
      filter: [query, {
        exists: {
          field: durationField
        }
      }]
    }
  } : query;
  const params = {
    apm: {
      events: [(0, _utils.getEventType)(chartType, searchMetrics)]
    },
    body: {
      track_total_hits: true,
      query: (0, _get_common_correlations_query.getCommonCorrelationsQuery)({
        start,
        end,
        environment,
        kuery,
        query: filteredQuery
      }),
      size: 0,
      aggs: {
        duration_percentiles: {
          percentiles: {
            hdr: {
              number_of_significant_value_digits: _constants.SIGNIFICANT_VALUE_DIGITS
            },
            field: (0, _utils.getDurationField)(chartType, searchMetrics),
            ...(Array.isArray(percents) ? {
              percents
            } : {})
          }
        }
      }
    }
  };
  const response = await apmEventClient.search('get_duration_percentiles', params);

  // return early with no results if the search didn't return any documents
  if (!response.aggregations || response.hits.total.value === 0) {
    return {
      totalDocs: 0,
      percentiles: {}
    };
  }
  return {
    totalDocs: response.hits.total.value,
    percentiles: (_response$aggregation = response.aggregations.duration_percentiles.values) !== null && _response$aggregation !== void 0 ? _response$aggregation :
    // we know values won't be null because there are hits
    {}
  };
};
exports.fetchDurationPercentiles = fetchDurationPercentiles;