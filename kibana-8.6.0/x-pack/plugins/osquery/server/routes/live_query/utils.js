"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActionResponses = void 0;
var _rxjs = require("rxjs");
var _operators = require("rxjs/operators");
var _build_query = require("../../../common/utils/build_query");
var _search_strategy = require("../../../common/search_strategy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getActionResponses = (search, actionId, agentsCount) => search.search({
  actionId,
  factoryQueryType: _search_strategy.OsqueryQueries.actionResults,
  filterQuery: '',
  pagination: (0, _build_query.generateTablePaginationOptions)(0, 1000),
  sort: {
    direction: _search_strategy.Direction.desc,
    field: '@timestamp'
  }
}, {
  strategy: 'osquerySearchStrategy'
}).pipe((0, _operators.mergeMap)(val => {
  var _val$rawResponse$aggr, _val$rawResponse, _val$rawResponse$aggr2, _val$rawResponse$aggr3, _val$rawResponse$aggr4, _val$rawResponse2, _val$rawResponse2$agg, _val$rawResponse2$agg2, _val$rawResponse2$agg3, _val$rawResponse3, _val$rawResponse3$agg, _val$rawResponse3$agg2, _aggsBuckets$find$doc, _aggsBuckets$find, _aggsBuckets$find$doc2, _aggsBuckets$find2;
  const responded = (_val$rawResponse$aggr = (_val$rawResponse = val.rawResponse) === null || _val$rawResponse === void 0 ? void 0 : (_val$rawResponse$aggr2 = _val$rawResponse.aggregations) === null || _val$rawResponse$aggr2 === void 0 ? void 0 : (_val$rawResponse$aggr3 = _val$rawResponse$aggr2.aggs.responses_by_action_id) === null || _val$rawResponse$aggr3 === void 0 ? void 0 : _val$rawResponse$aggr3.doc_count) !== null && _val$rawResponse$aggr !== void 0 ? _val$rawResponse$aggr : 0;
  const docs = (_val$rawResponse$aggr4 = (_val$rawResponse2 = val.rawResponse) === null || _val$rawResponse2 === void 0 ? void 0 : (_val$rawResponse2$agg = _val$rawResponse2.aggregations) === null || _val$rawResponse2$agg === void 0 ? void 0 : (_val$rawResponse2$agg2 = _val$rawResponse2$agg.aggs.responses_by_action_id) === null || _val$rawResponse2$agg2 === void 0 ? void 0 : (_val$rawResponse2$agg3 = _val$rawResponse2$agg2.rows_count) === null || _val$rawResponse2$agg3 === void 0 ? void 0 : _val$rawResponse2$agg3.value) !== null && _val$rawResponse$aggr4 !== void 0 ? _val$rawResponse$aggr4 : 0;
  const aggsBuckets = (_val$rawResponse3 = val.rawResponse) === null || _val$rawResponse3 === void 0 ? void 0 : (_val$rawResponse3$agg = _val$rawResponse3.aggregations) === null || _val$rawResponse3$agg === void 0 ? void 0 : (_val$rawResponse3$agg2 = _val$rawResponse3$agg.aggs.responses_by_action_id) === null || _val$rawResponse3$agg2 === void 0 ? void 0 : _val$rawResponse3$agg2.responses.buckets;
  const successful = (_aggsBuckets$find$doc = aggsBuckets === null || aggsBuckets === void 0 ? void 0 : (_aggsBuckets$find = aggsBuckets.find(bucket => bucket.key === 'success')) === null || _aggsBuckets$find === void 0 ? void 0 : _aggsBuckets$find.doc_count) !== null && _aggsBuckets$find$doc !== void 0 ? _aggsBuckets$find$doc : 0;
  const failed = (_aggsBuckets$find$doc2 = aggsBuckets === null || aggsBuckets === void 0 ? void 0 : (_aggsBuckets$find2 = aggsBuckets.find(bucket => bucket.key === 'error')) === null || _aggsBuckets$find2 === void 0 ? void 0 : _aggsBuckets$find2.doc_count) !== null && _aggsBuckets$find$doc2 !== void 0 ? _aggsBuckets$find$doc2 : 0;
  const pending = agentsCount - responded;
  return (0, _rxjs.of)({
    action_id: actionId,
    docs,
    failed,
    pending,
    responded,
    successful
  });
}));
exports.getActionResponses = getActionResponses;