"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInfrastructureData = void 0;
var _server = require("../../../../observability/server");
var _common = require("../../../../observability/common");
var _environment_query = require("../../../common/utils/environment_query");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getInfrastructureData = async ({
  kuery,
  serviceName,
  environment,
  apmEventClient,
  start,
  end
}) => {
  var _response$aggregation, _response$aggregation2, _response$aggregation3, _response$aggregation4, _response$aggregation5, _response$aggregation6, _response$aggregation7, _response$aggregation8, _response$aggregation9;
  const response = await apmEventClient.search('get_service_infrastructure', {
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
          }, ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery)]
        }
      },
      aggs: {
        containerIds: {
          terms: {
            field: _elasticsearch_fieldnames.CONTAINER_ID,
            size: 500
          }
        },
        hostNames: {
          terms: {
            field: _elasticsearch_fieldnames.HOST_HOSTNAME,
            size: 500
          }
        },
        podNames: {
          terms: {
            field: _elasticsearch_fieldnames.KUBERNETES_POD_NAME,
            size: 500
          }
        }
      }
    }
  });
  return {
    containerIds: (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : (_response$aggregation3 = _response$aggregation2.containerIds) === null || _response$aggregation3 === void 0 ? void 0 : _response$aggregation3.buckets.map(bucket => bucket.key)) !== null && _response$aggregation !== void 0 ? _response$aggregation : [],
    hostNames: (_response$aggregation4 = (_response$aggregation5 = response.aggregations) === null || _response$aggregation5 === void 0 ? void 0 : (_response$aggregation6 = _response$aggregation5.hostNames) === null || _response$aggregation6 === void 0 ? void 0 : _response$aggregation6.buckets.map(bucket => bucket.key)) !== null && _response$aggregation4 !== void 0 ? _response$aggregation4 : [],
    podNames: (_response$aggregation7 = (_response$aggregation8 = response.aggregations) === null || _response$aggregation8 === void 0 ? void 0 : (_response$aggregation9 = _response$aggregation8.podNames) === null || _response$aggregation9 === void 0 ? void 0 : _response$aggregation9.buckets.map(bucket => bucket.key)) !== null && _response$aggregation7 !== void 0 ? _response$aggregation7 : []
  };
};
exports.getInfrastructureData = getInfrastructureData;