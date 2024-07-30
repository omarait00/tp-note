"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerIndexRoutes = registerIndexRoutes;
var _configSchema = require("@kbn/config-schema");
var _i18n = require("@kbn/i18n");
var _constants = require("../../../common/constants");
var _error_codes = require("../../../common/types/error_codes");
var _delete_connector = require("../../lib/connectors/delete_connector");
var _fetch_connectors = require("../../lib/connectors/fetch_connectors");
var _fetch_crawlers = require("../../lib/crawler/fetch_crawlers");
var _create_index = require("../../lib/indices/create_index");
var _exists_index = require("../../lib/indices/exists_index");
var _fetch_index = require("../../lib/indices/fetch_index");
var _fetch_indices = require("../../lib/indices/fetch_indices");
var _generate_api_key = require("../../lib/indices/generate_api_key");
var _get_ml_inference_errors = require("../../lib/indices/pipelines/ml_inference/get_ml_inference_errors");
var _get_ml_inference_pipeline_history = require("../../lib/indices/pipelines/ml_inference/get_ml_inference_pipeline_history");
var _attach_ml_pipeline = require("../../lib/indices/pipelines/ml_inference/pipeline_processors/attach_ml_pipeline");
var _create_ml_inference_pipeline = require("../../lib/indices/pipelines/ml_inference/pipeline_processors/create_ml_inference_pipeline");
var _delete_ml_inference_pipeline = require("../../lib/indices/pipelines/ml_inference/pipeline_processors/delete_ml_inference_pipeline");
var _detach_ml_inference_pipeline = require("../../lib/indices/pipelines/ml_inference/pipeline_processors/detach_ml_inference_pipeline");
var _get_ml_inference_pipeline_processors = require("../../lib/indices/pipelines/ml_inference/pipeline_processors/get_ml_inference_pipeline_processors");
var _create_pipeline_definitions = require("../../lib/pipelines/create_pipeline_definitions");
var _get_custom_pipelines = require("../../lib/pipelines/get_custom_pipelines");
var _get_pipeline = require("../../lib/pipelines/get_pipeline");
var _get_ml_inference_pipelines = require("../../lib/pipelines/ml_inference/get_ml_inference_pipelines");
var _create_error = require("../../utils/create_error");
var _elasticsearch_error_handler = require("../../utils/elasticsearch_error_handler");
var _identify_exceptions = require("../../utils/identify_exceptions");
var _ml_inference_pipeline_utils = require("../../utils/ml_inference_pipeline_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerIndexRoutes({
  router,
  enterpriseSearchRequestHandler,
  log,
  ml
}) {
  router.get({
    path: '/internal/enterprise_search/search_indices',
    validate: false
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, _, response) => {
    const {
      client
    } = (await context.core).elasticsearch;
    const patterns = {
      alias_pattern: 'search-',
      index_pattern: '.ent-search-engine-documents'
    };
    const indices = await (0, _fetch_indices.fetchIndices)(client, '*', false, true, patterns);
    return response.ok({
      body: indices,
      headers: {
        'content-type': 'application/json'
      }
    });
  }));
  router.get({
    path: '/internal/enterprise_search/indices',
    validate: {
      query: _configSchema.schema.object({
        page: _configSchema.schema.number({
          defaultValue: 0,
          min: 0
        }),
        return_hidden_indices: _configSchema.schema.maybe(_configSchema.schema.boolean()),
        search_query: _configSchema.schema.maybe(_configSchema.schema.string()),
        size: _configSchema.schema.number({
          defaultValue: 10,
          min: 0
        })
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const {
      page,
      size,
      return_hidden_indices: returnHiddenIndices,
      search_query: searchQuery
    } = request.query;
    const {
      client
    } = (await context.core).elasticsearch;
    const indexPattern = searchQuery ? `*${searchQuery}*` : '*';
    const totalIndices = await (0, _fetch_indices.fetchIndices)(client, indexPattern, !!returnHiddenIndices, false);
    const totalResults = totalIndices.length;
    const totalPages = Math.ceil(totalResults / size) || 1;
    const startIndex = (page - 1) * size;
    const endIndex = page * size;
    const selectedIndices = totalIndices.slice(startIndex, endIndex);
    const indexNames = selectedIndices.map(({
      name
    }) => name);
    const connectors = await (0, _fetch_connectors.fetchConnectors)(client, indexNames);
    const crawlers = await (0, _fetch_crawlers.fetchCrawlers)(client, indexNames);
    const indices = selectedIndices.map(index => ({
      ...index,
      connector: connectors.find(connector => connector.index_name === index.name),
      crawler: crawlers.find(crawler => crawler.index_name === index.name)
    }));
    return response.ok({
      body: {
        indices,
        meta: {
          page: {
            current: page,
            size: indices.length,
            total_pages: totalPages,
            total_results: totalResults
          }
        }
      },
      headers: {
        'content-type': 'application/json'
      }
    });
  }));
  router.get({
    path: '/internal/enterprise_search/indices/{indexName}',
    validate: {
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const indexName = decodeURIComponent(request.params.indexName);
    const {
      client
    } = (await context.core).elasticsearch;
    try {
      const index = await (0, _fetch_index.fetchIndex)(client, indexName);
      return response.ok({
        body: index,
        headers: {
          'content-type': 'application/json'
        }
      });
    } catch (error) {
      if ((0, _identify_exceptions.isIndexNotFoundException)(error)) {
        return (0, _create_error.createError)({
          errorCode: _error_codes.ErrorCode.INDEX_NOT_FOUND,
          message: 'Could not find index',
          response,
          statusCode: 404
        });
      }
      throw error;
    }
  }));
  router.delete({
    path: '/internal/enterprise_search/indices/{indexName}',
    validate: {
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const indexName = decodeURIComponent(request.params.indexName);
    const {
      client
    } = (await context.core).elasticsearch;
    try {
      const crawler = await (0, _fetch_crawlers.fetchCrawlerByIndexName)(client, indexName);
      const connector = await (0, _fetch_connectors.fetchConnectorByIndexName)(client, indexName);
      if (crawler) {
        const crawlerRes = await enterpriseSearchRequestHandler.createRequest({
          path: `/api/ent/v1/internal/indices/${indexName}`
        })(context, request, response);
        if (crawlerRes.status !== 200) {
          throw new Error(crawlerRes.payload.message);
        }
      }
      if (connector) {
        await (0, _delete_connector.deleteConnectorById)(client, connector.id);
      }
      await client.asCurrentUser.indices.delete({
        index: indexName
      });
      return response.ok({
        body: {},
        headers: {
          'content-type': 'application/json'
        }
      });
    } catch (error) {
      if ((0, _identify_exceptions.isIndexNotFoundException)(error)) {
        return (0, _create_error.createError)({
          errorCode: _error_codes.ErrorCode.INDEX_NOT_FOUND,
          message: 'Could not find index',
          response,
          statusCode: 404
        });
      }
      throw error;
    }
  }));
  router.get({
    path: '/internal/enterprise_search/indices/{indexName}/exists',
    validate: {
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const indexName = decodeURIComponent(request.params.indexName);
    const {
      client
    } = (await context.core).elasticsearch;
    let indexExists;
    try {
      indexExists = await client.asCurrentUser.indices.exists({
        index: indexName
      });
    } catch (e) {
      log.warn(_i18n.i18n.translate('xpack.enterpriseSearch.server.routes.indices.existsErrorLogMessage', {
        defaultMessage: 'An error occurred while resolving request to {requestUrl}',
        values: {
          requestUrl: request.url.toString()
        }
      }));
      log.warn(e);
      indexExists = false;
    }
    return response.ok({
      body: {
        exists: indexExists
      },
      headers: {
        'content-type': 'application/json'
      }
    });
  }));
  router.post({
    path: '/internal/enterprise_search/indices/{indexName}/api_key',
    validate: {
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const indexName = decodeURIComponent(request.params.indexName);
    const {
      client
    } = (await context.core).elasticsearch;
    const apiKey = await (0, _generate_api_key.generateApiKey)(client, indexName);
    return response.ok({
      body: apiKey,
      headers: {
        'content-type': 'application/json'
      }
    });
  }));
  router.post({
    path: '/internal/enterprise_search/indices/{indexName}/pipelines',
    validate: {
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const indexName = decodeURIComponent(request.params.indexName);
    const {
      client
    } = (await context.core).elasticsearch;
    const createResult = await (0, _create_pipeline_definitions.createIndexPipelineDefinitions)(indexName, client.asCurrentUser);
    return response.ok({
      body: createResult,
      headers: {
        'content-type': 'application/json'
      }
    });
  }));
  router.get({
    path: '/internal/enterprise_search/indices/{indexName}/pipelines',
    validate: {
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const indexName = decodeURIComponent(request.params.indexName);
    const {
      client
    } = (await context.core).elasticsearch;
    const [defaultPipeline, customPipelines] = await Promise.all([(0, _get_pipeline.getPipeline)(_constants.DEFAULT_PIPELINE_NAME, client), (0, _get_custom_pipelines.getCustomPipelines)(indexName, client)]);
    return response.ok({
      body: {
        ...defaultPipeline,
        ...customPipelines
      },
      headers: {
        'content-type': 'application/json'
      }
    });
  }));
  router.get({
    path: '/internal/enterprise_search/indices/{indexName}/ml_inference/pipeline_processors',
    validate: {
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const indexName = decodeURIComponent(request.params.indexName);
    const {
      elasticsearch: {
        client
      },
      savedObjects: {
        client: savedObjectsClient
      }
    } = await context.core;
    const trainedModelsProvider = ml ? await ml.trainedModelsProvider(request, savedObjectsClient) : undefined;
    const mlInferencePipelineProcessorConfigs = await (0, _get_ml_inference_pipeline_processors.fetchMlInferencePipelineProcessors)(client.asCurrentUser, trainedModelsProvider, indexName);
    return response.ok({
      body: mlInferencePipelineProcessorConfigs,
      headers: {
        'content-type': 'application/json'
      }
    });
  }));
  router.post({
    path: '/internal/enterprise_search/indices/{indexName}/ml_inference/pipeline_processors',
    validate: {
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        destination_field: _configSchema.schema.maybe(_configSchema.schema.nullable(_configSchema.schema.string())),
        model_id: _configSchema.schema.string(),
        pipeline_name: _configSchema.schema.string(),
        source_field: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    var _createPipelineResult;
    const indexName = decodeURIComponent(request.params.indexName);
    const {
      client
    } = (await context.core).elasticsearch;
    const {
      model_id: modelId,
      pipeline_name: pipelineName,
      source_field: sourceField,
      destination_field: destinationField
    } = request.body;
    let createPipelineResult;
    try {
      // Create the sub-pipeline for inference
      createPipelineResult = await (0, _create_ml_inference_pipeline.createAndReferenceMlInferencePipeline)(indexName, pipelineName, modelId, sourceField, destinationField, client.asCurrentUser);
    } catch (error) {
      // Handle scenario where pipeline already exists
      if (error.message === _error_codes.ErrorCode.PIPELINE_ALREADY_EXISTS) {
        return (0, _create_error.createError)({
          errorCode: error.message,
          message: `
              A pipeline with the name "${(0, _ml_inference_pipeline_utils.getPrefixedInferencePipelineProcessorName)(pipelineName)}"
              already exists. Pipelines names are unique within a deployment. Consider adding the
              index name for uniqueness.
            `,
          response,
          statusCode: 409
        });
      }
      throw error;
    }
    return response.ok({
      body: {
        created: (_createPipelineResult = createPipelineResult) === null || _createPipelineResult === void 0 ? void 0 : _createPipelineResult.id
      },
      headers: {
        'content-type': 'application/json'
      }
    });
  }));
  router.post({
    path: '/internal/enterprise_search/indices/{indexName}/ml_inference/pipeline_processors/attach',
    validate: {
      body: _configSchema.schema.object({
        pipeline_name: _configSchema.schema.string()
      }),
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const indexName = decodeURIComponent(request.params.indexName);
    const {
      client
    } = (await context.core).elasticsearch;
    const {
      pipeline_name: pipelineName
    } = request.body;
    let attachMlInferencePipelineResult;
    try {
      attachMlInferencePipelineResult = await (0, _attach_ml_pipeline.attachMlInferencePipeline)(indexName, pipelineName, client.asCurrentUser);
    } catch (error) {
      throw error;
    }
    return response.ok({
      body: {
        ...attachMlInferencePipelineResult,
        created: false
      },
      headers: {
        'content-type': 'application/json'
      }
    });
  }));
  router.post({
    path: '/internal/enterprise_search/indices',
    validate: {
      body: _configSchema.schema.object({
        index_name: _configSchema.schema.string(),
        language: _configSchema.schema.maybe(_configSchema.schema.nullable(_configSchema.schema.string()))
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const {
      ['index_name']: indexName,
      language
    } = request.body;
    const {
      client
    } = (await context.core).elasticsearch;
    const indexExists = await client.asCurrentUser.indices.exists({
      index: request.body.index_name
    });
    if (indexExists) {
      return (0, _create_error.createError)({
        errorCode: _error_codes.ErrorCode.INDEX_ALREADY_EXISTS,
        message: _i18n.i18n.translate('xpack.enterpriseSearch.server.routes.createApiIndex.indexExistsError', {
          defaultMessage: 'This index already exists'
        }),
        response,
        statusCode: 409
      });
    }
    const crawler = await (0, _fetch_crawlers.fetchCrawlerByIndexName)(client, request.body.index_name);
    if (crawler) {
      return (0, _create_error.createError)({
        errorCode: _error_codes.ErrorCode.CRAWLER_ALREADY_EXISTS,
        message: _i18n.i18n.translate('xpack.enterpriseSearch.server.routes.createApiIndex.crawlerExistsError', {
          defaultMessage: 'A crawler for this index already exists'
        }),
        response,
        statusCode: 409
      });
    }
    const connector = await (0, _fetch_connectors.fetchConnectorByIndexName)(client, request.body.index_name);
    if (connector) {
      return (0, _create_error.createError)({
        errorCode: _error_codes.ErrorCode.CONNECTOR_DOCUMENT_ALREADY_EXISTS,
        message: _i18n.i18n.translate('xpack.enterpriseSearch.server.routes.createApiIndex.connectorExistsError', {
          defaultMessage: 'A connector for this index already exists'
        }),
        response,
        statusCode: 409
      });
    }
    const createIndexResponse = await (0, _create_index.createIndex)(client, indexName, language, true);
    return response.ok({
      body: createIndexResponse,
      headers: {
        'content-type': 'application/json'
      }
    });
  }));
  router.post({
    path: '/internal/enterprise_search/indices/{indexName}/ml_inference/pipeline_processors/simulate',
    validate: {
      body: _configSchema.schema.object({
        docs: _configSchema.schema.arrayOf(_configSchema.schema.any()),
        pipeline: _configSchema.schema.object({
          description: _configSchema.schema.maybe(_configSchema.schema.string()),
          processors: _configSchema.schema.arrayOf(_configSchema.schema.any())
        })
      }),
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const {
      pipeline,
      docs
    } = request.body;
    const indexName = decodeURIComponent(request.params.indexName);
    const {
      client
    } = (await context.core).elasticsearch;
    const defaultDescription = `ML inference pipeline for index ${indexName}`;
    if (!(await (0, _exists_index.indexOrAliasExists)(client, indexName))) {
      return (0, _create_error.createError)({
        errorCode: _error_codes.ErrorCode.INDEX_NOT_FOUND,
        message: _i18n.i18n.translate('xpack.enterpriseSearch.server.routes.indices.pipelines.indexMissingError', {
          defaultMessage: 'The index {indexName} does not exist',
          values: {
            indexName
          }
        }),
        response,
        statusCode: 404
      });
    }
    const simulateRequest = {
      docs,
      pipeline: {
        description: defaultDescription,
        ...pipeline
      }
    };
    try {
      const simulateResult = await client.asCurrentUser.ingest.simulate(simulateRequest);
      return response.ok({
        body: simulateResult,
        headers: {
          'content-type': 'application/json'
        }
      });
    } catch (e) {
      log.error(`Error simulating inference pipeline: ${JSON.stringify(e)}`);
      throw e;
    }
  }));
  router.post({
    path: '/internal/enterprise_search/indices/{indexName}/ml_inference/pipeline_processors/simulate/{pipelineName}',
    validate: {
      body: _configSchema.schema.object({
        docs: _configSchema.schema.arrayOf(_configSchema.schema.any())
      }),
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string(),
        pipelineName: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const {
      docs
    } = request.body;
    const indexName = decodeURIComponent(request.params.indexName);
    const pipelineName = decodeURIComponent(request.params.pipelineName);
    const {
      client
    } = (await context.core).elasticsearch;
    const [indexExists, pipelinesResponse] = await Promise.all([(0, _exists_index.indexOrAliasExists)(client, indexName), client.asCurrentUser.ingest.getPipeline({
      id: pipelineName
    })]);
    if (!indexExists) {
      return (0, _create_error.createError)({
        errorCode: _error_codes.ErrorCode.INDEX_NOT_FOUND,
        message: _i18n.i18n.translate('xpack.enterpriseSearch.server.routes.indices.pipelines.indexMissingError', {
          defaultMessage: 'The index {indexName} does not exist',
          values: {
            indexName
          }
        }),
        response,
        statusCode: 404
      });
    }
    if (!(pipelineName in pipelinesResponse)) {
      return (0, _create_error.createError)({
        errorCode: _error_codes.ErrorCode.PIPELINE_NOT_FOUND,
        message: _i18n.i18n.translate('xpack.enterpriseSearch.server.routes.indices.pipelines.pipelineMissingError', {
          defaultMessage: 'The pipeline {pipelineName} does not exist',
          values: {
            pipelineName
          }
        }),
        response,
        statusCode: 404
      });
    }
    const simulateRequest = {
      docs,
      pipeline: pipelinesResponse[pipelineName]
    };
    try {
      const simulateResult = await client.asCurrentUser.ingest.simulate(simulateRequest);
      return response.ok({
        body: simulateResult,
        headers: {
          'content-type': 'application/json'
        }
      });
    } catch (e) {
      log.error(`Error simulating inference pipeline: ${JSON.stringify(e)}`);
      throw e;
    }
  }));
  router.get({
    path: '/internal/enterprise_search/indices/{indexName}/ml_inference/errors',
    validate: {
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const indexName = decodeURIComponent(request.params.indexName);
    const {
      client
    } = (await context.core).elasticsearch;
    const errors = await (0, _get_ml_inference_errors.getMlInferenceErrors)(indexName, client.asCurrentUser);
    return response.ok({
      body: {
        errors
      },
      headers: {
        'content-type': 'application/json'
      }
    });
  }));
  router.put({
    path: '/internal/enterprise_search/indices/{indexName}/ml_inference/pipeline_processors/{pipelineName}',
    validate: {
      body: _configSchema.schema.object({
        description: _configSchema.schema.maybe(_configSchema.schema.string()),
        processors: _configSchema.schema.arrayOf(_configSchema.schema.any())
      }),
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string(),
        pipelineName: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const pipelineBody = request.body;
    const indexName = decodeURIComponent(request.params.indexName);
    const pipelineName = decodeURIComponent(request.params.pipelineName);
    const {
      client
    } = (await context.core).elasticsearch;
    const pipelineId = (0, _ml_inference_pipeline_utils.getPrefixedInferencePipelineProcessorName)(pipelineName);
    const defaultDescription = `ML inference pipeline for index ${indexName}`;
    if (!(await (0, _exists_index.indexOrAliasExists)(client, indexName))) {
      return (0, _create_error.createError)({
        errorCode: _error_codes.ErrorCode.INDEX_NOT_FOUND,
        message: _i18n.i18n.translate('xpack.enterpriseSearch.server.routes.indices.pipelines.indexMissingError', {
          defaultMessage: 'The index {indexName} does not exist',
          values: {
            indexName
          }
        }),
        response,
        statusCode: 404
      });
    }
    const updateRequest = {
      _meta: {
        managed: true,
        managed_by: 'Enterprise Search'
      },
      id: pipelineId,
      description: defaultDescription,
      ...pipelineBody
    };
    const createResult = await client.asCurrentUser.ingest.putPipeline(updateRequest);
    return response.ok({
      body: createResult,
      headers: {
        'content-type': 'application/json'
      }
    });
  }));
  router.delete({
    path: '/internal/enterprise_search/indices/{indexName}/ml_inference/pipeline_processors/{pipelineName}',
    validate: {
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string(),
        pipelineName: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const indexName = decodeURIComponent(request.params.indexName);
    const pipelineName = decodeURIComponent(request.params.pipelineName);
    const {
      client
    } = (await context.core).elasticsearch;
    try {
      const deleteResult = await (0, _delete_ml_inference_pipeline.deleteMlInferencePipeline)(indexName, pipelineName, client.asCurrentUser);
      return response.ok({
        body: deleteResult,
        headers: {
          'content-type': 'application/json'
        }
      });
    } catch (error) {
      if ((0, _identify_exceptions.isResourceNotFoundException)(error)) {
        var _error$meta, _error$meta$body, _error$meta$body$erro;
        // return specific message if pipeline doesn't exist
        return (0, _create_error.createError)({
          errorCode: _error_codes.ErrorCode.RESOURCE_NOT_FOUND,
          message: (_error$meta = error.meta) === null || _error$meta === void 0 ? void 0 : (_error$meta$body = _error$meta.body) === null || _error$meta$body === void 0 ? void 0 : (_error$meta$body$erro = _error$meta$body.error) === null || _error$meta$body$erro === void 0 ? void 0 : _error$meta$body$erro.reason,
          response,
          statusCode: 404
        });
      } else if ((0, _identify_exceptions.isPipelineIsInUseException)(error)) {
        return (0, _create_error.createError)({
          errorCode: _error_codes.ErrorCode.PIPELINE_IS_IN_USE,
          message: _i18n.i18n.translate('xpack.enterpriseSearch.server.routes.indices.mlInference.pipelineProcessors.pipelineIsInUseError', {
            defaultMessage: "Inference pipeline is used in managed pipeline '{pipelineName}' of a different index",
            values: {
              pipelineName: error.pipelineName
            }
          }),
          response,
          statusCode: 400
        });
      }

      // otherwise, let the default handler wrap it
      throw error;
    }
  }));
  router.get({
    path: '/internal/enterprise_search/indices/{indexName}/ml_inference/history',
    validate: {
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const indexName = decodeURIComponent(request.params.indexName);
    const {
      client
    } = (await context.core).elasticsearch;
    const history = await (0, _get_ml_inference_pipeline_history.fetchMlInferencePipelineHistory)(client.asCurrentUser, indexName);
    return response.ok({
      body: history,
      headers: {
        'content-type': 'application/json'
      }
    });
  }));
  router.get({
    path: '/internal/enterprise_search/pipelines/ml_inference',
    validate: {}
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const {
      elasticsearch: {
        client
      },
      savedObjects: {
        client: savedObjectsClient
      }
    } = await context.core;
    const trainedModelsProvider = ml ? await ml.trainedModelsProvider(request, savedObjectsClient) : undefined;
    const pipelines = await (0, _get_ml_inference_pipelines.getMlInferencePipelines)(client.asCurrentUser, trainedModelsProvider);
    return response.ok({
      body: pipelines,
      headers: {
        'content-type': 'application/json'
      }
    });
  }));
  router.delete({
    path: '/internal/enterprise_search/indices/{indexName}/ml_inference/pipeline_processors/{pipelineName}/detach',
    validate: {
      params: _configSchema.schema.object({
        indexName: _configSchema.schema.string(),
        pipelineName: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const indexName = decodeURIComponent(request.params.indexName);
    const pipelineName = decodeURIComponent(request.params.pipelineName);
    const {
      client
    } = (await context.core).elasticsearch;
    try {
      const detachResult = await (0, _detach_ml_inference_pipeline.detachMlInferencePipeline)(indexName, pipelineName, client.asCurrentUser);
      return response.ok({
        body: detachResult,
        headers: {
          'content-type': 'application/json'
        }
      });
    } catch (error) {
      if ((0, _identify_exceptions.isResourceNotFoundException)(error)) {
        var _error$meta2, _error$meta2$body, _error$meta2$body$err;
        // return specific message if pipeline doesn't exist
        return (0, _create_error.createError)({
          errorCode: _error_codes.ErrorCode.RESOURCE_NOT_FOUND,
          message: (_error$meta2 = error.meta) === null || _error$meta2 === void 0 ? void 0 : (_error$meta2$body = _error$meta2.body) === null || _error$meta2$body === void 0 ? void 0 : (_error$meta2$body$err = _error$meta2$body.error) === null || _error$meta2$body$err === void 0 ? void 0 : _error$meta2$body$err.reason,
          response,
          statusCode: 404
        });
      }
      // otherwise, let the default handler wrap it
      throw error;
    }
  }));
}