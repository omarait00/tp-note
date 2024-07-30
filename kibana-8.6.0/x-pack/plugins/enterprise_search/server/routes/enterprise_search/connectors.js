"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerConnectorRoutes = registerConnectorRoutes;
var _configSchema = require("@kbn/config-schema");
var _i18n = require("@kbn/i18n");
var _connectors = require("../../../common/types/connectors");
var _error_codes = require("../../../common/types/error_codes");
var _add_connector = require("../../lib/connectors/add_connector");
var _fetch_sync_jobs = require("../../lib/connectors/fetch_sync_jobs");
var _post_cancel_syncs = require("../../lib/connectors/post_cancel_syncs");
var _put_configure_native = require("../../lib/connectors/put_configure_native");
var _put_update_filtering = require("../../lib/connectors/put_update_filtering");
var _put_update_filtering_draft = require("../../lib/connectors/put_update_filtering_draft");
var _start_sync = require("../../lib/connectors/start_sync");
var _update_connector_configuration = require("../../lib/connectors/update_connector_configuration");
var _update_connector_name_and_description = require("../../lib/connectors/update_connector_name_and_description");
var _update_connector_scheduling = require("../../lib/connectors/update_connector_scheduling");
var _update_connector_service_type = require("../../lib/connectors/update_connector_service_type");
var _update_connector_status = require("../../lib/connectors/update_connector_status");
var _get_default_pipeline = require("../../lib/pipelines/get_default_pipeline");
var _update_default_pipeline = require("../../lib/pipelines/update_default_pipeline");
var _update_pipeline = require("../../lib/pipelines/update_pipeline");
var _create_error = require("../../utils/create_error");
var _elasticsearch_error_handler = require("../../utils/elasticsearch_error_handler");
var _validate_enum = require("../../utils/validate_enum");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerConnectorRoutes({
  router,
  log
}) {
  router.post({
    path: '/internal/enterprise_search/connectors',
    validate: {
      body: _configSchema.schema.object({
        delete_existing_connector: _configSchema.schema.maybe(_configSchema.schema.boolean()),
        index_name: _configSchema.schema.string(),
        is_native: _configSchema.schema.boolean(),
        language: _configSchema.schema.nullable(_configSchema.schema.string())
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const {
      client
    } = (await context.core).elasticsearch;
    try {
      const body = await (0, _add_connector.addConnector)(client, request.body);
      return response.ok({
        body
      });
    } catch (error) {
      if (error.message === _error_codes.ErrorCode.CONNECTOR_DOCUMENT_ALREADY_EXISTS || error.message === _error_codes.ErrorCode.INDEX_ALREADY_EXISTS) {
        return (0, _create_error.createError)({
          errorCode: error.message,
          message: _i18n.i18n.translate('xpack.enterpriseSearch.server.routes.addConnector.connectorExistsError', {
            defaultMessage: 'Connector or index already exists'
          }),
          response,
          statusCode: 409
        });
      }
      throw error;
    }
  }));
  router.post({
    path: '/internal/enterprise_search/connectors/{connectorId}/cancel_syncs',
    validate: {
      params: _configSchema.schema.object({
        connectorId: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const {
      client
    } = (await context.core).elasticsearch;
    await (0, _post_cancel_syncs.cancelSyncs)(client, request.params.connectorId);
    return response.ok();
  }));
  router.post({
    path: '/internal/enterprise_search/connectors/{connectorId}/configuration',
    validate: {
      body: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.object({
        label: _configSchema.schema.string(),
        value: _configSchema.schema.nullable(_configSchema.schema.string())
      })),
      params: _configSchema.schema.object({
        connectorId: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const {
      client
    } = (await context.core).elasticsearch;
    await (0, _update_connector_configuration.updateConnectorConfiguration)(client, request.params.connectorId, request.body);
    return response.ok();
  }));
  router.post({
    path: '/internal/enterprise_search/connectors/{connectorId}/scheduling',
    validate: {
      body: _configSchema.schema.object({
        enabled: _configSchema.schema.boolean(),
        interval: _configSchema.schema.string()
      }),
      params: _configSchema.schema.object({
        connectorId: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const {
      client
    } = (await context.core).elasticsearch;
    await (0, _update_connector_scheduling.updateConnectorScheduling)(client, request.params.connectorId, request.body);
    return response.ok();
  }));
  router.post({
    path: '/internal/enterprise_search/connectors/{connectorId}/start_sync',
    validate: {
      body: _configSchema.schema.object({
        nextSyncConfig: _configSchema.schema.maybe(_configSchema.schema.string())
      }),
      params: _configSchema.schema.object({
        connectorId: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const {
      client
    } = (await context.core).elasticsearch;
    await (0, _start_sync.startConnectorSync)(client, request.params.connectorId, request.body.nextSyncConfig);
    return response.ok();
  }));
  router.get({
    path: '/internal/enterprise_search/connectors/{connectorId}/sync_jobs',
    validate: {
      params: _configSchema.schema.object({
        connectorId: _configSchema.schema.string()
      }),
      query: _configSchema.schema.object({
        page: _configSchema.schema.number({
          defaultValue: 0,
          min: 0
        }),
        size: _configSchema.schema.number({
          defaultValue: 10,
          min: 0
        })
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const {
      client
    } = (await context.core).elasticsearch;
    const result = await (0, _fetch_sync_jobs.fetchSyncJobsByConnectorId)(client, request.params.connectorId, request.query.page, request.query.size);
    return response.ok({
      body: result
    });
  }));
  router.put({
    path: '/internal/enterprise_search/connectors/{connectorId}/pipeline',
    validate: {
      body: _configSchema.schema.object({
        extract_binary_content: _configSchema.schema.boolean(),
        name: _configSchema.schema.string(),
        reduce_whitespace: _configSchema.schema.boolean(),
        run_ml_inference: _configSchema.schema.boolean()
      }),
      params: _configSchema.schema.object({
        connectorId: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const {
      client
    } = (await context.core).elasticsearch;
    await (0, _update_pipeline.updateConnectorPipeline)(client, request.params.connectorId, request.body);
    return response.ok();
  }));
  router.put({
    path: '/internal/enterprise_search/connectors/default_pipeline',
    validate: {
      body: _configSchema.schema.object({
        extract_binary_content: _configSchema.schema.boolean(),
        name: _configSchema.schema.string(),
        reduce_whitespace: _configSchema.schema.boolean(),
        run_ml_inference: _configSchema.schema.boolean()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const {
      client
    } = (await context.core).elasticsearch;
    await (0, _update_default_pipeline.updateDefaultPipeline)(client, request.body);
    return response.ok();
  }));
  router.get({
    path: '/internal/enterprise_search/connectors/default_pipeline',
    validate: {}
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const {
      client
    } = (await context.core).elasticsearch;
    const result = await (0, _get_default_pipeline.getDefaultPipeline)(client);
    return response.ok({
      body: result
    });
  }));
  router.put({
    path: '/internal/enterprise_search/connectors/{connectorId}/service_type',
    validate: {
      body: _configSchema.schema.object({
        serviceType: _configSchema.schema.string()
      }),
      params: _configSchema.schema.object({
        connectorId: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const {
      client
    } = (await context.core).elasticsearch;
    const result = await (0, _update_connector_service_type.updateConnectorServiceType)(client, request.params.connectorId, request.body.serviceType);
    return response.ok({
      body: result
    });
  }));
  router.put({
    path: '/internal/enterprise_search/connectors/{connectorId}/status',
    validate: {
      body: _configSchema.schema.object({
        status: _configSchema.schema.string()
      }),
      params: _configSchema.schema.object({
        connectorId: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const {
      client
    } = (await context.core).elasticsearch;
    const result = await (0, _update_connector_status.updateConnectorStatus)(client, request.params.connectorId, request.body.status);
    return response.ok({
      body: result
    });
  }));
  router.put({
    path: '/internal/enterprise_search/connectors/{connectorId}/configure_native',
    validate: {
      body: _configSchema.schema.object({
        service_type: _configSchema.schema.string()
      }),
      params: _configSchema.schema.object({
        connectorId: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const {
      client
    } = (await context.core).elasticsearch;
    await (0, _put_configure_native.configureNativeConnector)(client, request.params.connectorId, request.body.service_type);
    return response.ok();
  }));
  router.put({
    path: '/internal/enterprise_search/connectors/{connectorId}/name_and_description',
    validate: {
      body: _configSchema.schema.object({
        description: _configSchema.schema.nullable(_configSchema.schema.string()),
        name: _configSchema.schema.string()
      }),
      params: _configSchema.schema.object({
        connectorId: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const {
      client
    } = (await context.core).elasticsearch;
    const {
      name,
      description
    } = request.body;
    const result = await (0, _update_connector_name_and_description.updateConnectorNameAndDescription)(client, request.params.connectorId, {
      description,
      name
    });
    return response.ok({
      body: result
    });
  }));
  router.put({
    path: '/internal/enterprise_search/connectors/{connectorId}/filtering/draft',
    validate: {
      body: _configSchema.schema.object({
        advanced_snippet: _configSchema.schema.string(),
        filtering_rules: _configSchema.schema.arrayOf(_configSchema.schema.object({
          created_at: _configSchema.schema.string(),
          field: _configSchema.schema.string(),
          id: _configSchema.schema.string(),
          order: _configSchema.schema.number(),
          policy: _configSchema.schema.string({
            validate: (0, _validate_enum.validateEnum)(_connectors.FilteringPolicy, 'policy')
          }),
          rule: _configSchema.schema.string({
            validate: (0, _validate_enum.validateEnum)(_connectors.FilteringRuleRule, 'rule')
          }),
          updated_at: _configSchema.schema.string(),
          value: _configSchema.schema.string()
        }))
      }),
      params: _configSchema.schema.object({
        connectorId: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const {
      client
    } = (await context.core).elasticsearch;
    const {
      connectorId
    } = request.params;
    const {
      advanced_snippet,
      filtering_rules
    } = request.body;
    const result = await (0, _put_update_filtering_draft.updateFilteringDraft)(client, connectorId, {
      advancedSnippet: advanced_snippet,
      // Have to cast here because our API schema validator doesn't know how to deal with enums
      // We're relying on the schema in the validator above to flag if something goes wrong
      filteringRules: filtering_rules
    });
    return result ? response.ok({
      body: result
    }) : response.conflict();
  }));
  router.put({
    path: '/internal/enterprise_search/connectors/{connectorId}/filtering',
    validate: {
      body: _configSchema.schema.object({
        advanced_snippet: _configSchema.schema.string(),
        filtering_rules: _configSchema.schema.arrayOf(_configSchema.schema.object({
          created_at: _configSchema.schema.string(),
          field: _configSchema.schema.string(),
          id: _configSchema.schema.string(),
          order: _configSchema.schema.number(),
          policy: _configSchema.schema.string({
            validate: (0, _validate_enum.validateEnum)(_connectors.FilteringPolicy, 'policy')
          }),
          rule: _configSchema.schema.string({
            validate: (0, _validate_enum.validateEnum)(_connectors.FilteringRuleRule, 'rule')
          }),
          updated_at: _configSchema.schema.string(),
          value: _configSchema.schema.string()
        }))
      }),
      params: _configSchema.schema.object({
        connectorId: _configSchema.schema.string()
      })
    }
  }, (0, _elasticsearch_error_handler.elasticsearchErrorHandler)(log, async (context, request, response) => {
    const {
      client
    } = (await context.core).elasticsearch;
    const {
      connectorId
    } = request.params;
    const {
      advanced_snippet,
      filtering_rules
    } = request.body;
    const result = await (0, _put_update_filtering.updateFiltering)(client, connectorId, {
      advancedSnippet: advanced_snippet,
      // Have to cast here because our API schema validator doesn't know how to deal with enums
      // We're relying on the schema in the validator above to flag if something goes wrong
      filteringRules: filtering_rules
    });
    return result ? response.ok({
      body: result
    }) : response.conflict();
  }));
}