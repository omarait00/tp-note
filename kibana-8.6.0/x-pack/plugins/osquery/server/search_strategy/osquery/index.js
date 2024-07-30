"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.osquerySearchStrategyProvider = void 0;
var _rxjs = require("rxjs");
var _server = require("../../../../../../src/plugins/data/server");
var _common = require("../../../../../../src/plugins/data/common");
var _constants = require("../../../common/constants");
var _factory = require("./factory");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const osquerySearchStrategyProvider = (data, esClient) => {
  let es;
  return {
    search: (request, options, deps) => {
      if (request.factoryQueryType == null) {
        throw new Error('factoryQueryType is required');
      }
      const queryFactory = _factory.osqueryFactory[request.factoryQueryType];
      return (0, _rxjs.from)(esClient.asInternalUser.indices.exists({
        index: `${_constants.ACTIONS_INDEX}*`
      })).pipe((0, _rxjs.mergeMap)(exists => {
        var _dsl$index, _dsl$index2;
        const dsl = queryFactory.buildDsl({
          ...request,
          componentTemplateExists: exists
        });
        // use internal user for searching .fleet* indices
        es = (_dsl$index = dsl.index) !== null && _dsl$index !== void 0 && _dsl$index.includes('fleet') || (_dsl$index2 = dsl.index) !== null && _dsl$index2 !== void 0 && _dsl$index2.includes('logs-osquery_manager.action') ? data.search.searchAsInternalUser : data.search.getSearchStrategy(_common.ENHANCED_ES_SEARCH_STRATEGY);
        return es.search({
          ...request,
          params: dsl
        }, options, deps);
      }), (0, _rxjs.map)(response => ({
        ...response,
        ...{
          rawResponse: (0, _server.shimHitsTotal)(response.rawResponse, options)
        },
        total: response.rawResponse.hits.total
      })), (0, _rxjs.mergeMap)(esSearchRes => queryFactory.parse(request, esSearchRes)));
    },
    cancel: async (id, options, deps) => {
      var _es;
      if ((_es = es) !== null && _es !== void 0 && _es.cancel) {
        return es.cancel(id, options, deps);
      }
    }
  };
};
exports.osquerySearchStrategyProvider = osquerySearchStrategyProvider;