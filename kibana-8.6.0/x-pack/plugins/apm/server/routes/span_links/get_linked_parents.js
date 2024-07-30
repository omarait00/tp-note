"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLinkedParentsOfSpan = getLinkedParentsOfSpan;
var _server = require("../../../../observability/server");
var _common = require("../../../../observability/common");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getLinkedParentsOfSpan({
  apmEventClient,
  traceId,
  spanId,
  start,
  end,
  processorEvent
}) {
  var _response$hits$hits, _response$hits$hits$, _source$span;
  const response = await apmEventClient.search('get_linked_parents_of_span', {
    apm: {
      events: [processorEvent]
    },
    _source: [_elasticsearch_fieldnames.SPAN_LINKS],
    body: {
      track_total_hits: false,
      size: 1,
      query: {
        bool: {
          filter: [...(0, _server.rangeQuery)(start, end), {
            term: {
              [_elasticsearch_fieldnames.TRACE_ID]: traceId
            }
          }, {
            exists: {
              field: _elasticsearch_fieldnames.SPAN_LINKS
            }
          }, {
            term: {
              [_elasticsearch_fieldnames.PROCESSOR_EVENT]: processorEvent
            }
          }, ...(processorEvent === _common.ProcessorEvent.transaction ? [{
            term: {
              [_elasticsearch_fieldnames.TRANSACTION_ID]: spanId
            }
          }] : [{
            term: {
              [_elasticsearch_fieldnames.SPAN_ID]: spanId
            }
          }])]
        }
      }
    }
  });
  const source = (_response$hits$hits = response.hits.hits) === null || _response$hits$hits === void 0 ? void 0 : (_response$hits$hits$ = _response$hits$hits[0]) === null || _response$hits$hits$ === void 0 ? void 0 : _response$hits$hits$._source;
  return (source === null || source === void 0 ? void 0 : (_source$span = source.span) === null || _source$span === void 0 ? void 0 : _source$span.links) || [];
}