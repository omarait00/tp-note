"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceStatistics = getServiceStatistics;
var _server = require("../../../../observability/server");
var _common = require("../../../../observability/common");
var _storage_explorer_types = require("../../../common/storage_explorer_types");
var _get_total_transactions_per_service = require("./get_total_transactions_per_service");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
var _environment_query = require("../../../common/utils/environment_query");
var _indices_stats_helpers = require("./indices_stats_helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getMainServiceStatistics({
  apmEventClient,
  context,
  indexLifecyclePhase,
  randomSampler,
  start,
  end,
  environment,
  kuery
}) {
  var _response$aggregation;
  const [{
    indices: allIndicesStats
  }, response] = await Promise.all([(0, _indices_stats_helpers.getTotalIndicesStats)({
    context,
    apmEventClient
  }), apmEventClient.search('get_main_service_statistics', {
    apm: {
      events: [_common.ProcessorEvent.span, _common.ProcessorEvent.transaction, _common.ProcessorEvent.error, _common.ProcessorEvent.metric]
    },
    body: {
      size: 0,
      track_total_hits: false,
      query: {
        bool: {
          filter: [...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery), ...(0, _server.rangeQuery)(start, end), ...(indexLifecyclePhase !== _storage_explorer_types.IndexLifecyclePhaseSelectOption.All ? (0, _server.termQuery)(_elasticsearch_fieldnames.TIER, _storage_explorer_types.indexLifeCyclePhaseToDataTier[indexLifecyclePhase]) : [])]
        }
      },
      aggs: {
        sample: {
          random_sampler: randomSampler,
          aggs: {
            services: {
              terms: {
                field: _elasticsearch_fieldnames.SERVICE_NAME,
                size: 500
              },
              aggs: {
                sample: {
                  top_metrics: {
                    size: 1,
                    metrics: {
                      field: _elasticsearch_fieldnames.AGENT_NAME
                    },
                    sort: {
                      '@timestamp': 'desc'
                    }
                  }
                },
                indices: {
                  terms: {
                    field: _elasticsearch_fieldnames.INDEX,
                    size: 500
                  },
                  aggs: {
                    number_of_metric_docs: {
                      value_count: {
                        field: _elasticsearch_fieldnames.INDEX
                      }
                    }
                  }
                },
                environments: {
                  terms: {
                    field: _elasticsearch_fieldnames.SERVICE_ENVIRONMENT
                  }
                },
                transactions: {
                  filter: {
                    term: {
                      [_elasticsearch_fieldnames.PROCESSOR_EVENT]: _common.ProcessorEvent.transaction
                    }
                  },
                  aggs: {
                    sampled_transactions: {
                      terms: {
                        field: _elasticsearch_fieldnames.TRANSACTION_SAMPLED,
                        size: 10
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
  })]);
  const serviceStats = (_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : _response$aggregation.sample.services.buckets.map(bucket => {
    var _bucket$transactions$, _bucket$sample$top$;
    const estimatedSize = allIndicesStats ? bucket.indices.buckets.reduce((prev, curr) => {
      return prev + (0, _indices_stats_helpers.getEstimatedSizeForDocumentsInIndex)({
        allIndicesStats,
        indexName: curr.key,
        numberOfDocs: curr.number_of_metric_docs.value
      });
    }, 0) : 0;
    return {
      serviceName: bucket.key,
      environments: bucket.environments.buckets.map(({
        key
      }) => key),
      sampledTransactionDocs: (_bucket$transactions$ = bucket.transactions.sampled_transactions.buckets[0]) === null || _bucket$transactions$ === void 0 ? void 0 : _bucket$transactions$.doc_count,
      size: estimatedSize,
      agentName: (_bucket$sample$top$ = bucket.sample.top[0]) === null || _bucket$sample$top$ === void 0 ? void 0 : _bucket$sample$top$.metrics[_elasticsearch_fieldnames.AGENT_NAME]
    };
  });
  return serviceStats !== null && serviceStats !== void 0 ? serviceStats : [];
}
async function getServiceStatistics({
  apmEventClient,
  context,
  indexLifecyclePhase,
  randomSampler,
  start,
  end,
  environment,
  kuery,
  searchAggregatedTransactions
}) {
  const [docCountPerProcessorEvent, totalTransactionsPerService] = await Promise.all([getMainServiceStatistics({
    apmEventClient,
    context,
    indexLifecyclePhase,
    randomSampler,
    environment,
    kuery,
    start,
    end
  }), (0, _get_total_transactions_per_service.getTotalTransactionsPerService)({
    apmEventClient,
    searchAggregatedTransactions,
    indexLifecyclePhase,
    randomSampler,
    environment,
    kuery,
    start,
    end
  })]);
  const serviceStatistics = docCountPerProcessorEvent.map(({
    serviceName,
    sampledTransactionDocs,
    ...rest
  }) => {
    const sampling = sampledTransactionDocs && totalTransactionsPerService[serviceName] ? Math.min(sampledTransactionDocs / totalTransactionsPerService[serviceName], 1) : 0;
    return {
      ...rest,
      serviceName,
      sampling
    };
  });
  return serviceStatistics;
}