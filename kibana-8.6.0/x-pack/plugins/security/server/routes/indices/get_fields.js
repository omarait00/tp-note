"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineGetFieldsRoutes = defineGetFieldsRoutes;
var _configSchema = require("@kbn/config-schema");
var _errors = require("../../errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function defineGetFieldsRoutes({
  router
}) {
  router.get({
    path: '/internal/security/fields/{query}',
    validate: {
      params: _configSchema.schema.object({
        query: _configSchema.schema.string()
      })
    }
  }, async (context, request, response) => {
    try {
      const esClient = (await context.core).elasticsearch.client;
      const indexMappings = await esClient.asCurrentUser.indices.getFieldMapping({
        index: request.params.query,
        fields: '*',
        allow_no_indices: false,
        include_defaults: true,
        filter_path: '*.mappings.*.mapping.*.type'
      });

      // The flow is the following (see response format at https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-get-field-mapping.html):
      // 1. Iterate over all matched indices.
      // 2. Extract all the field names from the `mappings` field of the particular index.
      // 3. Collect and flatten the list of the field names, omitting any fields without mappings, and any runtime fields
      // 4. Use `Set` to get only unique field names.
      const fields = Array.from(new Set(Object.values(indexMappings).flatMap(indexMapping => {
        return Object.keys(indexMapping.mappings).filter(fieldName => {
          var _indexMapping$mapping, _mappingValues$;
          const mappingValues = Object.values( // `FieldMapping` type from `TypeFieldMappings` --> `GetFieldMappingResponse` is not correct and
          // doesn't have any properties.
          (_indexMapping$mapping = indexMapping.mappings[fieldName]) === null || _indexMapping$mapping === void 0 ? void 0 : _indexMapping$mapping.mapping);
          const hasMapping = mappingValues.length > 0;
          const isRuntimeField = hasMapping && ((_mappingValues$ = mappingValues[0]) === null || _mappingValues$ === void 0 ? void 0 : _mappingValues$.type) === 'runtime';

          // fields without mappings are internal fields such as `_routing` and `_index`,
          // and therefore don't make sense as autocomplete suggestions for FLS.

          // Runtime fields are not securable via FLS.
          // Administrators should instead secure access to the fields which derive this information.
          return hasMapping && !isRuntimeField;
        });
      })));
      return response.ok({
        body: fields
      });
    } catch (error) {
      const customResponse = (0, _errors.wrapIntoCustomErrorResponse)(error);

      // Elasticsearch returns a 404 response if the provided pattern does not match any indices.
      // In this scenario, we want to instead treat this as an empty response.
      if (customResponse.statusCode === 404) {
        return response.ok({
          body: []
        });
      }
      return response.customError(customResponse);
    }
  });
}