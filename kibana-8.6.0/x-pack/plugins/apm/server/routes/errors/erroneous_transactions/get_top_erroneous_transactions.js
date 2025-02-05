"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTopErroneousTransactionsPeriods = getTopErroneousTransactionsPeriods;
var _server = require("../../../../../observability/server");
var _common = require("../../../../../observability/common");
var _lodash = require("lodash");
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
var _environment_query = require("../../../../common/utils/environment_query");
var _get_bucket_size = require("../../../lib/helpers/get_bucket_size");
var _get_offset_in_ms = require("../../../../common/utils/get_offset_in_ms");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getTopErroneousTransactions({
  environment,
  kuery,
  serviceName,
  groupId,
  apmEventClient,
  start,
  end,
  numBuckets,
  offset
}) {
  var _res$aggregations$top, _res$aggregations;
  const {
    startWithOffset,
    endWithOffset,
    offsetInMs
  } = (0, _get_offset_in_ms.getOffsetInMs)({
    start,
    end,
    offset
  });
  const {
    intervalString
  } = (0, _get_bucket_size.getBucketSize)({
    start: startWithOffset,
    end: endWithOffset,
    numBuckets
  });
  const res = await apmEventClient.search('get_top_erroneous_transactions', {
    apm: {
      events: [_common.ProcessorEvent.error]
    },
    body: {
      track_total_hits: false,
      size: 0,
      query: {
        bool: {
          filter: [...(0, _server.termQuery)(_elasticsearch_fieldnames.SERVICE_NAME, serviceName), ...(0, _server.termQuery)(_elasticsearch_fieldnames.ERROR_GROUP_ID, groupId), ...(0, _server.rangeQuery)(startWithOffset, endWithOffset), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery)]
        }
      },
      aggs: {
        top_five_transactions: {
          terms: {
            field: _elasticsearch_fieldnames.TRANSACTION_NAME,
            size: 5
          },
          aggs: {
            sample: {
              top_hits: {
                size: 1,
                _source: [_elasticsearch_fieldnames.TRANSACTION_TYPE]
              }
            },
            timeseries: {
              date_histogram: {
                field: '@timestamp',
                fixed_interval: intervalString,
                extended_bounds: {
                  min: startWithOffset,
                  max: endWithOffset
                }
              }
            }
          }
        }
      }
    }
  });
  return (_res$aggregations$top = (_res$aggregations = res.aggregations) === null || _res$aggregations === void 0 ? void 0 : _res$aggregations.top_five_transactions.buckets.map(({
    key,
    doc_count: docCount,
    sample,
    timeseries
  }) => {
    var _sample$hits$hits$0$_;
    return {
      transactionName: key,
      transactionType: (_sample$hits$hits$0$_ = sample.hits.hits[0]._source.transaction) === null || _sample$hits$hits$0$_ === void 0 ? void 0 : _sample$hits$hits$0$_.type,
      occurrences: docCount,
      timeseries: timeseries.buckets.map(timeseriesBucket => {
        return {
          x: timeseriesBucket.key + offsetInMs,
          y: timeseriesBucket.doc_count
        };
      })
    };
  })) !== null && _res$aggregations$top !== void 0 ? _res$aggregations$top : [];
}
async function getTopErroneousTransactionsPeriods({
  kuery,
  serviceName,
  apmEventClient,
  numBuckets,
  groupId,
  environment,
  start,
  end,
  offset
}) {
  const [currentPeriod, previousPeriod] = await Promise.all([getTopErroneousTransactions({
    environment,
    kuery,
    serviceName,
    apmEventClient,
    numBuckets,
    groupId,
    start,
    end
  }), offset ? getTopErroneousTransactions({
    environment,
    kuery,
    serviceName,
    apmEventClient,
    numBuckets,
    groupId,
    start,
    end,
    offset
  }) : []]);
  const previousPeriodByTransactionName = (0, _lodash.keyBy)(previousPeriod, 'transactionName');
  return {
    topErroneousTransactions: currentPeriod.map(({
      transactionName,
      timeseries: currentPeriodTimeseries,
      ...rest
    }) => {
      var _previousPeriodByTran, _previousPeriodByTran2;
      return {
        ...rest,
        transactionName,
        currentPeriodTimeseries,
        previousPeriodTimeseries: (_previousPeriodByTran = (_previousPeriodByTran2 = previousPeriodByTransactionName[transactionName]) === null || _previousPeriodByTran2 === void 0 ? void 0 : _previousPeriodByTran2.timeseries) !== null && _previousPeriodByTran !== void 0 ? _previousPeriodByTran : []
      };
    })
  };
}