"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchAnalyticsCollections = exports.fetchAnalyticsCollectionByName = void 0;
var _ = require("../..");
var _identify_exceptions = require("../../utils/identify_exceptions");
var _fetch_all = require("../fetch_all");
var _setup_indices = require("./setup_indices");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const fetchAnalyticsCollectionByName = async (client, name) => {
  try {
    var _searchResults$hits$h;
    const searchResults = await client.asCurrentUser.search({
      index: _.ANALYTICS_COLLECTIONS_INDEX,
      query: {
        term: {
          name
        }
      }
    });
    const result = (_searchResults$hits$h = searchResults.hits.hits[0]) !== null && _searchResults$hits$h !== void 0 && _searchResults$hits$h._source ? {
      ...searchResults.hits.hits[0]._source,
      id: searchResults.hits.hits[0]._id
    } : undefined;
    return result;
  } catch (error) {
    if ((0, _identify_exceptions.isIndexNotFoundException)(error)) {
      await (0, _setup_indices.setupAnalyticsCollectionIndex)(client.asCurrentUser);
    }
    return undefined;
  }
};
exports.fetchAnalyticsCollectionByName = fetchAnalyticsCollectionByName;
const fetchAnalyticsCollections = async client => {
  const query = {
    match_all: {}
  };
  try {
    return await (0, _fetch_all.fetchAll)(client, _.ANALYTICS_COLLECTIONS_INDEX, query);
  } catch (error) {
    if ((0, _identify_exceptions.isIndexNotFoundException)(error)) {
      await (0, _setup_indices.setupAnalyticsCollectionIndex)(client.asCurrentUser);
      return [];
    }
    throw error;
  }
};
exports.fetchAnalyticsCollections = fetchAnalyticsCollections;