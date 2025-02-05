"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchDurationRanges = void 0;
var _lodash = require("lodash");
var _get_common_correlations_query = require("./get_common_correlations_query");
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const fetchDurationRanges = async ({
  rangeSteps,
  apmEventClient,
  start,
  end,
  environment,
  kuery,
  query,
  chartType,
  searchMetrics
}) => {
  var _resp$aggregations$lo, _resp$aggregations;
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
  const ranges = rangeSteps.reduce((p, to) => {
    const from = p[p.length - 1].to;
    p.push({
      from,
      to
    });
    return p;
  }, [{
    to: 0
  }]);
  if (ranges.length > 0) {
    ranges.push({
      from: ranges[ranges.length - 1].to
    });
  }
  const resp = await apmEventClient.search('get_duration_ranges', {
    apm: {
      events: [(0, _utils.getEventType)(chartType, searchMetrics)]
    },
    body: {
      track_total_hits: false,
      size: 0,
      query: (0, _get_common_correlations_query.getCommonCorrelationsQuery)({
        start,
        end,
        environment,
        kuery,
        query: filteredQuery
      }),
      aggs: {
        logspace_ranges: {
          range: {
            field: (0, _utils.getDurationField)(chartType, searchMetrics),
            ranges
          }
        }
      }
    }
  });
  const durationRanges = (_resp$aggregations$lo = (_resp$aggregations = resp.aggregations) === null || _resp$aggregations === void 0 ? void 0 : _resp$aggregations.logspace_ranges.buckets.map(d => ({
    key: d.from,
    doc_count: d.doc_count
  })).filter(d => d.key !== undefined)) !== null && _resp$aggregations$lo !== void 0 ? _resp$aggregations$lo : [];
  return {
    totalDocCount: (0, _lodash.sumBy)(durationRanges, 'doc_count'),
    durationRanges
  };
};
exports.fetchDurationRanges = fetchDurationRanges;