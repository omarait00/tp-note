"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTraceSamplesByQuery = getTraceSamplesByQuery;
var _server = require("../../../../observability/server");
var _common = require("../../../../observability/common");
var _trace_explorer = require("../../../common/trace_explorer");
var _environment_query = require("../../../common/utils/environment_query");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
var _as_mutable_array = require("../../../common/utils/as_mutable_array");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getTraceSamplesByQuery({
  apmEventClient,
  start,
  end,
  environment,
  query,
  type
}) {
  var _traceSamplesResponse, _traceSamplesResponse2;
  const size = 500;
  let traceIds = [];
  if (type === _trace_explorer.TraceSearchType.kql) {
    var _await$apmEventClient, _await$apmEventClient2;
    traceIds = (_await$apmEventClient = (_await$apmEventClient2 = (await apmEventClient.search('get_trace_ids_by_kql_query', {
      apm: {
        events: [_common.ProcessorEvent.transaction, _common.ProcessorEvent.span, _common.ProcessorEvent.error]
      },
      body: {
        track_total_hits: false,
        size: 0,
        query: {
          bool: {
            filter: [...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(query)]
          }
        },
        aggs: {
          traceId: {
            terms: {
              field: _elasticsearch_fieldnames.TRACE_ID,
              execution_hint: 'map',
              size
            }
          }
        }
      }
    })).aggregations) === null || _await$apmEventClient2 === void 0 ? void 0 : _await$apmEventClient2.traceId.buckets.map(bucket => bucket.key)) !== null && _await$apmEventClient !== void 0 ? _await$apmEventClient : [];
  } else if (type === _trace_explorer.TraceSearchType.eql) {
    var _await$apmEventClient3, _await$apmEventClient4, _await$apmEventClient5;
    traceIds = (_await$apmEventClient3 = (_await$apmEventClient4 = (await apmEventClient.eqlSearch('get_trace_ids_by_eql_query', {
      apm: {
        events: [_common.ProcessorEvent.transaction, _common.ProcessorEvent.span, _common.ProcessorEvent.error]
      },
      body: {
        size: 1000,
        filter: {
          bool: {
            filter: [...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment)]
          }
        },
        event_category_field: _elasticsearch_fieldnames.PROCESSOR_EVENT,
        query
      },
      filter_path: 'hits.sequences.events._source.trace.id'
    })).hits) === null || _await$apmEventClient4 === void 0 ? void 0 : (_await$apmEventClient5 = _await$apmEventClient4.sequences) === null || _await$apmEventClient5 === void 0 ? void 0 : _await$apmEventClient5.flatMap(sequence => sequence.events.map(event => event._source.trace.id))) !== null && _await$apmEventClient3 !== void 0 ? _await$apmEventClient3 : [];
  }
  if (!traceIds.length) {
    return [];
  }
  const traceSamplesResponse = await apmEventClient.search('get_trace_samples_by_trace_ids', {
    apm: {
      events: [_common.ProcessorEvent.transaction]
    },
    body: {
      track_total_hits: false,
      size: 0,
      query: {
        bool: {
          filter: [{
            term: {
              [_elasticsearch_fieldnames.TRANSACTION_SAMPLED]: true
            }
          }, ...(0, _server.termsQuery)(_elasticsearch_fieldnames.TRACE_ID, ...traceIds), ...(0, _server.rangeQuery)(start, end)],
          must_not: [{
            exists: {
              field: _elasticsearch_fieldnames.PARENT_ID
            }
          }]
        }
      },
      aggs: {
        transactionId: {
          terms: {
            field: _elasticsearch_fieldnames.TRANSACTION_ID,
            size
          },
          aggs: {
            latest: {
              top_metrics: {
                metrics: (0, _as_mutable_array.asMutableArray)([{
                  field: _elasticsearch_fieldnames.TRACE_ID
                }]),
                size: 1,
                sort: {
                  '@timestamp': 'desc'
                }
              }
            }
          }
        }
      }
    }
  });
  return (_traceSamplesResponse = (_traceSamplesResponse2 = traceSamplesResponse.aggregations) === null || _traceSamplesResponse2 === void 0 ? void 0 : _traceSamplesResponse2.transactionId.buckets.map(bucket => ({
    traceId: bucket.latest.top[0].metrics['trace.id'],
    transactionId: bucket.key
  }))) !== null && _traceSamplesResponse !== void 0 ? _traceSamplesResponse : [];
}