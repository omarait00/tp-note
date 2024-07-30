"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClustersQuery = exports.getClustersFromAggs = exports.getClusters = void 0;
var _get_grouped_findings_evaluation = require("./get_grouped_findings_evaluation");
var _get_stats = require("./get_stats");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getClustersQuery = (query, pitId) => ({
  size: 0,
  query,
  aggs: {
    aggs_by_cluster_id: {
      terms: {
        field: 'cluster_id'
      },
      aggs: {
        latestFindingTopHit: {
          top_hits: {
            size: 1,
            sort: [{
              '@timestamp': {
                order: 'desc'
              }
            }]
          }
        },
        ..._get_grouped_findings_evaluation.failedFindingsAggQuery,
        ..._get_stats.findingsEvaluationAggsQuery
      }
    }
  },
  pit: {
    id: pitId
  }
});
exports.getClustersQuery = getClustersQuery;
const getClustersFromAggs = clusters => clusters.map(cluster => {
  var _latestFindingHit$_so, _latestFindingHit$_so2;
  const latestFindingHit = cluster.latestFindingTopHit.hits.hits[0];
  if (!latestFindingHit._source) throw new Error('Missing findings top hits');
  const meta = {
    clusterId: cluster.key,
    clusterName: (_latestFindingHit$_so = latestFindingHit._source.orchestrator) === null || _latestFindingHit$_so === void 0 ? void 0 : (_latestFindingHit$_so2 = _latestFindingHit$_so.cluster) === null || _latestFindingHit$_so2 === void 0 ? void 0 : _latestFindingHit$_so2.name,
    benchmarkName: latestFindingHit._source.rule.benchmark.name,
    benchmarkId: latestFindingHit._source.rule.benchmark.id,
    lastUpdate: latestFindingHit._source['@timestamp']
  };

  // get cluster's stats
  if (!cluster.failed_findings || !cluster.passed_findings) throw new Error('missing findings evaluations per cluster');
  const stats = (0, _get_stats.getStatsFromFindingsEvaluationsAggs)(cluster);

  // get cluster's resource types aggs
  const resourcesTypesAggs = cluster.aggs_by_resource_type.buckets;
  if (!Array.isArray(resourcesTypesAggs)) throw new Error('missing aggs by resource type per cluster');
  const groupedFindingsEvaluation = (0, _get_grouped_findings_evaluation.getFailedFindingsFromAggs)(resourcesTypesAggs);
  return {
    meta,
    stats,
    groupedFindingsEvaluation
  };
});
exports.getClustersFromAggs = getClustersFromAggs;
const getClusters = async (esClient, query, pitId) => {
  var _queryResult$aggregat;
  const queryResult = await esClient.search(getClustersQuery(query, pitId));
  const clusters = (_queryResult$aggregat = queryResult.aggregations) === null || _queryResult$aggregat === void 0 ? void 0 : _queryResult$aggregat.aggs_by_cluster_id.buckets;
  if (!Array.isArray(clusters)) throw new Error('missing aggs by cluster id');
  return getClustersFromAggs(clusters);
};
exports.getClusters = getClusters;