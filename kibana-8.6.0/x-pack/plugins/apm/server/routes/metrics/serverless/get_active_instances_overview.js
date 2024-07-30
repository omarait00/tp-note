"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServerlessActiveInstancesOverview = getServerlessActiveInstancesOverview;
var _common = require("../../../../../observability/common");
var _server = require("../../../../../observability/server");
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
var _serverless = require("../../../../common/serverless");
var _environment_query = require("../../../../common/utils/environment_query");
var _get_bucket_size = require("../../../lib/helpers/get_bucket_size");
var _helper = require("./helper");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getServerlessActiveInstancesOverview({
  end,
  environment,
  kuery,
  serviceName,
  start,
  serverlessId,
  apmEventClient
}) {
  var _response$aggregation, _response$aggregation2, _response$aggregation3;
  const {
    intervalString
  } = (0, _get_bucket_size.getBucketSize)({
    start,
    end,
    numBuckets: 20
  });
  const aggs = {
    faasDurationAvg: {
      avg: {
        field: _elasticsearch_fieldnames.FAAS_DURATION
      }
    },
    faasBilledDurationAvg: {
      avg: {
        field: _elasticsearch_fieldnames.FAAS_BILLED_DURATION
      }
    }
  };
  const params = {
    apm: {
      events: [_common.ProcessorEvent.metric]
    },
    body: {
      track_total_hits: 1,
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
        activeInstances: {
          terms: {
            field: _elasticsearch_fieldnames.SERVICE_NODE_NAME
          },
          aggs: {
            serverlessFunctions: {
              terms: {
                field: _elasticsearch_fieldnames.FAAS_ID
              },
              aggs: {
                ...{
                  ...aggs,
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
                },
                timeseries: {
                  date_histogram: {
                    field: '@timestamp',
                    fixed_interval: intervalString,
                    min_doc_count: 0,
                    extended_bounds: {
                      min: start,
                      max: end
                    }
                  },
                  aggs
                }
              }
            }
          }
        }
      }
    }
  };
  const response = await apmEventClient.search('ger_serverless_active_instances_overview', params);
  return ((_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : (_response$aggregation2 = _response$aggregation.activeInstances) === null || _response$aggregation2 === void 0 ? void 0 : (_response$aggregation3 = _response$aggregation2.buckets) === null || _response$aggregation3 === void 0 ? void 0 : _response$aggregation3.flatMap(bucket => {
    const activeInstanceName = bucket.key;
    const serverlessFunctionsDetails = bucket.serverlessFunctions.buckets.reduce((acc, curr) => {
      const currentServerlessId = curr.key;
      const timeseries = curr.timeseries.buckets.reduce((timeseriesAcc, timeseriesCurr) => {
        return {
          serverlessDuration: [...timeseriesAcc.serverlessDuration, {
            x: timeseriesCurr.key,
            y: timeseriesCurr.faasDurationAvg.value
          }],
          billedDuration: [...timeseriesAcc.billedDuration, {
            x: timeseriesCurr.key,
            y: timeseriesCurr.faasBilledDurationAvg.value
          }]
        };
      }, {
        serverlessDuration: [],
        billedDuration: []
      });
      return [...acc, {
        activeInstanceName,
        serverlessId: currentServerlessId,
        serverlessFunctionName: (0, _serverless.getServerlessFunctionNameFromId)(currentServerlessId),
        timeseries,
        serverlessDurationAvg: curr.faasDurationAvg.value,
        billedDurationAvg: curr.faasBilledDurationAvg.value,
        avgMemoryUsed: (0, _helper.calcMemoryUsed)({
          memoryFree: curr.avgFreeMemory.value,
          memoryTotal: curr.avgTotalMemory.value
        }),
        memorySize: curr.avgTotalMemory.value
      }];
    }, []);
    return serverlessFunctionsDetails;
  })) || [];
}