"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStorageDetailsPerIndex = getStorageDetailsPerIndex;
exports.getStorageDetailsPerProcessorEvent = getStorageDetailsPerProcessorEvent;
var _server = require("../../../../observability/server");
var _common = require("../../../../observability/common");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
var _storage_explorer_types = require("../../../common/storage_explorer_types");
var _environment_query = require("../../../common/utils/environment_query");
var _indices_stats_helpers = require("./indices_stats_helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getStorageDetailsPerProcessorEvent({
  apmEventClient,
  context,
  indexLifecyclePhase,
  randomSampler,
  start,
  end,
  environment,
  kuery,
  serviceName
}) {
  const [{
    indices: allIndicesStats
  }, response] = await Promise.all([(0, _indices_stats_helpers.getTotalIndicesStats)({
    apmEventClient,
    context
  }), apmEventClient.search('get_storage_details_per_processor_event', {
    apm: {
      events: [_common.ProcessorEvent.span, _common.ProcessorEvent.transaction, _common.ProcessorEvent.error, _common.ProcessorEvent.metric]
    },
    body: {
      size: 0,
      track_total_hits: false,
      query: {
        bool: {
          filter: [...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery), ...(0, _server.rangeQuery)(start, end), ...(0, _server.termQuery)(_elasticsearch_fieldnames.SERVICE_NAME, serviceName), ...(indexLifecyclePhase !== _storage_explorer_types.IndexLifecyclePhaseSelectOption.All ? (0, _server.termQuery)(_elasticsearch_fieldnames.TIER, _storage_explorer_types.indexLifeCyclePhaseToDataTier[indexLifecyclePhase]) : [])]
        }
      },
      aggs: {
        sample: {
          random_sampler: randomSampler,
          aggs: {
            processor_event: {
              terms: {
                field: _elasticsearch_fieldnames.PROCESSOR_EVENT,
                size: 10
              },
              aggs: {
                number_of_metric_docs_for_processor_event: {
                  value_count: {
                    field: _elasticsearch_fieldnames.PROCESSOR_EVENT
                  }
                },
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
  })]);
  return [_common.ProcessorEvent.transaction, _common.ProcessorEvent.span, _common.ProcessorEvent.metric, _common.ProcessorEvent.error].map(processorEvent => {
    var _response$aggregation, _response$aggregation2, _bucketForProcessorEv;
    const bucketForProcessorEvent = (_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : (_response$aggregation2 = _response$aggregation.sample.processor_event.buckets) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.find(x => x.key === processorEvent);
    return {
      processorEvent,
      docs: (_bucketForProcessorEv = bucketForProcessorEvent === null || bucketForProcessorEvent === void 0 ? void 0 : bucketForProcessorEvent.number_of_metric_docs_for_processor_event.value) !== null && _bucketForProcessorEv !== void 0 ? _bucketForProcessorEv : 0,
      size: allIndicesStats && bucketForProcessorEvent ? bucketForProcessorEvent.indices.buckets.reduce((prev, curr) => {
        return prev + (0, _indices_stats_helpers.getEstimatedSizeForDocumentsInIndex)({
          allIndicesStats,
          indexName: curr.key,
          numberOfDocs: curr.number_of_metric_docs_for_index.value
        });
      }, 0) : 0
    };
  });
}
async function getStorageDetailsPerIndex({
  apmEventClient,
  context,
  indexLifecyclePhase,
  randomSampler,
  start,
  end,
  environment,
  kuery,
  serviceName
}) {
  var _response$aggregation3, _response$aggregation4;
  const [{
    indices: allIndicesStats
  }, indicesLifecycleStatus, indicesInfo, response] = await Promise.all([(0, _indices_stats_helpers.getTotalIndicesStats)({
    apmEventClient,
    context
  }), (0, _indices_stats_helpers.getIndicesLifecycleStatus)({
    apmEventClient,
    context
  }), (0, _indices_stats_helpers.getIndicesInfo)({
    apmEventClient,
    context
  }), apmEventClient.search('get_storage_details_per_index', {
    apm: {
      events: [_common.ProcessorEvent.span, _common.ProcessorEvent.transaction, _common.ProcessorEvent.error, _common.ProcessorEvent.metric]
    },
    body: {
      size: 0,
      track_total_hits: false,
      query: {
        bool: {
          filter: [...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery), ...(0, _server.rangeQuery)(start, end), ...(0, _server.termQuery)(_elasticsearch_fieldnames.SERVICE_NAME, serviceName), ...(indexLifecyclePhase !== _storage_explorer_types.IndexLifecyclePhaseSelectOption.All ? (0, _server.termQuery)(_elasticsearch_fieldnames.TIER, _storage_explorer_types.indexLifeCyclePhaseToDataTier[indexLifecyclePhase]) : [])]
        }
      },
      aggs: {
        sample: {
          random_sampler: randomSampler,
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
  })]);
  return (_response$aggregation3 = (_response$aggregation4 = response.aggregations) === null || _response$aggregation4 === void 0 ? void 0 : _response$aggregation4.sample.indices.buckets.map(bucket => {
    var _indexInfo$settings$i, _indexInfo$settings, _indexInfo$settings$i2, _indexInfo$settings$n, _indexInfo$settings2;
    const indexName = bucket.key;
    const numberOfDocs = bucket.number_of_metric_docs_for_index.value;
    const indexInfo = indicesInfo[indexName];
    const indexLifecycle = indicesLifecycleStatus[indexName];
    const size = allIndicesStats && (0, _indices_stats_helpers.getEstimatedSizeForDocumentsInIndex)({
      allIndicesStats,
      indexName,
      numberOfDocs
    });
    return {
      indexName,
      numberOfDocs,
      primary: indexInfo ? (_indexInfo$settings$i = (_indexInfo$settings = indexInfo.settings) === null || _indexInfo$settings === void 0 ? void 0 : (_indexInfo$settings$i2 = _indexInfo$settings.index) === null || _indexInfo$settings$i2 === void 0 ? void 0 : _indexInfo$settings$i2.number_of_shards) !== null && _indexInfo$settings$i !== void 0 ? _indexInfo$settings$i : 0 : undefined,
      replica: indexInfo ? (_indexInfo$settings$n = (_indexInfo$settings2 = indexInfo.settings) === null || _indexInfo$settings2 === void 0 ? void 0 : _indexInfo$settings2.number_of_replicas) !== null && _indexInfo$settings$n !== void 0 ? _indexInfo$settings$n : 0 : undefined,
      size,
      dataStream: indexInfo === null || indexInfo === void 0 ? void 0 : indexInfo.data_stream,
      lifecyclePhase: indexLifecycle && 'phase' in indexLifecycle ? indexLifecycle.phase : undefined
    };
  })) !== null && _response$aggregation3 !== void 0 ? _response$aggregation3 : [];
}