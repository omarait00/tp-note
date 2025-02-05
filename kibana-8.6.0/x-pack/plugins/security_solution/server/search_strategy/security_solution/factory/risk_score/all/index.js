"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.riskScore = void 0;
var _fp = require("lodash/fp");
var _search_strategy = require("../../../../../../common/search_strategy");
var _build_query = require("../../../../../utils/build_query");
var _queryRisk_score = require("./query.risk_score.dsl");
var _constants = require("../../../../../../common/constants");
var _helpers = require("../../cti/event_enrichment/helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const riskScore = {
  buildDsl: options => {
    if (options.pagination && options.pagination.querySize >= _constants.DEFAULT_MAX_TABLE_QUERY_SIZE) {
      throw new Error(`No query size above ${_constants.DEFAULT_MAX_TABLE_QUERY_SIZE}`);
    }
    return (0, _queryRisk_score.buildRiskScoreQuery)(options);
  },
  parse: async (options, response, deps) => {
    var _response$rawResponse, _response$rawResponse2, _hits$map;
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryRisk_score.buildRiskScoreQuery)(options))]
    };
    const totalCount = (0, _helpers.getTotalCount)(response.rawResponse.hits.total);
    const hits = response === null || response === void 0 ? void 0 : (_response$rawResponse = response.rawResponse) === null || _response$rawResponse === void 0 ? void 0 : (_response$rawResponse2 = _response$rawResponse.hits) === null || _response$rawResponse2 === void 0 ? void 0 : _response$rawResponse2.hits;
    const data = (_hits$map = hits === null || hits === void 0 ? void 0 : hits.map(hit => hit._source)) !== null && _hits$map !== void 0 ? _hits$map : [];
    const nameField = options.riskScoreEntity === _search_strategy.RiskScoreEntity.host ? 'host.name' : 'user.name';
    const names = data.map(risk => {
      var _get;
      return (_get = (0, _fp.get)(nameField, risk)) !== null && _get !== void 0 ? _get : '';
    });
    const enhancedData = deps && options.includeAlertsCount ? await enhanceData(data, names, nameField, deps.ruleDataClient, deps.spaceId) : data;
    return {
      ...response,
      inspect,
      totalCount,
      data: enhancedData
    };
  }
};
exports.riskScore = riskScore;
async function enhanceData(data, names, nameField, ruleDataClient, spaceId) {
  const ruleDataReader = ruleDataClient === null || ruleDataClient === void 0 ? void 0 : ruleDataClient.getReader({
    namespace: spaceId
  });
  const query = getAlertsQueryForEntity(names, nameField);
  const response = await (ruleDataReader === null || ruleDataReader === void 0 ? void 0 : ruleDataReader.search(query));
  const buckets = (0, _fp.getOr)([], 'aggregations.alertsByEntity.buckets', response);
  const enhancedAlertsDataByEntityName = buckets.reduce((acc, {
    key,
    doc_count: count,
    oldestAlertTimestamp
  }) => ({
    ...acc,
    [key]: {
      count,
      oldestAlertTimestamp: oldestAlertTimestamp.value_as_string
    }
  }), {});
  return data.map(risk => {
    var _enhancedAlertsDataBy, _enhancedAlertsDataBy2, _enhancedAlertsDataBy3, _enhancedAlertsDataBy4;
    return {
      ...risk,
      alertsCount: (_enhancedAlertsDataBy = (_enhancedAlertsDataBy2 = enhancedAlertsDataByEntityName[(0, _fp.get)(nameField, risk)]) === null || _enhancedAlertsDataBy2 === void 0 ? void 0 : _enhancedAlertsDataBy2.count) !== null && _enhancedAlertsDataBy !== void 0 ? _enhancedAlertsDataBy : 0,
      oldestAlertTimestamp: (_enhancedAlertsDataBy3 = (_enhancedAlertsDataBy4 = enhancedAlertsDataByEntityName[(0, _fp.get)(nameField, risk)]) === null || _enhancedAlertsDataBy4 === void 0 ? void 0 : _enhancedAlertsDataBy4.oldestAlertTimestamp) !== null && _enhancedAlertsDataBy3 !== void 0 ? _enhancedAlertsDataBy3 : 0
    };
  });
}
const getAlertsQueryForEntity = (names, nameField) => ({
  size: 0,
  query: {
    bool: {
      filter: [{
        term: {
          'kibana.alert.workflow_status': 'open'
        }
      }, {
        terms: {
          [nameField]: names
        }
      }]
    }
  },
  aggs: {
    alertsByEntity: {
      terms: {
        field: nameField
      },
      aggs: {
        oldestAlertTimestamp: {
          min: {
            field: '@timestamp'
          }
        }
      }
    }
  }
});