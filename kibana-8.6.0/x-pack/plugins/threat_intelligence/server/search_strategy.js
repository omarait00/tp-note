"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.threatIntelligenceSearchStrategyProvider = void 0;
var _common = require("../../../../src/plugins/data/common");
var _server = require("../../../../src/plugins/data/server");
var _operators = require("rxjs/operators");
var _constants = require("../common/constants");
var _indicator = require("../common/types/indicator");
var _calculate_barchart_time_interval = require("./utils/calculate_barchart_time_interval");
var _get_indicator_query_params = require("./utils/get_indicator_query_params");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const TIMESTAMP_FIELD = _indicator.RawIndicatorFieldId.TimeStamp;
function isObj(req) {
  return typeof req === 'object' && req !== null;
}
function assertValidRequestType(req) {
  if (!isObj(req) || req.factoryQueryType == null) {
    throw new Error('factoryQueryType is required');
  }
}
function isBarchartRequest(req) {
  return isObj(req) && req.factoryQueryType === _constants.FactoryQueryType.Barchart;
}
const getAggregationsQuery = request => {
  const {
    dateRange: {
      from: min,
      to: max
    },
    field
  } = request;
  const interval = (0, _calculate_barchart_time_interval.calculateBarchartColumnTimeInterval)(min, max);
  return {
    aggregations: {
      [_constants.BARCHART_AGGREGATION_NAME]: {
        terms: {
          field
        },
        aggs: {
          events: {
            date_histogram: {
              field: TIMESTAMP_FIELD,
              fixed_interval: interval,
              min_doc_count: 0,
              extended_bounds: {
                min,
                max
              }
            }
          }
        }
      }
    },
    fields: [TIMESTAMP_FIELD, field],
    size: 0
  };
};
const threatIntelligenceSearchStrategyProvider = data => {
  const es = data.search.getSearchStrategy(_common.ENHANCED_ES_SEARCH_STRATEGY);
  return {
    search: (request, options, deps) => {
      assertValidRequestType(request);
      const runtimeMappings = (0, _get_indicator_query_params.createRuntimeMappings)();
      const dsl = {
        ...request.params,
        runtime_mappings: runtimeMappings,
        ...(isBarchartRequest(request) ? getAggregationsQuery(request) : {})
      };
      return es.search({
        ...request,
        params: dsl
      }, options, deps).pipe((0, _operators.map)(response => {
        return {
          ...response,
          ...{
            rawResponse: (0, _server.shimHitsTotal)(response.rawResponse, options)
          }
        };
      }));
    },
    cancel: async (id, options, deps) => {
      if (es.cancel) {
        return es.cancel(id, options, deps);
      }
    }
  };
};
exports.threatIntelligenceSearchStrategyProvider = threatIntelligenceSearchStrategyProvider;