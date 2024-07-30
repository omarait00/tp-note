"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTrendsQuery = exports.getTrendsFromQueryResult = exports.getTrends = void 0;
var _constants = require("../../../common/constants");
var _get_stats = require("./get_stats");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getTrendsQuery = () => ({
  index: _constants.BENCHMARK_SCORE_INDEX_DEFAULT_NS,
  // large number that should be sufficient for 24 hours considering we write to the score index every 5 minutes
  size: 999,
  sort: '@timestamp:desc',
  query: {
    bool: {
      must: {
        range: {
          '@timestamp': {
            gte: 'now-1d',
            lte: 'now'
          }
        }
      }
    }
  }
});
exports.getTrendsQuery = getTrendsQuery;
const getTrendsFromQueryResult = scoreTrendDocs => scoreTrendDocs.map(data => ({
  timestamp: data['@timestamp'],
  summary: {
    totalFindings: data.total_findings,
    totalFailed: data.failed_findings,
    totalPassed: data.passed_findings,
    postureScore: (0, _get_stats.calculatePostureScore)(data.passed_findings, data.failed_findings)
  },
  clusters: Object.fromEntries(Object.entries(data.score_by_cluster_id).map(([clusterId, cluster]) => [clusterId, {
    totalFindings: cluster.total_findings,
    totalFailed: cluster.failed_findings,
    totalPassed: cluster.passed_findings,
    postureScore: (0, _get_stats.calculatePostureScore)(cluster.passed_findings, cluster.failed_findings)
  }]))
}));
exports.getTrendsFromQueryResult = getTrendsFromQueryResult;
const getTrends = async esClient => {
  const trendsQueryResult = await esClient.search(getTrendsQuery());
  if (!trendsQueryResult.hits.hits) throw new Error('missing trend results from score index');
  const scoreTrendDocs = trendsQueryResult.hits.hits.map(hit => {
    if (!hit._source) throw new Error('missing _source data for one or more of trend results');
    return hit._source;
  });
  return getTrendsFromQueryResult(scoreTrendDocs);
};
exports.getTrends = getTrends;