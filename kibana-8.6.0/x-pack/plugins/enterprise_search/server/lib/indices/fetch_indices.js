"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchIndices = void 0;
var _fetch_index_counts = require("./fetch_index_counts");
var _fetch_index_privileges = require("./fetch_index_privileges");
var _fetch_index_stats = require("./fetch_index_stats");
var _extract_always_show_indices = require("./utils/extract_always_show_indices");
var _get_index_data = require("./utils/get_index_data");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const fetchIndices = async (client, indexPattern, returnHiddenIndices, includeAliases, alwaysShowPattern) => {
  // This call retrieves alias and settings information about indices
  // If we provide an override pattern with alwaysShowPattern we get everything and filter out hiddens.
  const expandWildcards = returnHiddenIndices || alwaysShowPattern !== null && alwaysShowPattern !== void 0 && alwaysShowPattern.alias_pattern || alwaysShowPattern !== null && alwaysShowPattern !== void 0 && alwaysShowPattern.index_pattern ? ['hidden', 'all'] : ['open'];
  const {
    allIndexMatches,
    indexAndAliasNames,
    indicesNames,
    alwaysShowMatchNames
  } = await (0, _get_index_data.getIndexData)(client, indexPattern, expandWildcards, returnHiddenIndices, includeAliases, alwaysShowPattern);
  if (indicesNames.length === 0) {
    return [];
  }
  const indicesStats = await (0, _fetch_index_stats.fetchIndexStats)(client, indexPattern, expandWildcards);
  const indexPrivileges = await (0, _fetch_index_privileges.fetchIndexPrivileges)(client, indexAndAliasNames);
  const indexCounts = await (0, _fetch_index_counts.fetchIndexCounts)(client, indexAndAliasNames);
  const totalIndexData = {
    allIndexMatches,
    indexCounts,
    indexPrivileges,
    indicesStats
  };
  const regularIndexData = indicesNames.map((0, _get_index_data.getIndexDataMapper)(totalIndexData)).flatMap(({
    name,
    aliases,
    ...indexData
  }) => {
    var _indexCounts$name;
    // expand aliases and add to results

    const indexEntry = {
      ...indexData,
      alias: false,
      count: (_indexCounts$name = indexCounts[name]) !== null && _indexCounts$name !== void 0 ? _indexCounts$name : 0,
      name,
      privileges: {
        manage: false,
        read: false,
        ...indexPrivileges[name]
      }
    };
    return includeAliases ? [indexEntry, ...(0, _extract_always_show_indices.expandAliases)(name, aliases, indexData, totalIndexData, ...(name.startsWith('.ent-search-engine-documents') ? [alwaysShowPattern] : []))] : [indexEntry];
  });
  let indicesData = regularIndexData;
  if (alwaysShowPattern !== null && alwaysShowPattern !== void 0 && alwaysShowPattern.alias_pattern && includeAliases) {
    const indexNamesAlreadyIncluded = regularIndexData.map(({
      name
    }) => name);
    const itemsToInclude = (0, _extract_always_show_indices.getAlwaysShowAliases)(indexNamesAlreadyIncluded, alwaysShowMatchNames).map((0, _get_index_data.getIndexDataMapper)(totalIndexData)).flatMap(({
      name,
      aliases,
      ...indexData
    }) => {
      return (0, _extract_always_show_indices.expandAliases)(name, aliases, indexData, totalIndexData, alwaysShowPattern);
    });
    indicesData = [...indicesData, ...itemsToInclude];
  }
  return indicesData.filter(({
    name
  }, index, array) =>
  // make list of aliases unique since we add an alias per index above
  // and aliases can point to multiple indices
  array.findIndex(engineData => engineData.name === name) === index);
};
exports.fetchIndices = fetchIndices;