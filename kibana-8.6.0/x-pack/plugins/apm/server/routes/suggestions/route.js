"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.suggestionsRouteRepository = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _common = require("../../../../observability/common");
var _get_suggestions_with_terms_enum = require("./get_suggestions_with_terms_enum");
var _get_suggestions_with_terms_aggregation = require("./get_suggestions_with_terms_aggregation");
var _transactions = require("../../lib/helpers/transactions");
var _create_apm_server_route = require("../apm_routes/create_apm_server_route");
var _default_api_types = require("../default_api_types");
var _get_apm_event_client = require("../../lib/helpers/get_apm_event_client");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const suggestionsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/suggestions',
  params: t.type({
    query: t.intersection([t.type({
      fieldName: t.string,
      fieldValue: t.string
    }), _default_api_types.rangeRt, t.partial({
      serviceName: t.string
    })])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const {
      context,
      params,
      config
    } = resources;
    const {
      fieldName,
      fieldValue,
      serviceName,
      start,
      end
    } = params.query;
    const searchAggregatedTransactions = await (0, _transactions.getSearchTransactionsEvents)({
      apmEventClient,
      config,
      kuery: ''
    });
    const coreContext = await context.core;
    const size = await coreContext.uiSettings.client.get(_common.maxSuggestions);
    if (!serviceName) {
      const suggestions = await (0, _get_suggestions_with_terms_enum.getSuggestionsWithTermsEnum)({
        fieldName,
        fieldValue,
        searchAggregatedTransactions,
        apmEventClient,
        size,
        start,
        end
      });

      // if no terms are found using terms enum it will fall back to using ordinary terms agg search
      // This is useful because terms enum can only find terms that start with the search query
      // whereas terms agg approach can find terms that contain the search query
      if (suggestions.terms.length > 0) {
        return suggestions;
      }
    }
    return (0, _get_suggestions_with_terms_aggregation.getSuggestionsWithTermsAggregation)({
      fieldName,
      fieldValue,
      searchAggregatedTransactions,
      serviceName,
      apmEventClient,
      size,
      start,
      end
    });
  }
});
const suggestionsRouteRepository = {
  ...suggestionsRoute
};
exports.suggestionsRouteRepository = suggestionsRouteRepository;