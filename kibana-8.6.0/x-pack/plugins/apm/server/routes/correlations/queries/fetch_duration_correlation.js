"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchDurationCorrelation = void 0;
var _common = require("../../../../../observability/common");
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
var _get_common_correlations_query = require("./get_common_correlations_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const fetchDurationCorrelation = async ({
  apmEventClient,
  eventType,
  start,
  end,
  environment,
  kuery,
  query,
  expectations,
  ranges,
  fractions,
  totalDocCount
}) => {
  var _aggregations$latency, _aggregations$duratio, _aggregations$ks_test;
  const resp = await apmEventClient.search('get_duration_correlation', {
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
        },
        // Pearson correlation value
        duration_correlation: {
          bucket_correlation: {
            buckets_path: 'latency_ranges>_count',
            function: {
              count_correlation: {
                indicator: {
                  fractions,
                  expectations,
                  doc_count: totalDocCount
                }
              }
            }
          }
        },
        // KS test p value = ks_test.less
        ks_test: {
          bucket_count_ks_test: {
            fractions,
            buckets_path: 'latency_ranges>_count',
            alternative: ['less', 'greater', 'two_sided']
          }
        }
      }
    }
  });
  const {
    aggregations
  } = resp;
  const result = {
    ranges: (_aggregations$latency = aggregations === null || aggregations === void 0 ? void 0 : aggregations.latency_ranges.buckets) !== null && _aggregations$latency !== void 0 ? _aggregations$latency : [],
    correlation: (_aggregations$duratio = aggregations === null || aggregations === void 0 ? void 0 : aggregations.duration_correlation.value) !== null && _aggregations$duratio !== void 0 ? _aggregations$duratio : null,
    ksTest: (_aggregations$ks_test = aggregations === null || aggregations === void 0 ? void 0 : aggregations.ks_test.less) !== null && _aggregations$ks_test !== void 0 ? _aggregations$ks_test : null
  };
  return result;
};
exports.fetchDurationCorrelation = fetchDurationCorrelation;