"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getColdstartRate = getColdstartRate;
exports.getColdstartRatePeriods = getColdstartRatePeriods;
var _server = require("../../../../observability/server");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
var _offset_previous_period_coordinate = require("../../../common/utils/offset_previous_period_coordinate");
var _environment_query = require("../../../common/utils/environment_query");
var _transactions = require("../helpers/transactions");
var _get_bucket_size_for_aggregated_transactions = require("../helpers/get_bucket_size_for_aggregated_transactions");
var _transaction_coldstart_rate = require("../helpers/transaction_coldstart_rate");
var _get_offset_in_ms = require("../../../common/utils/get_offset_in_ms");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getColdstartRate({
  environment,
  kuery,
  serviceName,
  transactionType,
  transactionName,
  apmEventClient,
  searchAggregatedTransactions,
  start,
  end,
  offset
}) {
  const {
    startWithOffset,
    endWithOffset
  } = (0, _get_offset_in_ms.getOffsetInMs)({
    start,
    end,
    offset
  });
  const filter = [...(0, _server.termQuery)(_elasticsearch_fieldnames.SERVICE_NAME, serviceName), {
    exists: {
      field: _elasticsearch_fieldnames.FAAS_COLDSTART
    }
  }, ...(transactionName ? (0, _server.termQuery)(_elasticsearch_fieldnames.TRANSACTION_NAME, transactionName) : []), ...(0, _server.termQuery)(_elasticsearch_fieldnames.TRANSACTION_TYPE, transactionType), ...(0, _transactions.getDocumentTypeFilterForTransactions)(searchAggregatedTransactions), ...(0, _server.rangeQuery)(startWithOffset, endWithOffset), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery)];
  const coldstartStates = (0, _transaction_coldstart_rate.getColdstartAggregation)();
  const params = {
    apm: {
      events: [(0, _transactions.getProcessorEventForTransactions)(searchAggregatedTransactions)]
    },
    body: {
      track_total_hits: false,
      size: 0,
      query: {
        bool: {
          filter
        }
      },
      aggs: {
        coldstartStates,
        timeseries: {
          date_histogram: {
            field: '@timestamp',
            fixed_interval: (0, _get_bucket_size_for_aggregated_transactions.getBucketSizeForAggregatedTransactions)({
              start: startWithOffset,
              end: endWithOffset,
              searchAggregatedTransactions
            }).intervalString,
            min_doc_count: 0,
            extended_bounds: {
              min: startWithOffset,
              max: endWithOffset
            }
          },
          aggs: {
            coldstartStates
          }
        }
      }
    }
  };
  const resp = await apmEventClient.search('get_transaction_group_coldstart_rate', params);
  if (!resp.aggregations) {
    return {
      transactionColdstartRate: [],
      average: null
    };
  }
  const transactionColdstartRate = (0, _transaction_coldstart_rate.getTransactionColdstartRateTimeSeries)(resp.aggregations.timeseries.buckets);
  const average = (0, _transaction_coldstart_rate.calculateTransactionColdstartRate)(resp.aggregations.coldstartStates);
  return {
    transactionColdstartRate,
    average
  };
}
async function getColdstartRatePeriods({
  environment,
  kuery,
  serviceName,
  transactionType,
  transactionName = '',
  apmEventClient,
  searchAggregatedTransactions,
  start,
  end,
  offset
}) {
  const commonProps = {
    environment,
    kuery,
    serviceName,
    transactionType,
    transactionName,
    apmEventClient,
    searchAggregatedTransactions
  };
  const currentPeriodPromise = getColdstartRate({
    ...commonProps,
    start,
    end
  });
  const previousPeriodPromise = offset ? getColdstartRate({
    ...commonProps,
    start,
    end,
    offset
  }) : {
    transactionColdstartRate: [],
    average: null
  };
  const [currentPeriod, previousPeriod] = await Promise.all([currentPeriodPromise, previousPeriodPromise]);
  const firstCurrentPeriod = currentPeriod.transactionColdstartRate;
  return {
    currentPeriod,
    previousPeriod: {
      ...previousPeriod,
      transactionColdstartRate: (0, _offset_previous_period_coordinate.offsetPreviousPeriodCoordinates)({
        currentPeriodTimeseries: firstCurrentPeriod,
        previousPeriodTimeseries: previousPeriod.transactionColdstartRate
      })
    }
  };
}