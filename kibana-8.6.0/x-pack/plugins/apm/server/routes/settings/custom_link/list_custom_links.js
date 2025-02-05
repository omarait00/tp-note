"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listCustomLinks = listCustomLinks;
var _helper = require("./helper");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function listCustomLinks({
  internalESClient,
  filters = {}
}) {
  const esFilters = Object.entries(filters).map(([key, value]) => {
    return {
      bool: {
        minimum_should_match: 1,
        should: [{
          term: {
            [key]: value
          }
        }, {
          bool: {
            must_not: [{
              exists: {
                field: key
              }
            }]
          }
        }]
      }
    };
  });
  const params = {
    index: internalESClient.apmIndices.apmCustomLinkIndex,
    size: 500,
    body: {
      query: {
        bool: {
          filter: esFilters
        }
      },
      sort: [{
        'label.keyword': {
          order: 'asc'
        }
      }]
    }
  };
  const resp = await internalESClient.search('list_custom_links', params);
  const customLinks = resp.hits.hits.map(item => (0, _helper.fromESFormat)({
    id: item._id,
    ...item._source
  }));
  return customLinks;
}