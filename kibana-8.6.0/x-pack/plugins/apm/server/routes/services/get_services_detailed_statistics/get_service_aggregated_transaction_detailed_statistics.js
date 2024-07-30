"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceAggregatedDetailedStatsPeriods = getServiceAggregatedDetailedStatsPeriods;
exports.getServiceAggregatedTransactionDetailedStats = getServiceAggregatedTransactionDetailedStats;
var _lodash = require("lodash");
var _common = require("../../../../../observability/common");
var _server = require("../../../../../observability/server");
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
var _with_apm_span = require("../../../utils/with_apm_span");
var _transaction_types = require("../../../../common/transaction_types");
var _environment_query = require("../../../../common/utils/environment_query");
var _get_offset_in_ms = require("../../../../common/utils/get_offset_in_ms");
var _calculate_throughput = require("../../../lib/helpers/calculate_throughput");
var _get_bucket_size_for_aggregated_transactions = require("../../../lib/helpers/get_bucket_size_for_aggregated_transactions");
var _transaction_error_rate = require("../../../lib/helpers/transaction_error_rate");
var _service_metrics = require("../../../lib/helpers/service_metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getServiceAggregatedTransactionDetailedStats({
  serviceNames,
  environment,
  kuery,
  apmEventClient,
  searchAggregatedServiceMetrics,
  offset,
  start,
  end,
  randomSampler
}) {
  var _response$aggregation, _response$aggregation2;
  const {
    offsetInMs,
    startWithOffset,
    endWithOffset
  } = (0, _get_offset_in_ms.getOffsetInMs)({
    start,
    end,
    offset
  });
  const metrics = {
    avg_duration: {
      avg: {
        field: _elasticsearch_fieldnames.TRANSACTION_DURATION_SUMMARY
      }
    },
    failure_count: {
      sum: {
        field: _elasticsearch_fieldnames.TRANSACTION_FAILURE_COUNT
      }
    },
    success_count: {
      sum: {
        field: _elasticsearch_fieldnames.TRANSACTION_SUCCESS_COUNT
      }
    }
  };
  const response = await apmEventClient.search('get_service_aggregated_transaction_detail_stats', {
    apm: {
      events: [_common.ProcessorEvent.metric]
    },
    body: {
      track_total_hits: false,
      size: 0,
      query: {
        bool: {
          filter: [{
            terms: {
              [_elasticsearch_fieldnames.SERVICE_NAME]: serviceNames
            }
          }, ...(0, _service_metrics.getDocumentTypeFilterForServiceMetrics)(), ...(0, _server.rangeQuery)(startWithOffset, endWithOffset), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery)]
        }
      },
      aggs: {
        sample: {
          random_sampler: randomSampler,
          aggs: {
            services: {
              terms: {
                field: _elasticsearch_fieldnames.SERVICE_NAME,
                size: serviceNames.length
              },
              aggs: {
                transactionType: {
                  terms: {
                    field: _elasticsearch_fieldnames.TRANSACTION_TYPE
                  },
                  aggs: {
                    ...metrics,
                    timeseries: {
                      date_histogram: {
                        field: '@timestamp',
                        fixed_interval: (0, _get_bucket_size_for_aggregated_transactions.getBucketSizeForAggregatedTransactions)({
                          start: startWithOffset,
                          end: endWithOffset,
                          numBuckets: 20,
                          searchAggregatedServiceMetrics
                        }).intervalString,
                        min_doc_count: 0,
                        extended_bounds: {
                          min: startWithOffset,
                          max: endWithOffset
                        }
                      },
                      aggs: metrics
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
  return (0, _lodash.keyBy)((_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.sample.services.buckets.map(bucket => {
    var _bucket$transactionTy;
    const topTransactionTypeBucket = (_bucket$transactionTy = bucket.transactionType.buckets.find(({
      key
    }) => key === _transaction_types.TRANSACTION_REQUEST || key === _transaction_types.TRANSACTION_PAGE_LOAD)) !== null && _bucket$transactionTy !== void 0 ? _bucket$transactionTy : bucket.transactionType.buckets[0];
    return {
      serviceName: bucket.key,
      latency: topTransactionTypeBucket.timeseries.buckets.map(dateBucket => ({
        x: dateBucket.key + offsetInMs,
        y: dateBucket.avg_duration.value
      })),
      transactionErrorRate: topTransactionTypeBucket.timeseries.buckets.map(dateBucket => ({
        x: dateBucket.key + offsetInMs,
        y: (0, _transaction_error_rate.calculateFailedTransactionRateFromServiceMetrics)({
          failedTransactions: dateBucket.failure_count.value,
          successfulTransactions: dateBucket.success_count.value
        })
      })),
      throughput: topTransactionTypeBucket.timeseries.buckets.map(dateBucket => ({
        x: dateBucket.key + offsetInMs,
        y: (0, _calculate_throughput.calculateThroughputWithRange)({
          start,
          end,
          value: dateBucket.doc_count
        })
      }))
    };
  })) !== null && _response$aggregation !== void 0 ? _response$aggregation : [], 'serviceName');
}
async function getServiceAggregatedDetailedStatsPeriods({
  serviceNames,
  environment,
  kuery,
  apmEventClient,
  searchAggregatedServiceMetrics,
  offset,
  start,
  end,
  randomSampler
}) {
  return (0, _with_apm_span.withApmSpan)('get_service_aggregated_detailed_stats', async () => {
    const commonProps = {
      serviceNames,
      environment,
      kuery,
      apmEventClient,
      searchAggregatedServiceMetrics,
      start,
      end,
      randomSampler
    };
    const [currentPeriod, previousPeriod] = await Promise.all([getServiceAggregatedTransactionDetailedStats(commonProps), offset ? getServiceAggregatedTransactionDetailedStats({
      ...commonProps,
      offset
    }) : Promise.resolve({})]);
    return {
      currentPeriod,
      previousPeriod
    };
  });
}