"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.textBasedQueryStateToAstWithValidation = textBasedQueryStateToAstWithValidation;
var _esQuery = require("@kbn/es-query");
var _text_based_query_state_to_ast = require("./text_based_query_state_to_ast");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const getIndexPatternFromAggregateQuery = query => {
  if ('sql' in query) {
    return (0, _esQuery.getIndexPatternFromSQLQuery)(query.sql);
  }
};

/**
 * Converts QueryState to expression AST
 * @param filters array of kibana filters
 * @param query kibana query or aggregate query
 * @param time kibana time range
 */
async function textBasedQueryStateToAstWithValidation({
  filters,
  query,
  inputQuery,
  time,
  dataViewsService
}) {
  let ast;
  if (query && (0, _esQuery.isOfAggregateQueryType)(query)) {
    // sql query
    const idxPattern = getIndexPatternFromAggregateQuery(query);
    const idsTitles = await dataViewsService.getIdsWithTitle();
    const dataViewIdTitle = idsTitles.find(({
      title
    }) => title === idxPattern);
    if (dataViewIdTitle) {
      const dataView = await dataViewsService.get(dataViewIdTitle.id);
      const timeFieldName = dataView.timeFieldName;
      ast = (0, _text_based_query_state_to_ast.textBasedQueryStateToExpressionAst)({
        filters,
        query,
        inputQuery,
        time,
        timeFieldName
      });
    } else {
      throw new Error(`No data view found for index pattern ${idxPattern}`);
    }
  }
  return ast;
}