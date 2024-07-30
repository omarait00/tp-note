"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMetadataForDependency = getMetadataForDependency;
var _server = require("../../../../observability/server");
var _common = require("../../../../observability/common");
var _maybe2 = require("../../../common/utils/maybe");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getMetadataForDependency({
  apmEventClient,
  dependencyName,
  start,
  end
}) {
  var _maybe;
  const sampleResponse = await apmEventClient.search('get_metadata_for_dependency', {
    apm: {
      events: [_common.ProcessorEvent.span]
    },
    body: {
      track_total_hits: false,
      size: 1,
      query: {
        bool: {
          filter: [{
            term: {
              [_elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE]: dependencyName
            }
          }, ...(0, _server.rangeQuery)(start, end)]
        }
      },
      sort: {
        '@timestamp': 'desc'
      }
    }
  });
  const sample = (_maybe = (0, _maybe2.maybe)(sampleResponse.hits.hits[0])) === null || _maybe === void 0 ? void 0 : _maybe._source;
  return {
    spanType: sample === null || sample === void 0 ? void 0 : sample.span.type,
    spanSubtype: sample === null || sample === void 0 ? void 0 : sample.span.subtype
  };
}