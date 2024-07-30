"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransactionDurationChartPreview = getTransactionDurationChartPreview;
var _server = require("../../../../../../observability/server");
var _apm_rule_types = require("../../../../../common/rules/apm_rule_types");
var _elasticsearch_fieldnames = require("../../../../../common/elasticsearch_fieldnames");
var _environment_query = require("../../../../../common/utils/environment_query");
var _transactions = require("../../../../lib/helpers/transactions");
var _environment_filter_values = require("../../../../../common/environment_filter_values");
var _average_or_percentile_agg = require("./average_or_percentile_agg");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getTransactionDurationChartPreview({
  alertParams,
  config,
  apmEventClient
}) {
  const {
    aggregationType = _apm_rule_types.AggregationType.Avg,
    environment,
    serviceName,
    transactionType,
    interval,
    start,
    end
  } = alertParams;
  const searchAggregatedTransactions = await (0, _transactions.getSearchTransactionsEvents)({
    config,
    apmEventClient,
    kuery: ''
  });
  const query = {
    bool: {
      filter: [...(0, _server.termQuery)(_elasticsearch_fieldnames.SERVICE_NAME, serviceName), ...(0, _server.termQuery)(_elasticsearch_fieldnames.TRANSACTION_TYPE, transactionType), ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _transactions.getDocumentTypeFilterForTransactions)(searchAggregatedTransactions)]
    }
  };
  const transactionDurationField = (0, _transactions.getDurationFieldForTransactions)(searchAggregatedTransactions);
  const aggs = {
    timeseries: {
      date_histogram: {
        field: '@timestamp',
        fixed_interval: interval,
        min_doc_count: 0,
        extended_bounds: {
          min: start,
          max: end
        }
      },
      aggs: {
        environment: {
          terms: {
            field: _elasticsearch_fieldnames.SERVICE_ENVIRONMENT,
            missing: _environment_filter_values.ENVIRONMENT_NOT_DEFINED.value,
            size: 10,
            order: {
              [aggregationType === _apm_rule_types.AggregationType.Avg ? 'avgLatency' : `pctLatency.${aggregationType === _apm_rule_types.AggregationType.P95 ? 95 : 99}`]: 'desc'
            }
          },
          aggs: (0, _average_or_percentile_agg.averageOrPercentileAgg)({
            aggregationType,
            transactionDurationField
          })
        }
      }
    }
  };
  const params = {
    apm: {
      events: [(0, _transactions.getProcessorEventForTransactions)(searchAggregatedTransactions)]
    },
    body: {
      size: 0,
      track_total_hits: false,
      query,
      aggs
    }
  };
  const resp = await apmEventClient.search('get_transaction_duration_chart_preview', params);
  if (!resp.aggregations) {
    return [];
  }
  const environmentDataMap = resp.aggregations.timeseries.buckets.reduce((acc, bucket) => {
    const x = bucket.key;
    bucket.environment.buckets.forEach(environmentBucket => {
      const env = environmentBucket.key;
      const y = 'avgLatency' in environmentBucket ? environmentBucket.avgLatency.value : environmentBucket.pctLatency.values[0].value;
      if (acc[env]) {
        acc[env].push({
          x,
          y
        });
      } else {
        acc[env] = [{
          x,
          y
        }];
      }
    });
    return acc;
  }, {});
  return Object.keys(environmentDataMap).map(env => ({
    name: (0, _environment_filter_values.getEnvironmentLabel)(env),
    data: environmentDataMap[env]
  }));
}