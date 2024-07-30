"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTraceSampleIds = getTraceSampleIds;
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _lodash = require("lodash");
var _server = require("../../../../observability/server");
var _common = require("../../../../observability/common");
var _as_mutable_array = require("../../../common/utils/as_mutable_array");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
var _service_map = require("../../../common/service_map");
var _environment_query = require("../../../common/utils/environment_query");
var _service_group_query = require("../../lib/service_group_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MAX_TRACES_TO_INSPECT = 1000;
async function getTraceSampleIds({
  serviceNames,
  environment,
  config,
  apmEventClient,
  start,
  end,
  serviceGroup
}) {
  var _serviceNames$length;
  const query = {
    bool: {
      filter: [...(0, _server.rangeQuery)(start, end), ...(0, _service_group_query.serviceGroupQuery)(serviceGroup)]
    }
  };
  let events;
  const hasServiceNamesFilter = ((_serviceNames$length = serviceNames === null || serviceNames === void 0 ? void 0 : serviceNames.length) !== null && _serviceNames$length !== void 0 ? _serviceNames$length : 0) > 0;
  if (hasServiceNamesFilter) {
    query.bool.filter.push({
      terms: {
        [_elasticsearch_fieldnames.SERVICE_NAME]: serviceNames
      }
    });
    events = [_common.ProcessorEvent.span, _common.ProcessorEvent.transaction];
  } else {
    events = [_common.ProcessorEvent.span];
    query.bool.filter.push({
      exists: {
        field: _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE
      }
    });
  }
  query.bool.filter.push(...(0, _environment_query.environmentQuery)(environment));
  const fingerprintBucketSize = hasServiceNamesFilter ? config.serviceMapFingerprintBucketSize : config.serviceMapFingerprintGlobalBucketSize;
  const traceIdBucketSize = hasServiceNamesFilter ? config.serviceMapTraceIdBucketSize : config.serviceMapTraceIdGlobalBucketSize;
  const samplerShardSize = traceIdBucketSize * 10;
  const params = {
    apm: {
      events
    },
    body: {
      track_total_hits: false,
      size: 0,
      query,
      aggs: {
        connections: {
          composite: {
            sources: (0, _as_mutable_array.asMutableArray)([{
              [_elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE]: {
                terms: {
                  field: _elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE,
                  missing_bucket: true
                }
              }
            }, {
              [_elasticsearch_fieldnames.SERVICE_NAME]: {
                terms: {
                  field: _elasticsearch_fieldnames.SERVICE_NAME
                }
              }
            }, {
              [_elasticsearch_fieldnames.SERVICE_ENVIRONMENT]: {
                terms: {
                  field: _elasticsearch_fieldnames.SERVICE_ENVIRONMENT,
                  missing_bucket: true
                }
              }
            }]),
            size: fingerprintBucketSize
          },
          aggs: {
            sample: {
              sampler: {
                shard_size: samplerShardSize
              },
              aggs: {
                trace_ids: {
                  terms: {
                    field: _elasticsearch_fieldnames.TRACE_ID,
                    size: traceIdBucketSize,
                    execution_hint: 'map',
                    // remove bias towards large traces by sorting on trace.id
                    // which will be random-esque
                    order: {
                      _key: 'desc'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  try {
    var _tracesSampleResponse;
    const tracesSampleResponse = await apmEventClient.search('get_trace_sample_ids', params);
    // make sure at least one trace per composite/connection bucket is queried
    const traceIdsWithPriority = ((_tracesSampleResponse = tracesSampleResponse.aggregations) === null || _tracesSampleResponse === void 0 ? void 0 : _tracesSampleResponse.connections.buckets.flatMap(bucket => bucket.sample.trace_ids.buckets.map((sampleDocBucket, index) => ({
      traceId: sampleDocBucket.key,
      priority: index
    })))) || [];
    const traceIds = (0, _lodash.take)((0, _lodash.uniq)((0, _lodash.sortBy)(traceIdsWithPriority, 'priority').map(({
      traceId
    }) => traceId)), MAX_TRACES_TO_INSPECT);
    return {
      traceIds
    };
  } catch (error) {
    if ('displayName' in error && error.displayName === 'RequestTimeout') {
      throw _boom.default.internal(_service_map.SERVICE_MAP_TIMEOUT_ERROR);
    }
    throw error;
  }
}