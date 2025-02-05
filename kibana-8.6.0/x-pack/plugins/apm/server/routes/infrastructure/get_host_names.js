"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getContainerHostNames = getContainerHostNames;
var _server = require("../../../../observability/server");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getContainerHostNames({
  containerIds,
  infraMetricsClient,
  start,
  end
}) {
  var _response$aggregation, _response$aggregation2;
  if (!containerIds.length) {
    return [];
  }
  const response = await infraMetricsClient.search({
    size: 0,
    track_total_hits: false,
    query: {
      bool: {
        filter: [{
          terms: {
            [_elasticsearch_fieldnames.CONTAINER_ID]: containerIds
          }
        }, ...(0, _server.rangeQuery)(start, end)]
      }
    },
    aggs: {
      hostNames: {
        terms: {
          field: _elasticsearch_fieldnames.HOST_NAME,
          size: 500
        }
      }
    }
  });
  const hostNames = (_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : (_response$aggregation2 = _response$aggregation.hostNames) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.buckets.map(bucket => bucket.key);
  return hostNames !== null && hostNames !== void 0 ? hostNames : [];
}