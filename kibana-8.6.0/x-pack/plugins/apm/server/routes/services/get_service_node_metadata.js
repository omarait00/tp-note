"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceNodeMetadata = getServiceNodeMetadata;
var _server = require("../../../../observability/server");
var _common = require("../../../../observability/common");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
var _i18n = require("../../../common/i18n");
var _environment_query = require("../../../common/utils/environment_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getServiceNodeMetadata({
  kuery,
  serviceName,
  serviceNodeName,
  apmEventClient,
  start,
  end,
  environment
}) {
  var _response$aggregation, _response$aggregation2, _response$aggregation3, _response$aggregation4;
  const params = {
    apm: {
      events: [_common.ProcessorEvent.metric]
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
          }, ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery), ...(0, _environment_query.serviceNodeNameQuery)(serviceNodeName)]
        }
      },
      aggs: {
        nodes: {
          terms: {
            field: _elasticsearch_fieldnames.SERVICE_NODE_NAME
          }
        },
        host: {
          terms: {
            field: _elasticsearch_fieldnames.HOST_NAME,
            size: 1
          }
        },
        containerId: {
          terms: {
            field: _elasticsearch_fieldnames.CONTAINER_ID,
            size: 1
          }
        }
      }
    }
  };
  const response = await apmEventClient.search('get_service_node_metadata', params);
  return {
    host: ((_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : (_response$aggregation2 = _response$aggregation.host.buckets[0]) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.key) || _i18n.NOT_AVAILABLE_LABEL,
    containerId: ((_response$aggregation3 = response.aggregations) === null || _response$aggregation3 === void 0 ? void 0 : (_response$aggregation4 = _response$aggregation3.containerId.buckets[0]) === null || _response$aggregation4 === void 0 ? void 0 : _response$aggregation4.key) || _i18n.NOT_AVAILABLE_LABEL
  };
}