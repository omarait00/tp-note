"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchDurationFractions = void 0;
var _common = require("../../../../../observability/common");
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
var _get_common_correlations_query = require("./get_common_correlations_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Compute the actual percentile bucket counts and actual fractions
 */
const fetchDurationFractions = async ({
  apmEventClient,
  eventType,
  start,
  end,
  environment,
  kuery,
  query,
  ranges
}) => {
  var _aggregations$latency, _aggregations$latency2;
  const resp = await apmEventClient.search('get_duration_fractions', {
    apm: {
      events: [eventType]
    },
    body: {
      track_total_hits: false,
      size: 0,
      query: (0, _get_common_correlations_query.getCommonCorrelationsQuery)({
        start,
        end,
        environment,
        kuery,
        query
      }),
      aggs: {
        latency_ranges: {
          range: {
            field: eventType === _common.ProcessorEvent.span ? _elasticsearch_fieldnames.SPAN_DURATION : _elasticsearch_fieldnames.TRANSACTION_DURATION,
            ranges
          }
        }
      }
    }
  });
  const {
    aggregations
  } = resp;
  const totalDocCount = (_aggregations$latency = aggregations === null || aggregations === void 0 ? void 0 : aggregations.latency_ranges.buckets.reduce((acc, bucket) => {
    return acc + bucket.doc_count;
  }, 0)) !== null && _aggregations$latency !== void 0 ? _aggregations$latency : 0;

  // Compute (doc count per bucket/total doc count)
  return {
    fractions: (_aggregations$latency2 = aggregations === null || aggregations === void 0 ? void 0 : aggregations.latency_ranges.buckets.map(bucket => bucket.doc_count / totalDocCount)) !== null && _aggregations$latency2 !== void 0 ? _aggregations$latency2 : [],
    totalDocCount
  };
};
exports.fetchDurationFractions = fetchDurationFractions;