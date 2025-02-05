"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApmDiskSpacedUsedPct = getApmDiskSpacedUsedPct;
exports.getApmIndicesCombined = getApmIndicesCombined;
exports.getEstimatedSizeForDocumentsInIndex = getEstimatedSizeForDocumentsInIndex;
exports.getIndicesInfo = getIndicesInfo;
exports.getIndicesLifecycleStatus = getIndicesLifecycleStatus;
exports.getTotalIndicesStats = getTotalIndicesStats;
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getTotalIndicesStats({
  context,
  apmEventClient
}) {
  const index = getApmIndicesCombined(apmEventClient);
  const esClient = (await context.core).elasticsearch.client;
  const totalStats = await esClient.asCurrentUser.indices.stats({
    index
  });
  return totalStats;
}
function getEstimatedSizeForDocumentsInIndex({
  allIndicesStats,
  indexName,
  numberOfDocs
}) {
  var _indexStats$total$sto, _indexStats$total, _indexStats$total$sto2, _indexStats$total2, _indexStats$total2$do;
  const indexStats = allIndicesStats[indexName];
  const indexTotalSize = (_indexStats$total$sto = indexStats === null || indexStats === void 0 ? void 0 : (_indexStats$total = indexStats.total) === null || _indexStats$total === void 0 ? void 0 : (_indexStats$total$sto2 = _indexStats$total.store) === null || _indexStats$total$sto2 === void 0 ? void 0 : _indexStats$total$sto2.size_in_bytes) !== null && _indexStats$total$sto !== void 0 ? _indexStats$total$sto : 0;
  const indexTotalDocCount = indexStats === null || indexStats === void 0 ? void 0 : (_indexStats$total2 = indexStats.total) === null || _indexStats$total2 === void 0 ? void 0 : (_indexStats$total2$do = _indexStats$total2.docs) === null || _indexStats$total2$do === void 0 ? void 0 : _indexStats$total2$do.count;
  const estimatedSize = indexTotalDocCount ? numberOfDocs / indexTotalDocCount * indexTotalSize : 0;
  return estimatedSize;
}
async function getApmDiskSpacedUsedPct(context) {
  const esClient = (await context.core).elasticsearch.client;
  const {
    nodes: diskSpacePerNode
  } = await esClient.asCurrentUser.nodes.stats({
    metric: 'fs',
    filter_path: 'nodes.*.fs.total.total_in_bytes'
  });
  const totalDiskSpace = (0, _lodash.sumBy)((0, _lodash.values)(diskSpacePerNode), node => {
    var _node$fs$total$total_, _node$fs, _node$fs$total;
    return (_node$fs$total$total_ = node === null || node === void 0 ? void 0 : (_node$fs = node.fs) === null || _node$fs === void 0 ? void 0 : (_node$fs$total = _node$fs.total) === null || _node$fs$total === void 0 ? void 0 : _node$fs$total.total_in_bytes) !== null && _node$fs$total$total_ !== void 0 ? _node$fs$total$total_ : 0;
  });
  return totalDiskSpace;
}
async function getIndicesLifecycleStatus({
  context,
  apmEventClient
}) {
  const index = getApmIndicesCombined(apmEventClient);
  const esClient = (await context.core).elasticsearch.client;
  const {
    indices
  } = await esClient.asCurrentUser.ilm.explainLifecycle({
    index,
    filter_path: 'indices.*.phase'
  });
  return indices;
}
async function getIndicesInfo({
  context,
  apmEventClient
}) {
  const index = getApmIndicesCombined(apmEventClient);
  const esClient = (await context.core).elasticsearch.client;
  const indicesInfo = await esClient.asCurrentUser.indices.get({
    index,
    filter_path: ['*.settings.index.number_of_shards', '*.settings.index.number_of_replicas', '*.data_stream'],
    features: ['settings']
  });
  return indicesInfo;
}
function getApmIndicesCombined(apmEventClient) {
  const {
    indices: {
      transaction,
      span,
      metric,
      error
    }
  } = apmEventClient;
  return (0, _lodash.uniq)([transaction, span, metric, error]).join();
}