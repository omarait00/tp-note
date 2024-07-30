"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServerlessFunctionsOverview = getServerlessFunctionsOverview;
var _common = require("../../../../../observability/common");
var _server = require("../../../../../observability/server");
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
var _serverless = require("../../../../common/serverless");
var _environment_query = require("../../../../common/utils/environment_query");
var _helper = require("./helper");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getServerlessFunctionsOverview({
  end,
  environment,
  kuery,
  serviceName,
  start,
  apmEventClient
}) {
  var _response$aggregation, _response$aggregation2, _response$aggregation3;
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
          }, ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery)]
        }
      },
      aggs: {
        serverlessFunctions: {
          terms: {
            field: _elasticsearch_fieldnames.FAAS_ID
          },
          aggs: {
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
            coldStartCount: {
              sum: {
                field: _elasticsearch_fieldnames.FAAS_COLDSTART
              }
            },
            maxTotalMemory: {
              max: {
                field: _elasticsearch_fieldnames.METRIC_SYSTEM_TOTAL_MEMORY
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
            }
          }
        }
      }
    }
  };
  const response = await apmEventClient.search('ger_serverless_functions_overview', params);
  const serverlessFunctionsOverview = (_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : (_response$aggregation2 = _response$aggregation.serverlessFunctions) === null || _response$aggregation2 === void 0 ? void 0 : (_response$aggregation3 = _response$aggregation2.buckets) === null || _response$aggregation3 === void 0 ? void 0 : _response$aggregation3.map(bucket => {
    const serverlessId = bucket.key;
    return {
      serverlessId,
      serverlessFunctionName: (0, _serverless.getServerlessFunctionNameFromId)(serverlessId),
      serverlessDurationAvg: bucket.faasDurationAvg.value,
      billedDurationAvg: bucket.faasBilledDurationAvg.value,
      coldStartCount: bucket.coldStartCount.value,
      avgMemoryUsed: (0, _helper.calcMemoryUsed)({
        memoryFree: bucket.avgFreeMemory.value,
        memoryTotal: bucket.avgTotalMemory.value
      }),
      memorySize: bucket.maxTotalMemory.value
    };
  });
  return serverlessFunctionsOverview || [];
}