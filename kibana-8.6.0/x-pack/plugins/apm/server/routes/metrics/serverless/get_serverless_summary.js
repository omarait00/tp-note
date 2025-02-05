"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServerlessSummary = getServerlessSummary;
var _common = require("../../../../../observability/common");
var _server = require("../../../../../observability/server");
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
var _environment_query = require("../../../../common/utils/environment_query");
var _get_compute_usage_chart = require("./get_compute_usage_chart");
var _helper = require("./helper");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getServerlessTransactionThroughput({
  end,
  environment,
  kuery,
  serviceName,
  start,
  serverlessId,
  apmEventClient
}) {
  const params = {
    apm: {
      events: [_common.ProcessorEvent.transaction]
    },
    body: {
      track_total_hits: true,
      size: 0,
      query: {
        bool: {
          filter: [...(0, _server.termQuery)(_elasticsearch_fieldnames.SERVICE_NAME, serviceName), ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery), ...(0, _server.termQuery)(_elasticsearch_fieldnames.FAAS_ID, serverlessId)]
        }
      }
    }
  };
  const response = await apmEventClient.search('get_serverless_transaction_throughout', params);
  return response.hits.total.value;
}
async function getServerlessSummary({
  end,
  environment,
  kuery,
  serviceName,
  start,
  serverlessId,
  apmEventClient,
  awsLambdaPriceFactor,
  awsLambdaRequestCostPerMillion
}) {
  var _response$aggregation, _response$aggregation2, _response$aggregation3, _response$aggregation4, _response$aggregation5, _response$aggregation6, _response$aggregation7, _response$aggregation8, _response$aggregation9, _response$aggregation10, _response$aggregation11, _response$aggregation12, _response$aggregation13, _response$aggregation14, _response$aggregation15, _response$aggregation16, _response$aggregation17;
  const params = {
    apm: {
      events: [_common.ProcessorEvent.metric]
    },
    body: {
      track_total_hits: false,
      size: 0,
      query: {
        bool: {
          filter: [...(0, _server.termQuery)(_elasticsearch_fieldnames.METRICSET_NAME, 'app'), {
            term: {
              [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
            }
          }, ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery), ...(0, _server.termQuery)(_elasticsearch_fieldnames.FAAS_ID, serverlessId)]
        }
      },
      aggs: {
        totalFunctions: {
          cardinality: {
            field: _elasticsearch_fieldnames.FAAS_ID
          }
        },
        faasDurationAvg: {
          avg: {
            field: _elasticsearch_fieldnames.FAAS_DURATION
          }
        },
        faasBilledDurationAvg: {
          avg: {
            field: _elasticsearch_fieldnames.FAAS_BILLED_DURATION
          }
        },
        avgTotalMemory: {
          avg: {
            field: _elasticsearch_fieldnames.METRIC_SYSTEM_TOTAL_MEMORY
          }
        },
        avgFreeMemory: {
          avg: {
            field: _elasticsearch_fieldnames.METRIC_SYSTEM_FREE_MEMORY
          }
        },
        countInvocations: {
          value_count: {
            field: _elasticsearch_fieldnames.FAAS_BILLED_DURATION
          }
        },
        avgComputeUsageBytesMs: _get_compute_usage_chart.computeUsageAvgScript,
        sample: {
          top_metrics: {
            metrics: [{
              field: _elasticsearch_fieldnames.HOST_ARCHITECTURE
            }],
            sort: [{
              '@timestamp': {
                order: 'desc'
              }
            }]
          }
        }
      }
    }
  };
  const [response, transactionThroughput] = await Promise.all([apmEventClient.search('get_serverless_summary', params), getServerlessTransactionThroughput({
    end,
    environment,
    kuery,
    serviceName,
    apmEventClient,
    start,
    serverlessId
  })]);
  return {
    memoryUsageAvgRate: (0, _helper.calcMemoryUsedRate)({
      memoryFree: (_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : (_response$aggregation2 = _response$aggregation.avgFreeMemory) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.value,
      memoryTotal: (_response$aggregation3 = response.aggregations) === null || _response$aggregation3 === void 0 ? void 0 : (_response$aggregation4 = _response$aggregation3.avgTotalMemory) === null || _response$aggregation4 === void 0 ? void 0 : _response$aggregation4.value
    }),
    serverlessFunctionsTotal: (_response$aggregation5 = response.aggregations) === null || _response$aggregation5 === void 0 ? void 0 : (_response$aggregation6 = _response$aggregation5.totalFunctions) === null || _response$aggregation6 === void 0 ? void 0 : _response$aggregation6.value,
    serverlessDurationAvg: (_response$aggregation7 = response.aggregations) === null || _response$aggregation7 === void 0 ? void 0 : (_response$aggregation8 = _response$aggregation7.faasDurationAvg) === null || _response$aggregation8 === void 0 ? void 0 : _response$aggregation8.value,
    billedDurationAvg: (_response$aggregation9 = response.aggregations) === null || _response$aggregation9 === void 0 ? void 0 : (_response$aggregation10 = _response$aggregation9.faasBilledDurationAvg) === null || _response$aggregation10 === void 0 ? void 0 : _response$aggregation10.value,
    estimatedCost: (0, _helper.calcEstimatedCost)({
      awsLambdaPriceFactor,
      awsLambdaRequestCostPerMillion,
      architecture: (_response$aggregation11 = response.aggregations) === null || _response$aggregation11 === void 0 ? void 0 : (_response$aggregation12 = _response$aggregation11.sample) === null || _response$aggregation12 === void 0 ? void 0 : (_response$aggregation13 = _response$aggregation12.top) === null || _response$aggregation13 === void 0 ? void 0 : (_response$aggregation14 = _response$aggregation13[0]) === null || _response$aggregation14 === void 0 ? void 0 : (_response$aggregation15 = _response$aggregation14.metrics) === null || _response$aggregation15 === void 0 ? void 0 : _response$aggregation15[_elasticsearch_fieldnames.HOST_ARCHITECTURE],
      transactionThroughput,
      computeUsageGbSec: (0, _helper.convertComputeUsageToGbSec)({
        computeUsageBytesMs: (_response$aggregation16 = response.aggregations) === null || _response$aggregation16 === void 0 ? void 0 : _response$aggregation16.avgComputeUsageBytesMs.value,
        countInvocations: (_response$aggregation17 = response.aggregations) === null || _response$aggregation17 === void 0 ? void 0 : _response$aggregation17.countInvocations.value
      })
    })
  };
}