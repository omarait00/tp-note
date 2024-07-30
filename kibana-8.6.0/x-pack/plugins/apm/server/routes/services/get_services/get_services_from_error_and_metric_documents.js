"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServicesFromErrorAndMetricDocuments = getServicesFromErrorAndMetricDocuments;
var _server = require("../../../../../observability/server");
var _common = require("../../../../../observability/common");
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
var _environment_query = require("../../../../common/utils/environment_query");
var _service_group_query = require("../../../lib/service_group_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getServicesFromErrorAndMetricDocuments({
  environment,
  apmEventClient,
  maxNumServices,
  kuery,
  start,
  end,
  serviceGroup,
  randomSampler
}) {
  var _response$aggregation, _response$aggregation2;
  const response = await apmEventClient.search('get_services_from_error_and_metric_documents', {
    apm: {
      events: [_common.ProcessorEvent.metric, _common.ProcessorEvent.error]
    },
    body: {
      track_total_hits: false,
      size: 0,
      query: {
        bool: {
          filter: [...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery), ...(0, _service_group_query.serviceGroupQuery)(serviceGroup)]
        }
      },
      aggs: {
        sample: {
          random_sampler: randomSampler,
          aggs: {
            services: {
              terms: {
                field: _elasticsearch_fieldnames.SERVICE_NAME,
                size: maxNumServices
              },
              aggs: {
                environments: {
                  terms: {
                    field: _elasticsearch_fieldnames.SERVICE_ENVIRONMENT
                  }
                },
                latest: {
                  top_metrics: {
                    metrics: [{
                      field: _elasticsearch_fieldnames.AGENT_NAME
                    }],
                    sort: {
                      '@timestamp': 'desc'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
  return (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.sample.services.buckets.map(bucket => {
    return {
      serviceName: bucket.key,
      environments: bucket.environments.buckets.map(envBucket => envBucket.key),
      agentName: bucket.latest.top[0].metrics[_elasticsearch_fieldnames.AGENT_NAME]
    };
  })) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
}