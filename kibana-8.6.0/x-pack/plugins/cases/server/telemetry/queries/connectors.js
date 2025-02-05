"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConnectorsTelemetryData = void 0;
var _constants = require("../../../common/constants");
var _utils = require("../../client/utils");
var _utils2 = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getConnectorsTelemetryData = async ({
  savedObjectsClient
}) => {
  var _all$0$aggregations$r, _all$0$aggregations, _all$0$aggregations$r2, _all$0$aggregations$r3, _all$0$aggregations$r4, _all$1$aggregations$r, _all$1$aggregations, _all$1$aggregations$r2, _all$1$aggregations$r3, _all$1$aggregations$r4;
  const getData = async ({
    filter,
    aggs
  } = {}) => {
    const res = await savedObjectsClient.find({
      page: 0,
      perPage: 0,
      filter,
      type: _constants.CASE_USER_ACTION_SAVED_OBJECT,
      aggs: {
        ...aggs
      }
    });
    return res;
  };
  const getConnectorData = async connectorType => {
    const connectorFilter = (0, _utils.buildFilter)({
      filters: [connectorType],
      field: 'payload.connector.type',
      operator: 'or',
      type: _constants.CASE_USER_ACTION_SAVED_OBJECT
    });
    const res = await getData({
      filter: connectorFilter,
      aggs: (0, _utils2.getConnectorsCardinalityAggregationQuery)()
    });
    return res;
  };
  const connectorTypes = ['.servicenow', '.servicenow-sir', '.jira', '.resilient', '.swimlane'];
  const all = await Promise.all([getData({
    aggs: (0, _utils2.getConnectorsCardinalityAggregationQuery)()
  }), getData({
    filter: (0, _utils2.getOnlyConnectorsFilter)(),
    aggs: (0, _utils2.getMaxBucketOnCaseAggregationQuery)(_constants.CASE_USER_ACTION_SAVED_OBJECT)
  }), ...connectorTypes.map(connectorType => getConnectorData(connectorType))]);
  const connectorData = all.slice(2);
  const data = connectorData.reduce((acc, res, currentIndex) => {
    var _res$aggregations$ref, _res$aggregations, _res$aggregations$ref2, _res$aggregations$ref3, _res$aggregations$ref4;
    return {
      ...acc,
      [connectorTypes[currentIndex]]: (_res$aggregations$ref = (_res$aggregations = res.aggregations) === null || _res$aggregations === void 0 ? void 0 : (_res$aggregations$ref2 = _res$aggregations.references) === null || _res$aggregations$ref2 === void 0 ? void 0 : (_res$aggregations$ref3 = _res$aggregations$ref2.referenceType) === null || _res$aggregations$ref3 === void 0 ? void 0 : (_res$aggregations$ref4 = _res$aggregations$ref3.referenceAgg) === null || _res$aggregations$ref4 === void 0 ? void 0 : _res$aggregations$ref4.value) !== null && _res$aggregations$ref !== void 0 ? _res$aggregations$ref : 0
    };
  }, {});
  const allAttached = (_all$0$aggregations$r = (_all$0$aggregations = all[0].aggregations) === null || _all$0$aggregations === void 0 ? void 0 : (_all$0$aggregations$r2 = _all$0$aggregations.references) === null || _all$0$aggregations$r2 === void 0 ? void 0 : (_all$0$aggregations$r3 = _all$0$aggregations$r2.referenceType) === null || _all$0$aggregations$r3 === void 0 ? void 0 : (_all$0$aggregations$r4 = _all$0$aggregations$r3.referenceAgg) === null || _all$0$aggregations$r4 === void 0 ? void 0 : _all$0$aggregations$r4.value) !== null && _all$0$aggregations$r !== void 0 ? _all$0$aggregations$r : 0;
  const maxAttachedToACase = (_all$1$aggregations$r = (_all$1$aggregations = all[1].aggregations) === null || _all$1$aggregations === void 0 ? void 0 : (_all$1$aggregations$r2 = _all$1$aggregations.references) === null || _all$1$aggregations$r2 === void 0 ? void 0 : (_all$1$aggregations$r3 = _all$1$aggregations$r2.cases) === null || _all$1$aggregations$r3 === void 0 ? void 0 : (_all$1$aggregations$r4 = _all$1$aggregations$r3.max) === null || _all$1$aggregations$r4 === void 0 ? void 0 : _all$1$aggregations$r4.value) !== null && _all$1$aggregations$r !== void 0 ? _all$1$aggregations$r : 0;
  return {
    all: {
      all: {
        totalAttached: allAttached
      },
      itsm: {
        totalAttached: data['.servicenow']
      },
      sir: {
        totalAttached: data['.servicenow-sir']
      },
      jira: {
        totalAttached: data['.jira']
      },
      resilient: {
        totalAttached: data['.resilient']
      },
      swimlane: {
        totalAttached: data['.swimlane']
      },
      /**
       * This metric is not 100% accurate. To get this metric we
       * we do a term aggregation based on the the case reference id.
       * Each bucket corresponds to a case and contains the total user actions
       * of type connector. Then from all buckets we take the maximum bucket.
       * A user actions of type connectors will be created if the connector is attached
       * to a case or the user updates the fields of the connector. This metric
       * contains also the updates on the fields of the connector. Ideally we would
       * like to filter for unique connector ids on each bucket.
       */
      maxAttachedToACase
    }
  };
};
exports.getConnectorsTelemetryData = getConnectorsTelemetryData;