"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAgentsItems = getAgentsItems;
var _processor_event = require("../../../../observability/common/processor_event");
var _queries = require("../../../../observability/server/utils/queries");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
var _environment_query = require("../../../common/utils/environment_query");
var _get_services_items = require("../services/get_services/get_services_items");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getAgentsItems({
  environment,
  agentLanguage,
  serviceName,
  kuery,
  apmEventClient,
  start,
  end,
  randomSampler
}) {
  var _response$aggregation, _response$aggregation2;
  const response = await apmEventClient.search('get_agent_details', {
    apm: {
      events: [_processor_event.ProcessorEvent.metric]
    },
    body: {
      track_total_hits: false,
      size: 0,
      query: {
        bool: {
          filter: [{
            exists: {
              field: _elasticsearch_fieldnames.AGENT_NAME
            }
          }, {
            exists: {
              field: _elasticsearch_fieldnames.AGENT_VERSION
            }
          }, ...(0, _queries.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _queries.kqlQuery)(kuery), ...(serviceName ? (0, _queries.termQuery)(_elasticsearch_fieldnames.SERVICE_NAME, serviceName) : []), ...(agentLanguage ? (0, _queries.termQuery)(_elasticsearch_fieldnames.SERVICE_LANGUAGE_NAME, agentLanguage) : [])]
        }
      },
      aggs: {
        sample: {
          random_sampler: randomSampler,
          aggs: {
            services: {
              terms: {
                field: _elasticsearch_fieldnames.SERVICE_NAME,
                size: _get_services_items.MAX_NUMBER_OF_SERVICES
              },
              aggs: {
                instances: {
                  cardinality: {
                    field: _elasticsearch_fieldnames.SERVICE_NODE_NAME
                  }
                },
                agentVersions: {
                  terms: {
                    field: _elasticsearch_fieldnames.AGENT_VERSION
                  }
                },
                sample: {
                  top_metrics: {
                    metrics: [{
                      field: _elasticsearch_fieldnames.AGENT_NAME
                    }],
                    sort: {
                      '@timestamp': 'desc'
                    }
                  }
                },
                environments: {
                  terms: {
                    field: _elasticsearch_fieldnames.SERVICE_ENVIRONMENT
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
      environments: bucket.environments.buckets.map(env => env.key),
      agentName: bucket.sample.top[0].metrics[_elasticsearch_fieldnames.AGENT_NAME],
      agentVersion: bucket.agentVersions.buckets.map(version => version.key),
      // service.node.name is set by the server only if a container.id or host.name are set. Otherwise should be explicitly set by agents.
      instances: bucket.instances.value || 1
    };
  })) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
}