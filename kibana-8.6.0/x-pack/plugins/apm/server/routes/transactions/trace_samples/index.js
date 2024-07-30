"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTraceSamples = getTraceSamples;
var _server = require("../../../../../observability/server");
var _common = require("../../../../../observability/common");
var _lodash = require("lodash");
var _with_apm_span = require("../../../utils/with_apm_span");
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
var _environment_query = require("../../../../common/utils/environment_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const TRACE_SAMPLES_SIZE = 500;
async function getTraceSamples({
  environment,
  kuery,
  serviceName,
  transactionName,
  transactionType,
  transactionId,
  traceId,
  sampleRangeFrom,
  sampleRangeTo,
  apmEventClient,
  start,
  end
}) {
  return (0, _with_apm_span.withApmSpan)('get_trace_samples', async () => {
    const commonFilters = [{
      term: {
        [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
      }
    }, {
      term: {
        [_elasticsearch_fieldnames.TRANSACTION_TYPE]: transactionType
      }
    }, {
      term: {
        [_elasticsearch_fieldnames.TRANSACTION_NAME]: transactionName
      }
    }, ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery)];
    if (sampleRangeFrom !== undefined && sampleRangeTo !== undefined) {
      commonFilters.push({
        range: {
          'transaction.duration.us': {
            gte: sampleRangeFrom,
            lte: sampleRangeTo
          }
        }
      });
    }
    const response = await apmEventClient.search('get_trace_samples_hits', {
      apm: {
        events: [_common.ProcessorEvent.transaction]
      },
      _source: [_elasticsearch_fieldnames.TRANSACTION_ID, _elasticsearch_fieldnames.TRACE_ID, '@timestamp'],
      body: {
        track_total_hits: false,
        query: {
          bool: {
            filter: [...commonFilters, {
              term: {
                [_elasticsearch_fieldnames.TRANSACTION_SAMPLED]: true
              }
            }],
            should: [{
              term: {
                [_elasticsearch_fieldnames.TRACE_ID]: traceId
              }
            }, {
              term: {
                [_elasticsearch_fieldnames.TRANSACTION_ID]: transactionId
              }
            }]
          }
        },
        size: TRACE_SAMPLES_SIZE
      }
    });
    const traceSamples = (0, _lodash.orderBy)(response.hits.hits.map(hit => ({
      score: hit._score,
      timestamp: hit._source['@timestamp'],
      transactionId: hit._source.transaction.id,
      traceId: hit._source.trace.id
    })), ['score', 'timestamp'], ['desc', 'desc']);
    return {
      traceSamples
    };
  });
}