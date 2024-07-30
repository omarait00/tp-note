"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDocumentTypeFilterForTransactions = getDocumentTypeFilterForTransactions;
exports.getDurationFieldForTransactions = getDurationFieldForTransactions;
exports.getHasTransactionsEvents = getHasTransactionsEvents;
exports.getProcessorEventForTransactions = getProcessorEventForTransactions;
exports.getSearchTransactionsEvents = getSearchTransactionsEvents;
exports.isRootTransaction = isRootTransaction;
var _server = require("../../../../../observability/server");
var _common = require("../../../../../observability/common");
var _aggregated_transactions = require("../../../../common/aggregated_transactions");
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getHasTransactionsEvents({
  start,
  end,
  apmEventClient,
  kuery
}) {
  const response = await apmEventClient.search('get_has_aggregated_transactions', {
    apm: {
      events: [_common.ProcessorEvent.metric]
    },
    body: {
      track_total_hits: 1,
      terminate_after: 1,
      size: 0,
      query: {
        bool: {
          filter: [{
            exists: {
              field: _elasticsearch_fieldnames.TRANSACTION_DURATION_HISTOGRAM
            }
          }, ...(start && end ? (0, _server.rangeQuery)(start, end) : []), ...(0, _server.kqlQuery)(kuery)]
        }
      }
    }
  });
  return response.hits.total.value > 0;
}
async function getSearchTransactionsEvents({
  config,
  start,
  end,
  apmEventClient,
  kuery
}) {
  switch (config.searchAggregatedTransactions) {
    case _aggregated_transactions.SearchAggregatedTransactionSetting.always:
      return kuery ? getHasTransactionsEvents({
        start,
        end,
        apmEventClient,
        kuery
      }) : true;
    case _aggregated_transactions.SearchAggregatedTransactionSetting.auto:
      return getHasTransactionsEvents({
        start,
        end,
        apmEventClient,
        kuery
      });
    case _aggregated_transactions.SearchAggregatedTransactionSetting.never:
      return false;
  }
}
function getDurationFieldForTransactions(searchAggregatedTransactions) {
  return searchAggregatedTransactions ? _elasticsearch_fieldnames.TRANSACTION_DURATION_HISTOGRAM : _elasticsearch_fieldnames.TRANSACTION_DURATION;
}
function getDocumentTypeFilterForTransactions(searchAggregatedTransactions) {
  return searchAggregatedTransactions ? [{
    exists: {
      field: _elasticsearch_fieldnames.TRANSACTION_DURATION_HISTOGRAM
    }
  }] : [];
}
function getProcessorEventForTransactions(searchAggregatedTransactions) {
  return searchAggregatedTransactions ? _common.ProcessorEvent.metric : _common.ProcessorEvent.transaction;
}
function isRootTransaction(searchAggregatedTransactions) {
  return searchAggregatedTransactions ? {
    term: {
      [_elasticsearch_fieldnames.TRANSACTION_ROOT]: true
    }
  } : {
    bool: {
      must_not: {
        exists: {
          field: _elasticsearch_fieldnames.PARENT_ID
        }
      }
    }
  };
}