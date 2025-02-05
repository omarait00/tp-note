"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStoredAnnotations = getStoredAnnotations;
var _elasticsearch = require("@elastic/elasticsearch");
var _server = require("../../../../../observability/server");
var _environment_query = require("../../../../common/utils/environment_query");
var _annotations = require("../../../../common/annotations");
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getStoredAnnotations({
  serviceName,
  environment,
  client,
  annotationsClient,
  logger,
  start,
  end
}) {
  return (0, _with_apm_span.withApmSpan)('get_stored_annotations', async () => {
    const body = {
      size: 50,
      query: {
        bool: {
          filter: [{
            term: {
              'annotation.type': 'deployment'
            }
          }, {
            term: {
              tags: 'apm'
            }
          }, {
            term: {
              [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
            }
          }, ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment)]
        }
      }
    };
    try {
      const response = await (0, _server.unwrapEsResponse)(client.search({
        index: annotationsClient.index,
        body
      }, {
        meta: true
      }));
      return response.hits.hits.map(hit => {
        return {
          type: _annotations.AnnotationType.VERSION,
          id: hit._id,
          '@timestamp': new Date(hit._source['@timestamp']).getTime(),
          text: hit._source.message
        };
      });
    } catch (error) {
      // index is only created when an annotation has been indexed,
      // so we should handle this error gracefully
      if (error instanceof _server.WrappedElasticsearchClientError && error.originalError instanceof _elasticsearch.errors.ResponseError) {
        const type = error.originalError.body.error.type;
        if (type === 'index_not_found_exception') {
          return [];
        }
        if (type === 'security_exception') {
          logger.warn(`Unable to get stored annotations due to a security exception. Please make sure that the user has 'indices:data/read/search' permissions for ${annotationsClient.index}`);
          return [];
        }
      }
      throw error;
    }
  });
}