"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSpanLinksDetails = getSpanLinksDetails;
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

async function fetchSpanLinksDetails({
  apmEventClient,
  kuery,
  spanLinks,
  start,
  end
}) {
  const {
    startWithBuffer,
    endWithBuffer
  } = (0, _utils.getBufferedTimerange)({
    start,
    end
  });
  const response = await apmEventClient.search('get_span_links_details', {
    apm: {
      events: [_common.ProcessorEvent.span, _common.ProcessorEvent.transaction]
    },
    _source: [_elasticsearch_fieldnames.TRACE_ID, _elasticsearch_fieldnames.SPAN_ID, _elasticsearch_fieldnames.TRANSACTION_ID, _elasticsearch_fieldnames.SERVICE_NAME, _elasticsearch_fieldnames.SPAN_NAME, _elasticsearch_fieldnames.TRANSACTION_NAME, _elasticsearch_fieldnames.TRANSACTION_DURATION, _elasticsearch_fieldnames.SPAN_DURATION, _elasticsearch_fieldnames.PROCESSOR_EVENT, _elasticsearch_fieldnames.SPAN_SUBTYPE, _elasticsearch_fieldnames.SPAN_TYPE, _elasticsearch_fieldnames.AGENT_NAME],
    body: {
      track_total_hits: false,
      size: 1000,
      query: {
        bool: {
          filter: [...(0, _server.rangeQuery)(startWithBuffer, endWithBuffer), ...(0, _server.kqlQuery)(kuery), {
            bool: {
              should: spanLinks.map(item => {
                return {
                  bool: {
                    filter: [{
                      term: {
                        [_elasticsearch_fieldnames.TRACE_ID]: item.trace.id
                      }
                    }, {
                      bool: {
                        should: [{
                          term: {
                            [_elasticsearch_fieldnames.SPAN_ID]: item.span.id
                          }
                        }, {
                          term: {
                            [_elasticsearch_fieldnames.TRANSACTION_ID]: item.span.id
                          }
                        }],
                        minimum_should_match: 1
                      }
                    }]
                  }
                };
              }),
              minimum_should_match: 1
            }
          }]
        }
      }
    }
  });
  const spanIdsMap = (0, _lodash.keyBy)(spanLinks, 'span.id');
  return response.hits.hits.filter(({
    _source: source
  }) => {
    // The above query might return other spans from the same transaction because siblings spans share the same transaction.id
    // so, if it is a span we need to guarantee that the span.id is the same as the span links ids
    if (source.processor.event === _common.ProcessorEvent.span) {
      const span = source;
      const hasSpanId = spanIdsMap[span.span.id] || false;
      return hasSpanId;
    }
    return true;
  });
}
async function getSpanLinksDetails({
  apmEventClient,
  spanLinks,
  kuery,
  start,
  end
}) {
  if (!spanLinks.length) {
    return [];
  }

  // chunk span links to avoid too_many_nested_clauses problem
  const spanLinksChunks = (0, _lodash.chunk)(spanLinks, 500);
  const chunkedResponses = await Promise.all(spanLinksChunks.map(spanLinksChunk => fetchSpanLinksDetails({
    apmEventClient,
    kuery,
    spanLinks: spanLinksChunk,
    start,
    end
  })));
  const linkedSpans = chunkedResponses.flat();

  // Creates a map for all span links details found
  const spanLinksDetailsMap = linkedSpans.reduce((acc, {
    _source: source
  }) => {
    var _source$transaction;
    const commonDetails = {
      serviceName: source.service.name,
      agentName: source.agent.name,
      environment: source.service.environment,
      transactionId: (_source$transaction = source.transaction) === null || _source$transaction === void 0 ? void 0 : _source$transaction.id
    };
    if (source.processor.event === _common.ProcessorEvent.transaction) {
      const transaction = source;
      const key = `${transaction.trace.id}:${transaction.transaction.id}`;
      acc[key] = {
        traceId: source.trace.id,
        spanId: transaction.transaction.id,
        details: {
          ...commonDetails,
          spanName: transaction.transaction.name,
          duration: transaction.transaction.duration.us
        }
      };
    } else {
      const span = source;
      const key = `${span.trace.id}:${span.span.id}`;
      acc[key] = {
        traceId: source.trace.id,
        spanId: span.span.id,
        details: {
          ...commonDetails,
          spanName: span.span.name,
          duration: span.span.duration.us,
          spanSubtype: span.span.subtype,
          spanType: span.span.type
        }
      };
    }
    return acc;
  }, {});

  // It's important to keep the original order of the span links,
  // so loops trough the original list merging external links and links with details.
  // external links are links that the details were not found in the ES query.
  return (0, _lodash.compact)(spanLinks.map(item => {
    const key = `${item.trace.id}:${item.span.id}`;
    const details = spanLinksDetailsMap[key];
    if (details) {
      return details;
    }

    // When kuery is not set, returns external links, if not hides this item.
    return (0, _lodash.isEmpty)(kuery) ? {
      traceId: item.trace.id,
      spanId: item.span.id
    } : undefined;
  }));
}