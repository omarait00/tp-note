"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrateMatchAllQuery = void 0;
var _lodash = require("lodash");
var _common = require("../../../../data/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * This migration script is related to:
 *   @link https://github.com/elastic/kibana/pull/62194
 *   @link https://github.com/elastic/kibana/pull/14644
 * This is only a problem when you import an object from 5.x into 6.x but to be sure that all saved objects migrated we should execute it twice in 6.7.2 and 7.9.3
 */
const migrateMatchAllQuery = doc => {
  const searchSourceJSON = (0, _lodash.get)(doc, 'attributes.kibanaSavedObjectMeta.searchSourceJSON');
  if (searchSourceJSON) {
    var _searchSource$query;
    let searchSource;
    try {
      searchSource = JSON.parse(searchSourceJSON);
    } catch (e) {
      // Let it go, the data is invalid and we'll leave it as is
      return doc;
    }
    if ((_searchSource$query = searchSource.query) !== null && _searchSource$query !== void 0 && _searchSource$query.match_all) {
      return {
        ...doc,
        attributes: {
          ...doc.attributes,
          kibanaSavedObjectMeta: {
            searchSourceJSON: JSON.stringify({
              ...searchSource,
              query: {
                query: '',
                language: _common.DEFAULT_QUERY_LANGUAGE
              }
            })
          }
        }
      };
    }
  }
  return doc;
};
exports.migrateMatchAllQuery = migrateMatchAllQuery;