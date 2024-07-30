"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchSearchResults = void 0;
var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const fetchSearchResults = async (client, indexName, query, from = 0, size = _constants.ENTERPRISE_SEARCH_DOCUMENTS_DEFAULT_DOC_COUNT) => {
  const results = await client.asCurrentUser.search({
    from,
    index: indexName,
    size,
    ...(!!query ? {
      q: JSON.stringify(query)
    } : {})
  });
  return results;
};
exports.fetchSearchResults = fetchSearchResults;