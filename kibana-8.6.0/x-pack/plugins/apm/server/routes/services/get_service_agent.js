"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceAgent = getServiceAgent;
var _server = require("../../../../observability/server");
var _common = require("../../../../observability/common");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getServiceAgent({
  serviceName,
  apmEventClient,
  start,
  end
}) {
  var _service$runtime;
  const params = {
    terminate_after: 1,
    apm: {
      events: [_common.ProcessorEvent.error, _common.ProcessorEvent.transaction, _common.ProcessorEvent.metric]
    },
    body: {
      track_total_hits: 1,
      size: 1,
      _source: [_elasticsearch_fieldnames.AGENT_NAME, _elasticsearch_fieldnames.SERVICE_RUNTIME_NAME],
      query: {
        bool: {
          filter: [{
            term: {
              [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
            }
          }, ...(0, _server.rangeQuery)(start, end), {
            exists: {
              field: _elasticsearch_fieldnames.AGENT_NAME
            }
          }],
          should: {
            exists: {
              field: _elasticsearch_fieldnames.SERVICE_RUNTIME_NAME
            }
          }
        }
      },
      sort: {
        _score: {
          order: 'desc'
        }
      }
    }
  };
  const response = await apmEventClient.search('get_service_agent_name', params);
  if (response.hits.total.value === 0) {
    return {};
  }
  const {
    agent,
    service
  } = response.hits.hits[0]._source;
  return {
    agentName: agent === null || agent === void 0 ? void 0 : agent.name,
    runtimeName: service === null || service === void 0 ? void 0 : (_service$runtime = service.runtime) === null || _service$runtime === void 0 ? void 0 : _service$runtime.name
  };
}