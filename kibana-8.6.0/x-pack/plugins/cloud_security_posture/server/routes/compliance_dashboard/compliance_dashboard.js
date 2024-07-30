"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineGetComplianceDashboardRoute = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _constants = require("../../../common/constants");
var _get_grouped_findings_evaluation = require("./get_grouped_findings_evaluation");
var _get_clusters = require("./get_clusters");
var _get_stats = require("./get_stats");
var _get_trends = require("./get_trends");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getClustersTrends = (clustersWithoutTrends, trends) => clustersWithoutTrends.map(cluster => ({
  ...cluster,
  trend: trends.map(({
    timestamp,
    clusters: clustersTrendData
  }) => ({
    timestamp,
    ...clustersTrendData[cluster.meta.clusterId]
  }))
}));
const getSummaryTrend = trends => trends.map(({
  timestamp,
  summary
}) => ({
  timestamp,
  ...summary
}));
const defineGetComplianceDashboardRoute = router => router.get({
  path: _constants.STATS_ROUTE_PATH,
  validate: false,
  options: {
    tags: ['access:cloud-security-posture-read']
  }
}, async (context, _, response) => {
  const cspContext = await context.csp;
  try {
    const esClient = cspContext.esClient.asCurrentUser;
    const {
      id: pitId
    } = await esClient.openPointInTime({
      index: _constants.LATEST_FINDINGS_INDEX_DEFAULT_NS,
      keep_alive: '30s'
    });
    const query = {
      match_all: {}
    };
    const [stats, groupedFindingsEvaluation, clustersWithoutTrends, trends] = await Promise.all([(0, _get_stats.getStats)(esClient, query, pitId), (0, _get_grouped_findings_evaluation.getGroupedFindingsEvaluation)(esClient, query, pitId), (0, _get_clusters.getClusters)(esClient, query, pitId), (0, _get_trends.getTrends)(esClient)]);

    // Try closing the PIT, if it fails we can safely ignore the error since it closes itself after the keep alive
    //   ends. Not waiting on the promise returned from the `closePointInTime` call to avoid delaying the request
    esClient.closePointInTime({
      id: pitId
    }).catch(err => {
      cspContext.logger.warn(`Could not close PIT for stats endpoint: ${err}`);
    });
    const clusters = getClustersTrends(clustersWithoutTrends, trends);
    const trend = getSummaryTrend(trends);
    const body = {
      stats,
      groupedFindingsEvaluation,
      clusters,
      trend
    };
    return response.ok({
      body
    });
  } catch (err) {
    const error = (0, _securitysolutionEsUtils.transformError)(err);
    cspContext.logger.error(`Error while fetching CSP stats: ${err}`);
    return response.customError({
      body: {
        message: error.message
      },
      statusCode: error.statusCode
    });
  }
});
exports.defineGetComplianceDashboardRoute = defineGetComplianceDashboardRoute;