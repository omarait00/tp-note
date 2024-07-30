"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceAggregatedTransactionStats = getServiceAggregatedTransactionStats;
var _server = require("../../../../../observability/server");
var _common = require("../../../../../observability/common");
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
var _transaction_types = require("../../../../common/transaction_types");
var _environment_query = require("../../../../common/utils/environment_query");
var _calculate_throughput = require("../../../lib/helpers/calculate_throughput");
var _transaction_error_rate = require("../../../lib/helpers/transaction_error_rate");
var _service_group_query = require("../../../lib/service_group_query");
var _service_metrics = require("../../../lib/helpers/service_metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getServiceAggregatedTransactionStats({
  environment,
  kuery,
  apmEventClient,
  maxNumServices,
  start,
  end,
  serviceGroup,
  randomSampler
}) {
  var _response$aggregation, _response$aggregation2;
  const response = await apmEventClient.search('get_service_aggregated_transaction_stats', {
    apm: {
      events: [_common.ProcessorEvent.metric]
    },
    body: {
      track_total_hits: false,
      size: 0,
      query: {
        bool: {
          filter: [...(0, _service_metrics.getDocumentTypeFilterForServiceMetrics)(), ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery), ...(0, _service_group_query.serviceGroupQuery)(serviceGroup)]
        }
      },
      aggs: {
        sample: {
          random_sampler: randomSampler,
          aggs: {
            services: {
              terms: {
                field: _elasticsearch_fieldnames.SERVICE_NAME,
                size: maxNumServices
              },
              aggs: {
                transactionType: {
                  terms: {
                    field: _elasticsearch_fieldnames.TRANSACTION_TYPE
                  },
                  aggs: {
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
                    },
                    environments: {
                      terms: {
                        field: _elasticsearch_fieldnames.SERVICE_ENVIRONMENT
                      }
                    },
                    sample: {
                      top_metrics: {
                        metrics: [{
                          field: _elasticsearch_fieldnames.AGENT_NAME
                        }],
                        sort: {
                          '@timestamp': 'desc'
                        }
                      }
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
  return (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.sample.services.buckets.map(bucket => {
    var _bucket$transactionTy;
    const topTransactionTypeBucket = (_bucket$transactionTy = bucket.transactionType.buckets.find(({
      key
    }) => key === _transaction_types.TRANSACTION_REQUEST || key === _transaction_types.TRANSACTION_PAGE_LOAD)) !== null && _bucket$transactionTy !== void 0 ? _bucket$transactionTy : bucket.transactionType.buckets[0];
    return {
      serviceName: bucket.key,
      transactionType: topTransactionTypeBucket.key,
      environments: topTransactionTypeBucket.environments.buckets.map(environmentBucket => environmentBucket.key),
      agentName: topTransactionTypeBucket.sample.top[0].metrics[_elasticsearch_fieldnames.AGENT_NAME],
      latency: topTransactionTypeBucket.avg_duration.value,
      transactionErrorRate: (0, _transaction_error_rate.calculateFailedTransactionRateFromServiceMetrics)({
        failedTransactions: topTransactionTypeBucket.failure_count.value,
        successfulTransactions: topTransactionTypeBucket.success_count.value
      }),
      throughput: (0, _calculate_throughput.calculateThroughputWithRange)({
        start,
        end,
        value: topTransactionTypeBucket.doc_count
      })
    };
  })) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
}