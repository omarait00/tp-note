"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchIndices = void 0;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function fetchIndicesCall(client, indexNames) {
  const indexNamesString = indexNames && indexNames.length ? indexNames.join(',') : '*';

  // This call retrieves alias and settings (incl. hidden status) information about indices
  const indices = await client.asCurrentUser.indices.get({
    index: indexNamesString,
    expand_wildcards: ['hidden', 'all'],
    // only get specified index properties from ES to keep the response under 536MB
    // node.js string length limit: https://github.com/nodejs/node/issues/33960
    filter_path: ['*.aliases', '*.settings.index.number_of_shards', '*.settings.index.number_of_replicas', '*.settings.index.frozen', '*.settings.index.hidden', '*.data_stream'],
    // for better performance only compute aliases and settings of indices but not mappings
    features: ['aliases', 'settings']
  });
  if (!Object.keys(indices).length) {
    return [];
  }
  const {
    indices: indicesStats = {}
  } = await client.asCurrentUser.indices.stats({
    index: indexNamesString,
    expand_wildcards: ['hidden', 'all'],
    forbid_closed_indices: false,
    metric: ['docs', 'store']
  });
  const indicesNames = Object.keys(indices);
  return indicesNames.map(indexName => {
    var _indexData$settings, _indexData$settings$i, _indexData$settings2, _indexData$settings2$, _indexStats$primaries, _indexStats$primaries2, _indexStats$primaries3, _indexStats$primaries4, _indexStats$primaries5, _indexStats$primaries6, _indexStats$total$sto, _indexStats$total, _indexStats$total$sto2, _indexStats$primaries7, _indexStats$primaries8, _indexStats$primaries9, _indexData$settings3, _indexData$settings3$, _indexData$settings4, _indexData$settings4$;
    const indexData = indices[indexName];
    const indexStats = indicesStats[indexName];
    const aliases = Object.keys(indexData.aliases);
    return {
      health: indexStats === null || indexStats === void 0 ? void 0 : indexStats.health,
      status: indexStats === null || indexStats === void 0 ? void 0 : indexStats.status,
      name: indexName,
      uuid: indexStats === null || indexStats === void 0 ? void 0 : indexStats.uuid,
      primary: (_indexData$settings = indexData.settings) === null || _indexData$settings === void 0 ? void 0 : (_indexData$settings$i = _indexData$settings.index) === null || _indexData$settings$i === void 0 ? void 0 : _indexData$settings$i.number_of_shards,
      replica: (_indexData$settings2 = indexData.settings) === null || _indexData$settings2 === void 0 ? void 0 : (_indexData$settings2$ = _indexData$settings2.index) === null || _indexData$settings2$ === void 0 ? void 0 : _indexData$settings2$.number_of_replicas,
      documents: (_indexStats$primaries = indexStats === null || indexStats === void 0 ? void 0 : (_indexStats$primaries2 = indexStats.primaries) === null || _indexStats$primaries2 === void 0 ? void 0 : (_indexStats$primaries3 = _indexStats$primaries2.docs) === null || _indexStats$primaries3 === void 0 ? void 0 : _indexStats$primaries3.count) !== null && _indexStats$primaries !== void 0 ? _indexStats$primaries : 0,
      documents_deleted: (_indexStats$primaries4 = indexStats === null || indexStats === void 0 ? void 0 : (_indexStats$primaries5 = indexStats.primaries) === null || _indexStats$primaries5 === void 0 ? void 0 : (_indexStats$primaries6 = _indexStats$primaries5.docs) === null || _indexStats$primaries6 === void 0 ? void 0 : _indexStats$primaries6.deleted) !== null && _indexStats$primaries4 !== void 0 ? _indexStats$primaries4 : 0,
      size: new _configSchema.ByteSizeValue((_indexStats$total$sto = indexStats === null || indexStats === void 0 ? void 0 : (_indexStats$total = indexStats.total) === null || _indexStats$total === void 0 ? void 0 : (_indexStats$total$sto2 = _indexStats$total.store) === null || _indexStats$total$sto2 === void 0 ? void 0 : _indexStats$total$sto2.size_in_bytes) !== null && _indexStats$total$sto !== void 0 ? _indexStats$total$sto : 0).toString(),
      primary_size: new _configSchema.ByteSizeValue((_indexStats$primaries7 = indexStats === null || indexStats === void 0 ? void 0 : (_indexStats$primaries8 = indexStats.primaries) === null || _indexStats$primaries8 === void 0 ? void 0 : (_indexStats$primaries9 = _indexStats$primaries8.store) === null || _indexStats$primaries9 === void 0 ? void 0 : _indexStats$primaries9.size_in_bytes) !== null && _indexStats$primaries7 !== void 0 ? _indexStats$primaries7 : 0).toString(),
      isFrozen: ((_indexData$settings3 = indexData.settings) === null || _indexData$settings3 === void 0 ? void 0 : (_indexData$settings3$ = _indexData$settings3.index) === null || _indexData$settings3$ === void 0 ? void 0 : _indexData$settings3$.frozen) === 'true',
      aliases: aliases.length ? aliases : 'none',
      hidden: ((_indexData$settings4 = indexData.settings) === null || _indexData$settings4 === void 0 ? void 0 : (_indexData$settings4$ = _indexData$settings4.index) === null || _indexData$settings4$ === void 0 ? void 0 : _indexData$settings4$.hidden) === 'true',
      data_stream: indexData.data_stream
    };
  });
}
const fetchIndices = async (client, indexDataEnricher, indexNames) => {
  const indices = await fetchIndicesCall(client, indexNames);
  return await indexDataEnricher.enrichIndices(indices, client);
};
exports.fetchIndices = fetchIndices;