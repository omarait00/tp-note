"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupOptionsListSuggestionsRoute = void 0;
var _lodash = require("lodash");
var _server = require("../../../kibana_utils/server");
var _configSchema = require("@kbn/config-schema");
var _options_list_queries = require("./options_list_queries");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const setupOptionsListSuggestionsRoute = ({
  http
}, getAutocompleteSettings) => {
  const router = http.createRouter();
  router.post({
    path: '/api/kibana/controls/optionsList/{index}',
    validate: {
      params: _configSchema.schema.object({
        index: _configSchema.schema.string()
      }, {
        unknowns: 'allow'
      }),
      body: _configSchema.schema.object({
        fieldName: _configSchema.schema.string(),
        filters: _configSchema.schema.maybe(_configSchema.schema.any()),
        fieldSpec: _configSchema.schema.maybe(_configSchema.schema.any()),
        searchString: _configSchema.schema.maybe(_configSchema.schema.string()),
        selectedOptions: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
      }, {
        unknowns: 'allow'
      })
    }
  }, async (context, request, response) => {
    try {
      const suggestionRequest = request.body;
      const {
        index
      } = request.params;
      const esClient = (await context.core).elasticsearch.client.asCurrentUser;
      const suggestionsResponse = await getOptionsListSuggestions({
        abortedEvent$: request.events.aborted$,
        request: suggestionRequest,
        esClient,
        index
      });
      return response.ok({
        body: suggestionsResponse
      });
    } catch (e) {
      const kbnErr = (0, _server.getKbnServerError)(e);
      return (0, _server.reportServerError)(response, kbnErr);
    }
  });
  const getOptionsListSuggestions = async ({
    abortedEvent$,
    esClient,
    request,
    index
  }) => {
    const abortController = new AbortController();
    abortedEvent$.subscribe(() => abortController.abort());

    /**
     * Build ES Query
     */
    const {
      runPastTimeout,
      filters,
      fieldName,
      runtimeFieldMap
    } = request;
    const {
      terminateAfter,
      timeout
    } = getAutocompleteSettings();
    const timeoutSettings = runPastTimeout ? {} : {
      timeout: `${timeout}ms`,
      terminate_after: terminateAfter
    };
    const suggestionBuilder = (0, _options_list_queries.getSuggestionAggregationBuilder)(request);
    const validationBuilder = (0, _options_list_queries.getValidationAggregationBuilder)();
    const builtSuggestionAggregation = suggestionBuilder.buildAggregation(request);
    const suggestionAggregation = builtSuggestionAggregation ? {
      suggestions: builtSuggestionAggregation
    } : {};
    const builtValidationAggregation = validationBuilder.buildAggregation(request);
    const validationAggregations = builtValidationAggregation ? {
      validation: builtValidationAggregation
    } : {};
    const body = {
      size: 0,
      ...timeoutSettings,
      query: {
        bool: {
          filter: filters
        }
      },
      aggs: {
        ...suggestionAggregation,
        ...validationAggregations,
        unique_terms: {
          cardinality: {
            field: fieldName
          }
        }
      },
      runtime_mappings: {
        ...runtimeFieldMap
      }
    };

    /**
     * Run ES query
     */
    const rawEsResult = await esClient.search({
      index,
      body
    }, {
      signal: abortController.signal
    });

    /**
     * Parse ES response into Options List Response
     */
    const totalCardinality = (0, _lodash.get)(rawEsResult, 'aggregations.unique_terms.value');
    const suggestions = suggestionBuilder.parse(rawEsResult);
    const invalidSelections = validationBuilder.parse(rawEsResult);
    return {
      suggestions,
      totalCardinality,
      invalidSelections
    };
  };
};
exports.setupOptionsListSuggestionsRoute = setupOptionsListSuggestionsRoute;