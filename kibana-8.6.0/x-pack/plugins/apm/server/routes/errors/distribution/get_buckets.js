"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBuckets = getBuckets;
var _server = require("../../../../../observability/server");
var _common = require("../../../../../observability/common");
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
var _environment_query = require("../../../../common/utils/environment_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getBuckets({
  environment,
  kuery,
  serviceName,
  groupId,
  bucketSize,
  apmEventClient,
  start,
  end
}) {
  var _resp$aggregations;
  const params = {
    apm: {
      events: [_common.ProcessorEvent.error]
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
          }, ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery), ...(0, _server.termQuery)(_elasticsearch_fieldnames.ERROR_GROUP_ID, groupId)]
        }
      },
      aggs: {
        distribution: {
          histogram: {
            field: '@timestamp',
            min_doc_count: 0,
            interval: bucketSize,
            extended_bounds: {
              min: start,
              max: end
            }
          }
        }
      }
    }
  };
  const resp = await apmEventClient.search('get_error_distribution_buckets', params);
  const buckets = (((_resp$aggregations = resp.aggregations) === null || _resp$aggregations === void 0 ? void 0 : _resp$aggregations.distribution.buckets) || []).map(bucket => ({
    x: bucket.key,
    y: bucket.doc_count
  }));
  return {
    buckets
  };
}