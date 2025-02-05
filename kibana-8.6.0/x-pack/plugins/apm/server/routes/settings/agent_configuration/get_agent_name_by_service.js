"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAgentNameByService = getAgentNameByService;
var _common = require("../../../../../observability/common");
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getAgentNameByService({
  serviceName,
  apmEventClient
}) {
  var _aggregations$agent_n;
  const params = {
    terminate_after: 1,
    apm: {
      events: [_common.ProcessorEvent.transaction, _common.ProcessorEvent.error, _common.ProcessorEvent.metric]
    },
    body: {
      track_total_hits: false,
      size: 0,
      query: {
        bool: {
          filter: [{
            term: {
              [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
            }
          }]
        }
      },
      aggs: {
        agent_names: {
          terms: {
            field: _elasticsearch_fieldnames.AGENT_NAME,
            size: 1
          }
        }
      }
    }
  };
  const {
    aggregations
  } = await apmEventClient.search('get_agent_name_by_service', params);
  const agentName = aggregations === null || aggregations === void 0 ? void 0 : (_aggregations$agent_n = aggregations.agent_names.buckets[0]) === null || _aggregations$agent_n === void 0 ? void 0 : _aggregations$agent_n.key;
  return agentName;
}