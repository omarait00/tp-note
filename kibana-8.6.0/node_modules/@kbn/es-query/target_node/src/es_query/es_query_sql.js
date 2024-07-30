"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAggregateQueryMode = getAggregateQueryMode;
exports.getIndexPatternFromSQLQuery = getIndexPatternFromSQLQuery;
exports.isOfAggregateQueryType = isOfAggregateQueryType;
exports.isOfQueryType = isOfQueryType;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

// Checks if the query is of type Query
function isOfQueryType(arg) {
  return Boolean(arg && 'query' in arg);
}

// Checks if the query is of type AggregateQuery
// currently only supports the sql query type
// should be enhanced to support other query types
function isOfAggregateQueryType(query) {
  return Boolean(query && ('sql' in query || 'esql' in query));
}

// returns the language of the aggregate Query, sql, esql etc
function getAggregateQueryMode(query) {
  return Object.keys(query)[0];
}

// retrieves the index pattern from the aggregate query
function getIndexPatternFromSQLQuery(sqlQuery) {
  var _sql, _splitFroms$length, _sql2;
  let sql = sqlQuery === null || sqlQuery === void 0 ? void 0 : sqlQuery.replaceAll('"', '').replaceAll("'", '');
  const splitFroms = (_sql = sql) === null || _sql === void 0 ? void 0 : _sql.split(new RegExp(/FROM\s/, 'ig'));
  const fromsLength = (_splitFroms$length = splitFroms === null || splitFroms === void 0 ? void 0 : splitFroms.length) !== null && _splitFroms$length !== void 0 ? _splitFroms$length : 0;
  if (splitFroms && (splitFroms === null || splitFroms === void 0 ? void 0 : splitFroms.length) > 2) {
    sql = `${splitFroms[fromsLength - 2]} FROM ${splitFroms[fromsLength - 1]}`;
  }
  // case insensitive match for the index pattern
  const regex = new RegExp(/FROM\s+([\w*-.!@$^()~;]+)/, 'i');
  const matches = (_sql2 = sql) === null || _sql2 === void 0 ? void 0 : _sql2.match(regex);
  if (matches) {
    return matches[1];
  }
  return '';
}