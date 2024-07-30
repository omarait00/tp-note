"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTopDependencySpans = getTopDependencySpans;
var _common = require("../../../../observability/common");
var _server = require("../../../../observability/server");
var _lodash = require("lodash");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
var _event_outcome = require("../../../common/event_outcome");
var _environment_query = require("../../../common/utils/environment_query");
var _maybe = require("../../../common/utils/maybe");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MAX_NUM_SPANS = 1000;
async function getTopDependencySpans({
  apmEventClient,
  dependencyName,
  spanName,
  start,
  end,
  environment,
  kuery,
  sampleRangeFrom,
  sampleRangeTo
}) {
  const spans = (await apmEventClient.search('get_top_dependency_spans', {
    apm: {
      events: [_common.ProcessorEvent.span]
    },
    body: {
      track_total_hits: false,
      size: MAX_NUM_SPANS,
      query: {
        bool: {
          filter: [...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery), ...(0, _server.termQuery)(_elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE, dependencyName), ...(0, _server.termQuery)(_elasticsearch_fieldnames.SPAN_NAME, spanName), {
            exists: {
              field: _elasticsearch_fieldnames.TRANSACTION_ID
            }
          }, ...((sampleRangeFrom !== null && sampleRangeFrom !== void 0 ? sampleRangeFrom : 0) >= 0 && (sampleRangeTo !== null && sampleRangeTo !== void 0 ? sampleRangeTo : 0) > 0 ? [{
            range: {
              [_elasticsearch_fieldnames.SPAN_DURATION]: {
                gte: sampleRangeFrom,
                lte: sampleRangeTo
              }
            }
          }] : [])]
        }
      },
      _source: [_elasticsearch_fieldnames.SPAN_ID, _elasticsearch_fieldnames.TRACE_ID, _elasticsearch_fieldnames.TRANSACTION_ID, _elasticsearch_fieldnames.SPAN_NAME, _elasticsearch_fieldnames.SERVICE_NAME, _elasticsearch_fieldnames.SERVICE_ENVIRONMENT, _elasticsearch_fieldnames.AGENT_NAME, _elasticsearch_fieldnames.SPAN_DURATION, _elasticsearch_fieldnames.EVENT_OUTCOME, '@timestamp']
    }
  })).hits.hits.map(hit => hit._source);
  const transactionIds = spans.map(span => span.transaction.id);
  const transactions = (await apmEventClient.search('get_transactions_for_dependency_spans', {
    apm: {
      events: [_common.ProcessorEvent.transaction]
    },
    body: {
      track_total_hits: false,
      size: transactionIds.length,
      query: {
        bool: {
          filter: [...(0, _server.termsQuery)(_elasticsearch_fieldnames.TRANSACTION_ID, ...transactionIds)]
        }
      },
      _source: [_elasticsearch_fieldnames.TRANSACTION_ID, _elasticsearch_fieldnames.TRANSACTION_TYPE, _elasticsearch_fieldnames.TRANSACTION_NAME],
      sort: {
        '@timestamp': 'desc'
      }
    }
  })).hits.hits.map(hit => hit._source);
  const transactionsById = (0, _lodash.keyBy)(transactions, transaction => transaction.transaction.id);
  return spans.map(span => {
    var _span$event;
    const transaction = (0, _maybe.maybe)(transactionsById[span.transaction.id]);
    return {
      '@timestamp': new Date(span['@timestamp']).getTime(),
      spanId: span.span.id,
      spanName: span.span.name,
      serviceName: span.service.name,
      agentName: span.agent.name,
      duration: span.span.duration.us,
      traceId: span.trace.id,
      outcome: ((_span$event = span.event) === null || _span$event === void 0 ? void 0 : _span$event.outcome) || _event_outcome.EventOutcome.unknown,
      transactionId: span.transaction.id,
      transactionType: transaction === null || transaction === void 0 ? void 0 : transaction.transaction.type,
      transactionName: transaction === null || transaction === void 0 ? void 0 : transaction.transaction.name
    };
  });
}