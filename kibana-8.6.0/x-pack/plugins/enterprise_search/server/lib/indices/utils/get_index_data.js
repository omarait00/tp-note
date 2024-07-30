"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIndexDataMapper = exports.getIndexData = void 0;
var _map_index_stats = require("./map_index_stats");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getIndexData = async (client, indexPattern, expandWildcards, returnHiddenIndices, includeAliases, alwaysShowPattern) => {
  const totalIndices = await client.asCurrentUser.indices.get({
    expand_wildcards: expandWildcards,
    // for better performance only compute aliases and settings of indices but not mappings
    features: ['aliases', 'settings'],
    // only get specified index properties from ES to keep the response under 536MB
    // node.js string length limit: https://github.com/nodejs/node/issues/33960
    filter_path: ['*.aliases', '*.settings.index.hidden'],
    index: indexPattern
  });

  // Index names that with one of their aliases match with the alwaysShowPattern
  const alwaysShowPatternMatches = new Set();
  const indexAndAliasNames = Object.keys(totalIndices).reduce((accum, indexName) => {
    accum.push(indexName);
    if (includeAliases) {
      const aliases = Object.keys(totalIndices[indexName].aliases);
      aliases.forEach(alias => {
        accum.push(alias);

        // Add indexName to the set if an alias matches the pattern
        if (alwaysShowPattern !== null && alwaysShowPattern !== void 0 && alwaysShowPattern.alias_pattern && alias.startsWith(alwaysShowPattern === null || alwaysShowPattern === void 0 ? void 0 : alwaysShowPattern.alias_pattern)) {
          alwaysShowPatternMatches.add(indexName);
        }
      });
    }
    return accum;
  }, []);
  const indicesNames = returnHiddenIndices ? Object.keys(totalIndices) : Object.keys(totalIndices).filter(indexName => {
    var _totalIndices$indexNa, _totalIndices$indexNa2, _totalIndices$indexNa3;
    return !(((_totalIndices$indexNa = totalIndices[indexName]) === null || _totalIndices$indexNa === void 0 ? void 0 : (_totalIndices$indexNa2 = _totalIndices$indexNa.settings) === null || _totalIndices$indexNa2 === void 0 ? void 0 : (_totalIndices$indexNa3 = _totalIndices$indexNa2.index) === null || _totalIndices$indexNa3 === void 0 ? void 0 : _totalIndices$indexNa3.hidden) === 'true') || (alwaysShowPattern === null || alwaysShowPattern === void 0 ? void 0 : alwaysShowPattern.index_pattern) && indexName.startsWith(alwaysShowPattern.index_pattern);
  });
  return {
    allIndexMatches: totalIndices,
    alwaysShowMatchNames: Array.from(alwaysShowPatternMatches),
    expandWildcards,
    indexAndAliasNames,
    indicesNames
  };
};
exports.getIndexData = getIndexData;
const getIndexDataMapper = totalIndexData => {
  return indexName => (0, _map_index_stats.mapIndexStats)(totalIndexData.allIndexMatches[indexName], totalIndexData.indicesStats[indexName], indexName);
};
exports.getIndexDataMapper = getIndexDataMapper;