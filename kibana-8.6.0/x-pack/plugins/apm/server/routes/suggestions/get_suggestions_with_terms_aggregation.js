"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSuggestionsWithTermsAggregation = getSuggestionsWithTermsAggregation;
var _server = require("../../../../observability/server");
var _common = require("../../../../observability/common");
var _transactions = require("../../lib/helpers/transactions");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getSuggestionsWithTermsAggregation({
  fieldName,
  fieldValue,
  searchAggregatedTransactions,
  serviceName,
  apmEventClient,
  size,
  start,
  end
}) {
  var _response$aggregation, _response$aggregation2;
  const response = await apmEventClient.search('get_suggestions_with_terms_aggregation', {
    apm: {
      events: [(0, _transactions.getProcessorEventForTransactions)(searchAggregatedTransactions), _common.ProcessorEvent.error, _common.ProcessorEvent.metric]
    },
    body: {
      track_total_hits: false,
      timeout: '1500ms',
      size: 0,
      query: {
        bool: {
          filter: [...(0, _server.termQuery)(_elasticsearch_fieldnames.SERVICE_NAME, serviceName), ...(0, _server.rangeQuery)(start, end), {
            wildcard: {
              [fieldName]: `*${fieldValue}*`
            }
          }]
        }
      },
      aggs: {
        items: {
          terms: {
            field: fieldName,
            size
          }
        }
      }
    }
  });
  return {
    terms: (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.items.buckets.map(bucket => bucket.key)) !== null && _response$aggregation !== void 0 ? _response$aggregation : []
  };
}