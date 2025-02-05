"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIndicesStats = void 0;
var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getIndicesStats = async (esClient, logger) => {
  const [findings, latestFindings, score] = await Promise.all([getIndexStats(esClient, _constants.FINDINGS_INDEX_DEFAULT_NS, logger), getIndexStats(esClient, _constants.LATEST_FINDINGS_INDEX_DEFAULT_NS, logger), getIndexStats(esClient, _constants.BENCHMARK_SCORE_INDEX_DEFAULT_NS, logger)]);
  return {
    findings,
    latest_findings: latestFindings,
    score
  };
};
exports.getIndicesStats = getIndicesStats;
const getIndexStats = async (esClient, index, logger) => {
  try {
    const isIndexExists = await esClient.indices.exists({
      index
    });
    if (isIndexExists) {
      var _indexStats$_all$prim, _indexStats$_all$prim2, _indexStats$_all$prim3, _indexStats$_all$prim4, _indexStats$_all$prim5, _indexStats$_all$prim6, _indexStats$_all$prim7, _indexStats$_all$prim8, _indexStats$_all$prim9;
      const indexStats = await getIndexDocCount(esClient, index);
      return {
        doc_count: (_indexStats$_all$prim = indexStats._all.primaries) !== null && _indexStats$_all$prim !== void 0 && _indexStats$_all$prim.docs ? (_indexStats$_all$prim2 = indexStats._all.primaries) === null || _indexStats$_all$prim2 === void 0 ? void 0 : (_indexStats$_all$prim3 = _indexStats$_all$prim2.docs) === null || _indexStats$_all$prim3 === void 0 ? void 0 : _indexStats$_all$prim3.count : 0,
        deleted: (_indexStats$_all$prim4 = indexStats._all.primaries) !== null && _indexStats$_all$prim4 !== void 0 && (_indexStats$_all$prim5 = _indexStats$_all$prim4.docs) !== null && _indexStats$_all$prim5 !== void 0 && _indexStats$_all$prim5.deleted ? (_indexStats$_all$prim6 = indexStats._all.primaries) === null || _indexStats$_all$prim6 === void 0 ? void 0 : (_indexStats$_all$prim7 = _indexStats$_all$prim6.docs) === null || _indexStats$_all$prim7 === void 0 ? void 0 : _indexStats$_all$prim7.deleted : 0,
        size_in_bytes: (_indexStats$_all$prim8 = indexStats._all.primaries) !== null && _indexStats$_all$prim8 !== void 0 && _indexStats$_all$prim8.store ? (_indexStats$_all$prim9 = indexStats._all.primaries) === null || _indexStats$_all$prim9 === void 0 ? void 0 : _indexStats$_all$prim9.store.size_in_bytes : 0,
        last_doc_timestamp: await getLatestDocTimestamp(esClient, index)
      };
    }
    return {};
  } catch (e) {
    logger.error(`Failed to get index stats for ${index}`);
    return {};
  }
};
const getIndexDocCount = (esClient, index) => esClient.indices.stats({
  index
});
const getLatestDocTimestamp = async (esClient, index) => {
  var _latestTimestamp$hits, _latestTimestamp$hits2;
  const latestTimestamp = await esClient.search({
    index,
    query: {
      match_all: {}
    },
    sort: '@timestamp:desc',
    size: 1,
    fields: ['@timestamp'],
    _source: false
  });
  const latestEventTimestamp = (_latestTimestamp$hits = latestTimestamp.hits) === null || _latestTimestamp$hits === void 0 ? void 0 : (_latestTimestamp$hits2 = _latestTimestamp$hits.hits[0]) === null || _latestTimestamp$hits2 === void 0 ? void 0 : _latestTimestamp$hits2.fields;
  return latestEventTimestamp ? latestEventTimestamp['@timestamp'][0] : null;
};