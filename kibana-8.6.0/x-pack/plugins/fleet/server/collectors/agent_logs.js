"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAgentLogsTopErrors = getAgentLogsTopErrors;
var _services = require("../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DEFAULT_LOGS_DATA = {
  agent_logs_top_errors: [],
  fleet_server_logs_top_errors: []
};
async function getAgentLogsTopErrors(esClient) {
  if (!esClient) {
    return DEFAULT_LOGS_DATA;
  }
  try {
    const queryTopMessages = index => esClient.search({
      index,
      size: 0,
      query: {
        bool: {
          filter: [{
            term: {
              'log.level': 'error'
            }
          }, {
            range: {
              '@timestamp': {
                gte: 'now-1h'
              }
            }
          }]
        }
      },
      aggs: {
        message_sample: {
          sampler: {
            shard_size: 200
          },
          aggs: {
            categories: {
              categorize_text: {
                field: 'message',
                size: 10
              }
            }
          }
        }
      }
    });
    const transformBuckets = resp => {
      var _categories$buckets, _resp$aggregations, _resp$aggregations$me, _resp$aggregations$me2;
      return ((_categories$buckets = resp === null || resp === void 0 ? void 0 : (_resp$aggregations = resp.aggregations) === null || _resp$aggregations === void 0 ? void 0 : (_resp$aggregations$me = _resp$aggregations.message_sample) === null || _resp$aggregations$me === void 0 ? void 0 : (_resp$aggregations$me2 = _resp$aggregations$me.categories) === null || _resp$aggregations$me2 === void 0 ? void 0 : _resp$aggregations$me2.buckets) !== null && _categories$buckets !== void 0 ? _categories$buckets : []).slice(0, 3).map(bucket => bucket.key);
    };
    const agentResponse = await queryTopMessages('logs-elastic_agent-*');
    const fleetServerResponse = await queryTopMessages('logs-elastic_agent.fleet_server-*');
    return {
      agent_logs_top_errors: transformBuckets(agentResponse),
      fleet_server_logs_top_errors: transformBuckets(fleetServerResponse)
    };
  } catch (error) {
    if (error.statusCode === 404) {
      _services.appContextService.getLogger().debug('Index pattern logs-elastic_agent* does not exist yet.');
    } else {
      throw error;
    }
    return DEFAULT_LOGS_DATA;
  }
}