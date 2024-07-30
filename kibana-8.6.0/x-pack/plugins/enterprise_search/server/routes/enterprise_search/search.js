"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSearchRoute = registerSearchRoute;
var _configSchema = require("@kbn/config-schema");
var _constants = require("../../../common/constants");
var _fetch_search_results = require("../../lib/fetch_search_results");
var _elasticsearch_error_handler = require("../../utils/elasticsearch_error_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const calculateMeta = (searchResults, page, size) => {
  let totalResults = 0;
  if (searchResults.hits.total === null || searchResults.hits.total === undefined) {
    totalResults = 0;
  } else if (typeof searchResults.hits.total === 'number') {
    totalResults = searchResults.hits.total;
  } else {
    totalResults = searchResults.hits.total.value;
  }
  const totalPages = Math.ceil(totalResults / size) || 1;
  return {
    page: {
      current: page,
      size: searchResults.hits.hits.length,
      total_pages: Number.isFinite(totalPages) && totalPages || 1,
      total_results: totalResults
    }
  };
};
function registerSearchRoute({
  router,
  log
}) {
  router.post({
    path: '/internal/enterprise_search/indices/{index_name}/search',
    validate: {
      body: _configSchema.schema.object({
        searchQuery: _configSchema.schema.string({
          defaultValue: ''
        })
      }),
      params: _configSchema.schema.object({
        index_name: _configSchema.schema.string()
      }),
      query: _configSchema.schema.object({
        page: _configSchema.schema.number({
          defaultValue: 0,
          min: 0
        }),
        size: _configSchema.schema.number({
          defaultValue: _constants.ENTERPRISE_SEARCH_DOCUMENTS_DEFAULT_DOC_COUNT,
          min: 0
        })
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const indexName = decodeURIComponent(request.params.index_name);
    const searchQuery = request.body.searchQuery;
    const {
      client
    } = (await context.core).elasticsearch;
    const {
      page = 0,
      size = _constants.ENTERPRISE_SEARCH_DOCUMENTS_DEFAULT_DOC_COUNT
    } = request.query;
    const from = page * size;
    const searchResults = await (0, _fetch_search_results.fetchSearchResults)(client, indexName, searchQuery, from, size);
    return response.ok({
      body: {
        meta: calculateMeta(searchResults, page, size),
        results: searchResults
      },
      headers: {
        'content-type': 'application/json'
      }
    });
  }));
}