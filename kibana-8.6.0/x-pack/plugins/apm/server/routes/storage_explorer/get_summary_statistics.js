"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMainSummaryStats = getMainSummaryStats;
exports.getTracesPerMinute = getTracesPerMinute;
var _common = require("../../../../observability/common");
var _server = require("../../../../observability/server");
var _indices_stats_helpers = require("./indices_stats_helpers");
var _storage_explorer_types = require("../../../common/storage_explorer_types");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
var _environment_query = require("../../../common/utils/environment_query");
var _transactions = require("../../lib/helpers/transactions");
var _calculate_throughput = require("../../lib/helpers/calculate_throughput");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getTracesPerMinute({
  apmEventClient,
  indexLifecyclePhase,
  start,
  end,
  environment,
  kuery,
  searchAggregatedTransactions
}) {
  var _response$aggregation, _response$aggregation2;
  const response = await apmEventClient.search('get_traces_per_minute', {
    apm: {
      events: [(0, _transactions.getProcessorEventForTransactions)(searchAggregatedTransactions)]
    },
    body: {
      size: 0,
      track_total_hits: false,
      query: {
        bool: {
          filter: [...(0, _transactions.getDocumentTypeFilterForTransactions)(searchAggregatedTransactions), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery), ...(0, _server.rangeQuery)(start, end), ...(indexLifecyclePhase !== _storage_explorer_types.IndexLifecyclePhaseSelectOption.All ? (0, _server.termQuery)(_elasticsearch_fieldnames.TIER, _storage_explorer_types.indexLifeCyclePhaseToDataTier[indexLifecyclePhase]) : []), (0, _transactions.isRootTransaction)(searchAggregatedTransactions)]
        }
      },
      aggs: {
        traces_count: {
          value_count: {
            field: (0, _transactions.getDurationFieldForTransactions)(searchAggregatedTransactions)
          }
        }
      }
    }
  });
  return (0, _calculate_throughput.calculateThroughputWithRange)({
    start,
    end,
    value: (_response$aggregation = response === null || response === void 0 ? void 0 : (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.traces_count.value) !== null && _response$aggregation !== void 0 ? _response$aggregation : 0
  });
}
async function getMainSummaryStats({
  apmEventClient,
  context,
  indexLifecyclePhase,
  randomSampler,
  start,
  end,
  environment,
  kuery
}) {
  var _res$aggregations$sam, _res$aggregations, _totalIndicesStats$_a, _totalIndicesStats$_a2, _totalIndicesStats$_a3, _res$aggregations$ser, _res$aggregations2;
  const [totalIndicesStats, totalDiskSpace, res] = await Promise.all([(0, _indices_stats_helpers.getTotalIndicesStats)({
    context,
    apmEventClient
  }), (0, _indices_stats_helpers.getApmDiskSpacedUsedPct)(context), apmEventClient.search('get_storage_explorer_main_summary_stats', {
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
        services_count: {
          cardinality: {
            field: _elasticsearch_fieldnames.SERVICE_NAME
          }
        },
        sample: {
          random_sampler: randomSampler,
          aggs: {
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
            }
          }
        }
      }
    }
  })]);
  const {
    indices: allIndicesStats
  } = totalIndicesStats;
  const estimatedIncrementalSize = allIndicesStats ? (_res$aggregations$sam = (_res$aggregations = res.aggregations) === null || _res$aggregations === void 0 ? void 0 : _res$aggregations.sample.indices.buckets.reduce((prev, curr) => {
    return prev + (0, _indices_stats_helpers.getEstimatedSizeForDocumentsInIndex)({
      allIndicesStats,
      indexName: curr.key,
      numberOfDocs: curr.number_of_metric_docs.value
    });
  }, 0)) !== null && _res$aggregations$sam !== void 0 ? _res$aggregations$sam : 0 : 0;
  const durationAsDays = (end - start) / 1000 / 60 / 60 / 24;
  const totalApmSize = (_totalIndicesStats$_a = (_totalIndicesStats$_a2 = totalIndicesStats._all.total) === null || _totalIndicesStats$_a2 === void 0 ? void 0 : (_totalIndicesStats$_a3 = _totalIndicesStats$_a2.store) === null || _totalIndicesStats$_a3 === void 0 ? void 0 : _totalIndicesStats$_a3.size_in_bytes) !== null && _totalIndicesStats$_a !== void 0 ? _totalIndicesStats$_a : 0;
  return {
    totalSize: totalApmSize,
    diskSpaceUsedPct: totalApmSize / totalDiskSpace,
    numberOfServices: (_res$aggregations$ser = (_res$aggregations2 = res.aggregations) === null || _res$aggregations2 === void 0 ? void 0 : _res$aggregations2.services_count.value) !== null && _res$aggregations$ser !== void 0 ? _res$aggregations$ser : 0,
    estimatedIncrementalSize,
    dailyDataGeneration: estimatedIncrementalSize / durationAsDays
  };
}