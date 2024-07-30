"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLinkedChildrenCountBySpanId = getLinkedChildrenCountBySpanId;
exports.getLinkedChildrenOfSpan = getLinkedChildrenOfSpan;
var _server = require("../../../../observability/server");
var _common = require("../../../../observability/common");
var _lodash = require("lodash");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function fetchLinkedChildrenOfSpan({
  traceId,
  apmEventClient,
  start,
  end,
  spanId
}) {
  const {
    startWithBuffer,
    endWithBuffer
  } = (0, _utils.getBufferedTimerange)({
    start,
    end
  });
  const response = await apmEventClient.search('fetch_linked_children_of_span', {
    apm: {
      events: [_common.ProcessorEvent.span, _common.ProcessorEvent.transaction]
    },
    _source: [_elasticsearch_fieldnames.SPAN_LINKS, _elasticsearch_fieldnames.TRACE_ID, _elasticsearch_fieldnames.SPAN_ID, _elasticsearch_fieldnames.PROCESSOR_EVENT, _elasticsearch_fieldnames.TRANSACTION_ID],
    body: {
      track_total_hits: false,
      size: 1000,
      query: {
        bool: {
          filter: [...(0, _server.rangeQuery)(startWithBuffer, endWithBuffer), {
            term: {
              [_elasticsearch_fieldnames.SPAN_LINKS_TRACE_ID]: traceId
            }
          }, ...(spanId ? [{
            term: {
              [_elasticsearch_fieldnames.SPAN_LINKS_SPAN_ID]: spanId
            }
          }] : [])]
        }
      }
    }
  });
  // Filter out documents that don't have any span.links that match the combination of traceId and spanId
  return response.hits.hits.filter(({
    _source: source
  }) => {
    var _source$span, _source$span$links;
    const spanLinks = (_source$span = source.span) === null || _source$span === void 0 ? void 0 : (_source$span$links = _source$span.links) === null || _source$span$links === void 0 ? void 0 : _source$span$links.filter(spanLink => {
      return spanLink.trace.id === traceId && (spanId ? spanLink.span.id === spanId : true);
    });
    return !(0, _lodash.isEmpty)(spanLinks);
  });
}
function getSpanId(source) {
  var _transaction;
  return source.processor.event === _common.ProcessorEvent.span ? source.span.id : (_transaction = source.transaction) === null || _transaction === void 0 ? void 0 : _transaction.id;
}
async function getLinkedChildrenCountBySpanId({
  traceId,
  apmEventClient,
  start,
  end
}) {
  const linkedChildren = await fetchLinkedChildrenOfSpan({
    traceId,
    apmEventClient,
    start,
    end
  });
  return linkedChildren.reduce((acc, {
    _source: source
  }) => {
    var _source$span2, _source$span2$links;
    (_source$span2 = source.span) === null || _source$span2 === void 0 ? void 0 : (_source$span2$links = _source$span2.links) === null || _source$span2$links === void 0 ? void 0 : _source$span2$links.forEach(link => {
      // Ignores span links that don't belong to this trace
      if (link.trace.id === traceId) {
        acc[link.span.id] = (acc[link.span.id] || 0) + 1;
      }
    });
    return acc;
  }, {});
}
async function getLinkedChildrenOfSpan({
  traceId,
  spanId,
  apmEventClient,
  start,
  end
}) {
  const linkedChildren = await fetchLinkedChildrenOfSpan({
    traceId,
    spanId,
    apmEventClient,
    start,
    end
  });
  return linkedChildren.map(({
    _source: source
  }) => {
    return {
      trace: {
        id: source.trace.id
      },
      span: {
        id: getSpanId(source)
      }
    };
  });
}