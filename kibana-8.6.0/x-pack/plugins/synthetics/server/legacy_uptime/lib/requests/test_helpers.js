"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUptimeESMockClient = void 0;
exports.mockSearchResult = mockSearchResult;
exports.setupMockEsCompositeQuery = void 0;
var _mocks = require("../../../../../../../src/core/server/mocks");
var _lib = require("../lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This utility function will set up a mock ES client, and store subsequent calls. It is designed
 * to let callers easily simulate an arbitrary series of chained composite aggregation calls by supplying
 * custom after_key values.
 *
 * This function is used by supplying criteria, a flat collection of values, and a function that can map
 * those values to the same document shape the tested code expects to receive from elasticsearch.
 * @param criteria A series of objects with the fields of interest.
 * @param genBucketItem A function that maps the criteria to the structure of a document.
 * @template K The Key type of the mock after_key value for simulated composite aggregation queries.
 * @template C The Criteria type that specifies the values of interest in the buckets returned by the mock ES.
 * @template I The Item type that specifies the simulated documents that are generated by the mock.
 */
const setupMockEsCompositeQuery = (criteria, genBucketItem) => {
  const esMock = _mocks.elasticsearchServiceMock.createElasticsearchClient();

  // eslint-disable-next-line @typescript-eslint/naming-convention
  criteria.forEach(({
    after_key,
    bucketCriteria
  }) => {
    const mockResponse = {
      aggregations: {
        monitors: {
          after_key,
          buckets: bucketCriteria.map(item => genBucketItem(item))
        }
      }
    };
    // @ts-expect-error incomplete type definition
    esMock.search.mockResponseOnce(mockResponse, {
      statusCode: 200,
      headers: {},
      warnings: [],
      meta: {}
    });
  });
  return esMock;
};
exports.setupMockEsCompositeQuery = setupMockEsCompositeQuery;
const getUptimeESMockClient = esClientMock => {
  const esClient = _mocks.elasticsearchServiceMock.createElasticsearchClient();
  const savedObjectsClient = _mocks.savedObjectsClientMock.create();
  return {
    esClient: esClientMock || esClient,
    uptimeEsClient: (0, _lib.createUptimeESClient)({
      esClient: esClientMock || esClient,
      savedObjectsClient
    })
  };
};
exports.getUptimeESMockClient = getUptimeESMockClient;
function mockSearchResult(data, aggregations = {}) {
  const {
    esClient: mockEsClient,
    uptimeEsClient
  } = getUptimeESMockClient();
  mockEsClient.search.mockResponse({
    took: 18,
    timed_out: false,
    _shards: {
      total: 1,
      successful: 1,
      skipped: 0,
      failed: 0
    },
    hits: {
      hits: Array.isArray(data) ? data : [data],
      max_score: 0.0,
      total: {
        value: Array.isArray(data) ? data.length : 0,
        relation: 'gte'
      }
    },
    aggregations
  });
  return uptimeEsClient;
}