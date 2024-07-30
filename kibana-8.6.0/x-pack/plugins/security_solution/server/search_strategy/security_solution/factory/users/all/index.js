"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.allUsers = void 0;
var _fp = require("lodash/fp");
var _constants = require("../../../../../../common/constants");
var _build_query = require("../../../../../utils/build_query");
var _queryAll_users = require("./query.all_users.dsl");
var _queryRisk_score = require("../../risk_score/all/query.risk_score.dsl");
var _search_strategy = require("../../../../../../common/search_strategy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const allUsers = {
  buildDsl: options => {
    if (options.pagination && options.pagination.querySize >= _constants.DEFAULT_MAX_TABLE_QUERY_SIZE) {
      throw new Error(`No query size above ${_constants.DEFAULT_MAX_TABLE_QUERY_SIZE}`);
    }
    return (0, _queryAll_users.buildUsersQuery)(options);
  },
  parse: async (options, response, deps) => {
    const {
      activePage,
      cursorStart,
      fakePossibleCount,
      querySize
    } = options.pagination;
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryAll_users.buildUsersQuery)(options))]
    };
    const buckets = (0, _fp.getOr)([], 'aggregations.user_data.buckets', response.rawResponse);
    const totalCount = (0, _fp.getOr)(0, 'aggregations.user_count.value', response.rawResponse);
    const fakeTotalCount = fakePossibleCount <= totalCount ? fakePossibleCount : totalCount;
    const users = buckets.map(bucket => ({
      name: bucket.key,
      lastSeen: (0, _fp.getOr)(null, `lastSeen.value_as_string`, bucket),
      domain: (0, _fp.getOr)(null, `domain.hits.hits[0].fields['user.domain']`, bucket)
    }), {});
    const showMorePagesIndicator = totalCount > fakeTotalCount;
    const edges = users.splice(cursorStart, querySize - cursorStart);
    const userNames = edges.map(({
      name
    }) => name);
    const enhancedEdges = deps !== null && deps !== void 0 && deps.spaceId ? await enhanceEdges(edges, userNames, deps.spaceId, deps.esClient) : edges;
    return {
      ...response,
      inspect,
      totalCount,
      users: enhancedEdges,
      pageInfo: {
        activePage: activePage !== null && activePage !== void 0 ? activePage : 0,
        fakeTotalCount,
        showMorePagesIndicator
      }
    };
  }
};
exports.allUsers = allUsers;
async function enhanceEdges(edges, userNames, spaceId, esClient) {
  const userRiskData = await getUserRiskData(esClient, spaceId, userNames);
  const usersRiskByUserName = userRiskData === null || userRiskData === void 0 ? void 0 : userRiskData.hits.hits.reduce((acc, hit) => {
    var _hit$_source$user$nam, _hit$_source, _hit$_source2, _hit$_source2$user, _hit$_source2$user$ri;
    return {
      ...acc,
      [(_hit$_source$user$nam = (_hit$_source = hit._source) === null || _hit$_source === void 0 ? void 0 : _hit$_source.user.name) !== null && _hit$_source$user$nam !== void 0 ? _hit$_source$user$nam : '']: (_hit$_source2 = hit._source) === null || _hit$_source2 === void 0 ? void 0 : (_hit$_source2$user = _hit$_source2.user) === null || _hit$_source2$user === void 0 ? void 0 : (_hit$_source2$user$ri = _hit$_source2$user.risk) === null || _hit$_source2$user$ri === void 0 ? void 0 : _hit$_source2$user$ri.calculated_level
    };
  }, {});
  return usersRiskByUserName ? edges.map(({
    name,
    lastSeen,
    domain
  }) => ({
    name,
    lastSeen,
    domain,
    risk: usersRiskByUserName[name !== null && name !== void 0 ? name : '']
  })) : edges;
}
async function getUserRiskData(esClient, spaceId, userNames) {
  try {
    const userRiskResponse = await esClient.asCurrentUser.search((0, _queryRisk_score.buildRiskScoreQuery)({
      defaultIndex: [(0, _search_strategy.getUserRiskIndex)(spaceId)],
      filterQuery: (0, _search_strategy.buildUserNamesFilter)(userNames),
      riskScoreEntity: _search_strategy.RiskScoreEntity.user
    }));
    return userRiskResponse;
  } catch (error) {
    var _error$meta, _error$meta$body, _error$meta$body$erro;
    if ((error === null || error === void 0 ? void 0 : (_error$meta = error.meta) === null || _error$meta === void 0 ? void 0 : (_error$meta$body = _error$meta.body) === null || _error$meta$body === void 0 ? void 0 : (_error$meta$body$erro = _error$meta$body.error) === null || _error$meta$body$erro === void 0 ? void 0 : _error$meta$body$erro.type) !== 'index_not_found_exception') {
      throw error;
    }
    return undefined;
  }
}