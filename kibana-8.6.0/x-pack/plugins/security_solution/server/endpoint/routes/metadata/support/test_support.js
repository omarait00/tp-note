"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.legacyMetadataSearchResponseMock = legacyMetadataSearchResponseMock;
exports.unitedMetadataSearchResponseMock = unitedMetadataSearchResponseMock;
var _constants = require("../../../../../common/endpoint/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function legacyMetadataSearchResponseMock(hostMetadata) {
  return {
    took: 15,
    timed_out: false,
    _shards: {
      total: 1,
      successful: 1,
      skipped: 0,
      failed: 0
    },
    hits: {
      total: {
        value: 1,
        relation: 'eq'
      },
      max_score: null,
      hits: hostMetadata ? [{
        _index: 'metrics-endpoint.metadata-default',
        _id: '8FhM0HEBYyRTvb6lOQnw',
        _score: null,
        _source: {
          ...hostMetadata
        },
        sort: [1588337587997]
      }] : []
    }
  };
}
function unitedMetadataSearchResponseMock(hostMetadata = {}, agent = {}) {
  return {
    took: 15,
    timed_out: false,
    _shards: {
      total: 1,
      successful: 1,
      skipped: 0,
      failed: 0
    },
    hits: {
      total: {
        value: 1,
        relation: 'eq'
      },
      max_score: null,
      hits: hostMetadata ? [{
        _index: _constants.METADATA_UNITED_INDEX,
        _id: '8FhM0HEBYyRTvb6lOQnw',
        _score: null,
        _source: {
          agent: {
            id: 'test-agent-id'
          },
          united: {
            agent: {
              ...agent
            },
            endpoint: {
              ...hostMetadata
            }
          }
        },
        sort: [1588337587997]
      }] : []
    }
  };
}