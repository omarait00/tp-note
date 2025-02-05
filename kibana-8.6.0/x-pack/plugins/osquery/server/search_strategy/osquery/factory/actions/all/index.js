"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.allActions = void 0;
var _constants = require("../../../../../../common/constants");
var _build_query = require("../../../../../../common/utils/build_query");
var _queryAll_actions = require("./query.all_actions.dsl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const allActions = {
  buildDsl: options => {
    if (options.pagination && options.pagination.querySize >= _constants.DEFAULT_MAX_TABLE_QUERY_SIZE) {
      throw new Error(`No query size above ${_constants.DEFAULT_MAX_TABLE_QUERY_SIZE}`);
    }
    return (0, _queryAll_actions.buildActionsQuery)(options);
  },
  parse: async (options, response) => {
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryAll_actions.buildActionsQuery)(options))]
    };
    return {
      ...response,
      inspect,
      edges: response.rawResponse.hits.hits
    };
  }
};
exports.allActions = allActions;