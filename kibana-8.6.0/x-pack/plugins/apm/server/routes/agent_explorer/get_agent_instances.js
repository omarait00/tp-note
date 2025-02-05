"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAgentInstances = getAgentInstances;
var _common = require("../../../../observability/common");
var _server = require("../../../../observability/server");
var _service_nodes = require("../../../common/service_nodes");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
var _environment_query = require("../../../common/utils/environment_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MAX_NUMBER_OF_SERVICE_NODES = 500;
async function getAgentInstances({
  environment,
  serviceName,
  kuery,
  apmEventClient,
  start,
  end
}) {
  var _response$aggregation, _response$aggregation2;
  const response = await apmEventClient.search('get_agent_instances', {
    apm: {
      events: [_common.ProcessorEvent.metric]
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
          }, ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery), ...(serviceName ? (0, _server.termQuery)(_elasticsearch_fieldnames.SERVICE_NAME, serviceName) : [])]
        }
      },
      aggs: {
        serviceNodes: {
          terms: {
            field: _elasticsearch_fieldnames.SERVICE_NODE_NAME,
            missing: _service_nodes.SERVICE_NODE_NAME_MISSING,
            size: MAX_NUMBER_OF_SERVICE_NODES
          },
          aggs: {
            environments: {
              terms: {
                field: _elasticsearch_fieldnames.SERVICE_ENVIRONMENT
              }
            },
            sample: {
              top_metrics: {
                metrics: [{
                  field: _elasticsearch_fieldnames.AGENT_VERSION
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
  });
  return (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.serviceNodes.buckets.map(agentInstance => ({
    serviceNode: agentInstance.key,
    environments: agentInstance.environments.buckets.map(environmentBucket => environmentBucket.key),
    agentVersion: agentInstance.sample.top[0].metrics[_elasticsearch_fieldnames.AGENT_VERSION],
    lastReport: agentInstance.sample.top[0].sort[0]
  }))) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
}