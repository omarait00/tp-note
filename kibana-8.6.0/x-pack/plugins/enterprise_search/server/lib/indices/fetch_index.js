"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchIndex = void 0;
var _constants = require("../../../common/constants");
var _fetch_connectors = require("../connectors/fetch_connectors");
var _fetch_crawlers = require("../crawler/fetch_crawlers");
var _map_index_stats = require("./utils/map_index_stats");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const fetchIndex = async (client, index) => {
  const indexDataResult = await client.asCurrentUser.indices.get({
    index
  });
  const indexData = indexDataResult[index];
  const {
    indices
  } = await client.asCurrentUser.indices.stats({
    index
  });
  const {
    count
  } = await client.asCurrentUser.count({
    index
  });
  if (!indices || !indices[index] || !indexData) {
    throw new Error('404');
  }
  const indexStats = indices[index];
  const indexResult = {
    count,
    ...(0, _map_index_stats.mapIndexStats)(indexData, indexStats, index)
  };
  const connector = await (0, _fetch_connectors.fetchConnectorByIndexName)(client, index);
  if (connector && connector.service_type !== _constants.ENTERPRISE_SEARCH_CONNECTOR_CRAWLER_SERVICE_TYPE) {
    return {
      ...indexResult,
      connector
    };
  }
  const crawler = await (0, _fetch_crawlers.fetchCrawlerByIndexName)(client, index);
  if (crawler) {
    return {
      ...indexResult,
      connector,
      crawler
    };
  }
  return indexResult;
};
exports.fetchIndex = fetchIndex;