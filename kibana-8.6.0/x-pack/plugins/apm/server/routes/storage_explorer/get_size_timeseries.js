"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSizeTimeseries = getSizeTimeseries;
var _server = require("../../../../observability/server");
var _common = require("../../../../observability/common");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
var _environment_query = require("../../../common/utils/environment_query");
var _get_bucket_size_for_aggregated_transactions = require("../../lib/helpers/get_bucket_size_for_aggregated_transactions");
var _storage_explorer_types = require("../../../common/storage_explorer_types");
var _indices_stats_helpers = require("./indices_stats_helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getSizeTimeseries({
  environment,
  kuery,
  apmEventClient,
  searchAggregatedTransactions,
  start,
  end,
  indexLifecyclePhase,
  randomSampler,
  context
}) {
  var _res$aggregations$sam, _res$aggregations;
  const {
    intervalString
  } = (0, _get_bucket_size_for_aggregated_transactions.getBucketSizeForAggregatedTransactions)({
    start,
    end,
    searchAggregatedTransactions
  });
  const [{
    indices: allIndicesStats
  }, res] = await Promise.all([(0, _indices_stats_helpers.getTotalIndicesStats)({
    apmEventClient,
    context
  }), apmEventClient.search('get_storage_timeseries', {
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
                size: 50
              },
              aggs: {
                storageTimeSeries: {
                  date_histogram: {
                    field: '@timestamp',
                    fixed_interval: intervalString,
                    min_doc_count: 0,
                    extended_bounds: {
                      min: start,
                      max: end
                    }
                  },
                  aggs: {
                    indices: {
                      terms: {
                        field: _elasticsearch_fieldnames.INDEX,
                        size: 500
                      },
                      aggs: {
                        number_of_metric_docs_for_index: {
                          value_count: {
                            field: _elasticsearch_fieldnames.INDEX
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
    }
  })]);
  return (_res$aggregations$sam = (_res$aggregations = res.aggregations) === null || _res$aggregations === void 0 ? void 0 : _res$aggregations.sample.services.buckets.map(serviceBucket => {
    const timeseries = serviceBucket.storageTimeSeries.buckets.map(dateHistogramBucket => {
      const estimatedSize = allIndicesStats ? dateHistogramBucket.indices.buckets.reduce((prev, curr) => {
        return prev + (0, _indices_stats_helpers.getEstimatedSizeForDocumentsInIndex)({
          allIndicesStats,
          indexName: curr.key,
          numberOfDocs: curr.number_of_metric_docs_for_index.value
        });
      }, 0) : 0;
      return {
        x: dateHistogramBucket.key,
        y: estimatedSize
      };
    });
    return {
      serviceName: serviceBucket.key,
      timeseries
    };
  })) !== null && _res$aggregations$sam !== void 0 ? _res$aggregations$sam : [];
}