"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchMostRecentCrawlerRequestByConfigurationId = exports.fetchCrawlers = exports.fetchCrawlerByIndexName = void 0;
var _fetch_all = require("../fetch_all");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const CRAWLER_CONFIGURATIONS_INDEX = '.ent-search-actastic-crawler2_configurations_v2';
const CRAWLER_CRAWL_REQUESTS_INDEX = '.ent-search-actastic-crawler2_crawl_requests_v2';
const fetchMostRecentCrawlerRequestByConfigurationId = async (client, configurationId) => {
  try {
    var _crawlRequestResult$h;
    const crawlRequestResult = await client.asCurrentUser.search({
      index: CRAWLER_CRAWL_REQUESTS_INDEX,
      query: {
        term: {
          configuration_oid: configurationId
        }
      },
      sort: 'created_at:desc'
    });
    const result = (_crawlRequestResult$h = crawlRequestResult.hits.hits[0]) === null || _crawlRequestResult$h === void 0 ? void 0 : _crawlRequestResult$h._source;
    return result;
  } catch (error) {
    return undefined;
  }
};
exports.fetchMostRecentCrawlerRequestByConfigurationId = fetchMostRecentCrawlerRequestByConfigurationId;
const fetchCrawlerByIndexName = async (client, indexName) => {
  let crawler;
  try {
    var _crawlerResult$hits$h;
    const crawlerResult = await client.asCurrentUser.search({
      index: CRAWLER_CONFIGURATIONS_INDEX,
      query: {
        term: {
          index_name: indexName
        }
      }
    });
    crawler = (_crawlerResult$hits$h = crawlerResult.hits.hits[0]) === null || _crawlerResult$hits$h === void 0 ? void 0 : _crawlerResult$hits$h._source;
  } catch (error) {
    return undefined;
  }
  if (crawler) {
    try {
      const mostRecentCrawlRequest = await fetchMostRecentCrawlerRequestByConfigurationId(client, crawler.id);
      return {
        ...crawler,
        most_recent_crawl_request_status: mostRecentCrawlRequest === null || mostRecentCrawlRequest === void 0 ? void 0 : mostRecentCrawlRequest.status
      };
    } catch (error) {
      return crawler;
    }
  }
  return undefined;
};
exports.fetchCrawlerByIndexName = fetchCrawlerByIndexName;
const fetchCrawlers = async (client, indexNames) => {
  const query = indexNames ? {
    terms: {
      index_name: indexNames
    }
  } : {
    match_all: {}
  };
  let crawlers;
  try {
    crawlers = await (0, _fetch_all.fetchAll)(client, CRAWLER_CONFIGURATIONS_INDEX, query);
  } catch (error) {
    return [];
  }
  try {
    // TODO replace this with an aggregation query
    const crawlersWithStatuses = await Promise.all(crawlers.map(async crawler => {
      const mostRecentCrawlRequest = await fetchMostRecentCrawlerRequestByConfigurationId(client, crawler.id);
      return {
        ...crawler,
        most_recent_crawl_request_status: mostRecentCrawlRequest === null || mostRecentCrawlRequest === void 0 ? void 0 : mostRecentCrawlRequest.status
      };
    }));
    return crawlersWithStatuses;
  } catch (error) {
    return crawlers;
  }
};
exports.fetchCrawlers = fetchCrawlers;