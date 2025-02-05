"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTotalTransactionsPerService = getTotalTransactionsPerService;
var _server = require("../../../../observability/server");
var _transactions = require("../../lib/helpers/transactions");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
var _storage_explorer_types = require("../../../common/storage_explorer_types");
var _environment_query = require("../../../common/utils/environment_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getTotalTransactionsPerService({
  apmEventClient,
  searchAggregatedTransactions,
  indexLifecyclePhase,
  randomSampler,
  start,
  end,
  environment,
  kuery
}) {
  var _response$aggregation, _response$aggregation2;
  const response = await apmEventClient.search('get_total_transactions_per_service', {
    apm: {
      events: [(0, _transactions.getProcessorEventForTransactions)(searchAggregatedTransactions)]
    },
    body: {
      size: 0,
      track_total_hits: false,
      query: {
        bool: {
          filter: [...(0, _transactions.getDocumentTypeFilterForTransactions)(searchAggregatedTransactions), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery), ...(0, _server.rangeQuery)(start, end), ...(indexLifecyclePhase !== _storage_explorer_types.IndexLifecyclePhaseSelectOption.All ? (0, _server.termQuery)(_elasticsearch_fieldnames.TIER, _storage_explorer_types.indexLifeCyclePhaseToDataTier[indexLifecyclePhase]) : [])]
        }
      },
      aggs: {
        sample: {
          random_sampler: randomSampler,
          aggs: {
            services: {
              terms: {
                field: _elasticsearch_fieldnames.SERVICE_NAME,
                size: 500
              }
            }
          }
        }
      }
    }
  });
  return (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.sample.services.buckets.reduce((transactionsPerService, bucket) => {
    transactionsPerService[bucket.key] = bucket.doc_count;
    return transactionsPerService;
  }, {})) !== null && _response$aggregation !== void 0 ? _response$aggregation : {};
}