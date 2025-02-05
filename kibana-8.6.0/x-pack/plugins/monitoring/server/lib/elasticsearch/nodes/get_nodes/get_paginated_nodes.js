"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPaginatedNodes = getPaginatedNodes;
var _lodash = require("lodash");
var _get_node_ids = require("./get_node_ids");
var _filter = require("../../../pagination/filter");
var _sort_nodes = require("./sort_nodes");
var _paginate = require("../../../pagination/paginate");
var _get_metrics = require("../../../details/get_metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// @ts-ignore

// @ts-ignore

async function getPaginatedNodes(req, {
  clusterUuid
}, metricSet, pagination, sort, queryText, {
  clusterStats,
  nodesShardCount
}) {
  var _ref, _clusterStats$cluster, _clusterStats$cluster2, _clusterStats$elastic, _clusterStats$elastic2, _clusterStats$elastic3, _clusterStats$elastic4;
  const config = req.server.config;
  const size = config.ui.max_bucket_size;
  const nodes = await (0, _get_node_ids.getNodeIds)(req, {
    clusterUuid
  }, size);

  // Add `isOnline` and shards from the cluster state and shard stats
  const clusterStateNodes = (_ref = (_clusterStats$cluster = clusterStats === null || clusterStats === void 0 ? void 0 : (_clusterStats$cluster2 = clusterStats.cluster_state) === null || _clusterStats$cluster2 === void 0 ? void 0 : _clusterStats$cluster2.nodes) !== null && _clusterStats$cluster !== void 0 ? _clusterStats$cluster : clusterStats === null || clusterStats === void 0 ? void 0 : (_clusterStats$elastic = clusterStats.elasticsearch) === null || _clusterStats$elastic === void 0 ? void 0 : (_clusterStats$elastic2 = _clusterStats$elastic.cluster) === null || _clusterStats$elastic2 === void 0 ? void 0 : (_clusterStats$elastic3 = _clusterStats$elastic2.stats) === null || _clusterStats$elastic3 === void 0 ? void 0 : (_clusterStats$elastic4 = _clusterStats$elastic3.state) === null || _clusterStats$elastic4 === void 0 ? void 0 : _clusterStats$elastic4.nodes) !== null && _ref !== void 0 ? _ref : {};
  const nodesWithStatus = nodes.map(node => {
    var _nodesShardCount$node, _nodesShardCount$node2;
    return {
      ...node,
      isOnline: !(0, _lodash.isUndefined)(clusterStateNodes && clusterStateNodes[node.uuid]),
      shardCount: (_nodesShardCount$node = nodesShardCount === null || nodesShardCount === void 0 ? void 0 : (_nodesShardCount$node2 = nodesShardCount.nodes[node.uuid]) === null || _nodesShardCount$node2 === void 0 ? void 0 : _nodesShardCount$node2.shardCount) !== null && _nodesShardCount$node !== void 0 ? _nodesShardCount$node : 0
    };
  });

  // `metricSet` defines a list of metrics that are sortable in the UI
  // but we don't need to fetch all the data for these metrics to perform
  // the necessary sort - we only need the last bucket of data so we
  // fetch the last two buckets of data (to ensure we have a single full bucekt),
  // then return the value from that last bucket
  const filters = [{
    terms: {
      'source_node.name': nodesWithStatus.map(node => node.name)
    }
  }];
  const groupBy = {
    field: `source_node.uuid`,
    include: nodesWithStatus.map(node => node.uuid),
    size
  };
  const metricSeriesData = await (0, _get_metrics.getMetrics)(req, 'elasticsearch', metricSet, filters, {
    nodes: nodesWithStatus
  }, 4, groupBy);
  for (const metricName in metricSeriesData) {
    if (!metricSeriesData.hasOwnProperty(metricName)) {
      continue;
    }
    const metricList = metricSeriesData[metricName];
    for (const metricItem of metricList[0]) {
      const node = nodesWithStatus.find(n => n.uuid === metricItem.groupedBy);
      if (!node) {
        continue;
      }
      const dataSeries = metricItem.data;
      if (dataSeries && dataSeries.length) {
        const lastItem = dataSeries[dataSeries.length - 1];
        if (lastItem.length && lastItem.length === 2) {
          Reflect.set(node, metricName, lastItem[1]);
        }
      }
    }
  }

  // Manually apply pagination/sorting/filtering concerns

  // Filtering
  const filteredNodes = (0, _filter.filter)(nodesWithStatus, queryText, ['name']); // We only support filtering by name right now

  // Sorting
  const sortedNodes = (0, _sort_nodes.sortNodes)(filteredNodes, sort);

  // Pagination
  const pageOfNodes = (0, _paginate.paginate)(pagination, sortedNodes);
  return {
    pageOfNodes,
    totalNodeCount: filteredNodes.length
  };
}