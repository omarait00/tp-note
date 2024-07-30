"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.textBasedQueryStateToExpressionAst = textBasedQueryStateToExpressionAst;
var _esQuery = require("@kbn/es-query");
var _common = require("../../../expressions/common");
var _ = require("..");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Converts QueryState to expression AST
 * @param filters array of kibana filters
 * @param query kibana query or aggregate query
 * @param time kibana time range
 */
function textBasedQueryStateToExpressionAst({
  filters,
  query,
  inputQuery,
  time,
  timeFieldName
}) {
  const kibana = (0, _common.buildExpressionFunction)('kibana', {});
  let q;
  if (inputQuery) {
    q = inputQuery;
  }
  const kibanaContext = (0, _common.buildExpressionFunction)('kibana_context', {
    q: q && (0, _.queryToAst)(q),
    timeRange: time && (0, _.timerangeToAst)(time),
    filters: filters && (0, _.filtersToAst)(filters)
  });
  const ast = (0, _common.buildExpression)([kibana, kibanaContext]).toAst();
  if (query && (0, _esQuery.isOfAggregateQueryType)(query)) {
    const mode = (0, _esQuery.getAggregateQueryMode)(query);
    // sql query
    if (mode === 'sql' && 'sql' in query) {
      const essql = (0, _.aggregateQueryToAst)(query, timeFieldName);
      if (essql) {
        ast.chain.push(essql);
      }
    }
  }
  return ast;
}