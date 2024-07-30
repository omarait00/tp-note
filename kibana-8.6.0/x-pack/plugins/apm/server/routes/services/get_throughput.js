"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThroughput = getThroughput;
var _server = require("../../../../observability/server");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
var _environment_query = require("../../../common/utils/environment_query");
var _transactions = require("../../lib/helpers/transactions");
var _get_offset_in_ms = require("../../../common/utils/get_offset_in_ms");
var _get_bucket_size_for_aggregated_transactions = require("../../lib/helpers/get_bucket_size_for_aggregated_transactions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getThroughput({
  environment,
  kuery,
  searchAggregatedTransactions,
  serviceName,
  apmEventClient,
  transactionType,
  transactionName,
  start,
  end,
  offset
}) {
  var _response$aggregation, _response$aggregation2;
  const {
    startWithOffset,
    endWithOffset
  } = (0, _get_offset_in_ms.getOffsetInMs)({
    start,
    end,
    offset
  });
  const {
    intervalString
  } = (0, _get_bucket_size_for_aggregated_transactions.getBucketSizeForAggregatedTransactions)({
    start: startWithOffset,
    end: endWithOffset,
    searchAggregatedTransactions
  });
  const params = {
    apm: {
      events: [(0, _transactions.getProcessorEventForTransactions)(searchAggregatedTransactions)]
    },
    body: {
      track_total_hits: false,
      size: 0,
      query: {
        bool: {
          filter: [{
            term: {
              [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
            }
          }, {
            term: {
              [_elasticsearch_fieldnames.TRANSACTION_TYPE]: transactionType
            }
          }, ...(0, _transactions.getDocumentTypeFilterForTransactions)(searchAggregatedTransactions), ...(0, _server.rangeQuery)(startWithOffset, endWithOffset), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery), ...(0, _server.termQuery)(_elasticsearch_fieldnames.TRANSACTION_NAME, transactionName)]
        }
      },
      aggs: {
        timeseries: {
          date_histogram: {
            field: '@timestamp',
            fixed_interval: intervalString,
            min_doc_count: 0,
            extended_bounds: {
              min: startWithOffset,
              max: endWithOffset
            }
          },
          aggs: {
            throughput: {
              rate: {
                unit: 'minute'
              }
            }
          }
        }
      }
    }
  };
  const response = await apmEventClient.search('get_throughput_for_service', params);
  return (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.timeseries.buckets.map(bucket => {
    return {
      x: bucket.key,
      y: bucket.throughput.value
    };
  })) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
}