"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.allHosts = void 0;
var _fp = require("lodash/fp");
var _constants = require("../../../../../../common/constants");
var _search_strategy = require("../../../../../../common/search_strategy");
var _build_query = require("../../../../../utils/build_query");
var _queryAll_hosts = require("./query.all_hosts.dsl");
var _helpers = require("./helpers");
var _queryRisk_score = require("../../risk_score/all/query.risk_score.dsl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const allHosts = {
  buildDsl: options => {
    if (options.pagination && options.pagination.querySize >= _constants.DEFAULT_MAX_TABLE_QUERY_SIZE) {
      throw new Error(`No query size above ${_constants.DEFAULT_MAX_TABLE_QUERY_SIZE}`);
    }
    return (0, _queryAll_hosts.buildHostsQuery)(options);
  },
  parse: async (options, response, deps) => {
    const {
      activePage,
      cursorStart,
      fakePossibleCount,
      querySize
    } = options.pagination;
    const totalCount = (0, _fp.getOr)(0, 'aggregations.host_count.value', response.rawResponse);
    const buckets = (0, _fp.getOr)([], 'aggregations.host_data.buckets', response.rawResponse);
    const hostsEdges = buckets.map(bucket => (0, _helpers.formatHostEdgesData)(_helpers.HOSTS_FIELDS, bucket));
    const fakeTotalCount = fakePossibleCount <= totalCount ? fakePossibleCount : totalCount;
    const edges = hostsEdges.splice(cursorStart, querySize - cursorStart);
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryAll_hosts.buildHostsQuery)(options))]
    };
    const showMorePagesIndicator = totalCount > fakeTotalCount;
    const hostNames = edges.map(edge => (0, _fp.getOr)('', 'node.host.name[0]', edge));
    const enhancedEdges = deps !== null && deps !== void 0 && deps.spaceId ? await enhanceEdges(edges, hostNames, deps.spaceId, deps.esClient) : edges;
    return {
      ...response,
      inspect,
      edges: enhancedEdges,
      totalCount,
      pageInfo: {
        activePage: activePage !== null && activePage !== void 0 ? activePage : 0,
        fakeTotalCount,
        showMorePagesIndicator
      }
    };
  }
};
exports.allHosts = allHosts;
async function enhanceEdges(edges, hostNames, spaceId, esClient) {
  const hostRiskData = await getHostRiskData(esClient, spaceId, hostNames);
  const hostsRiskByHostName = hostRiskData === null || hostRiskData === void 0 ? void 0 : hostRiskData.hits.hits.reduce((acc, hit) => {
    var _hit$_source$host$nam, _hit$_source, _hit$_source2, _hit$_source2$host, _hit$_source2$host$ri;
    return {
      ...acc,
      [(_hit$_source$host$nam = (_hit$_source = hit._source) === null || _hit$_source === void 0 ? void 0 : _hit$_source.host.name) !== null && _hit$_source$host$nam !== void 0 ? _hit$_source$host$nam : '']: (_hit$_source2 = hit._source) === null || _hit$_source2 === void 0 ? void 0 : (_hit$_source2$host = _hit$_source2.host) === null || _hit$_source2$host === void 0 ? void 0 : (_hit$_source2$host$ri = _hit$_source2$host.risk) === null || _hit$_source2$host$ri === void 0 ? void 0 : _hit$_source2$host$ri.calculated_level
    };
  }, {});
  return hostsRiskByHostName ? edges.map(({
    node,
    cursor
  }) => {
    var _node$_id;
    return {
      node: {
        ...node,
        risk: hostsRiskByHostName[(_node$_id = node._id) !== null && _node$_id !== void 0 ? _node$_id : '']
      },
      cursor
    };
  }) : edges;
}
async function getHostRiskData(esClient, spaceId, hostNames) {
  try {
    const hostRiskResponse = await esClient.asCurrentUser.search((0, _queryRisk_score.buildRiskScoreQuery)({
      defaultIndex: [(0, _search_strategy.getHostRiskIndex)(spaceId)],
      filterQuery: (0, _search_strategy.buildHostNamesFilter)(hostNames),
      riskScoreEntity: _search_strategy.RiskScoreEntity.host
    }));
    return hostRiskResponse;
  } catch (error) {
    var _error$meta, _error$meta$body, _error$meta$body$erro;
    if ((error === null || error === void 0 ? void 0 : (_error$meta = error.meta) === null || _error$meta === void 0 ? void 0 : (_error$meta$body = _error$meta.body) === null || _error$meta$body === void 0 ? void 0 : (_error$meta$body$erro = _error$meta$body.error) === null || _error$meta$body$erro === void 0 ? void 0 : _error$meta$body$erro.type) !== 'index_not_found_exception') {
      throw error;
    }
    return undefined;
  }
}