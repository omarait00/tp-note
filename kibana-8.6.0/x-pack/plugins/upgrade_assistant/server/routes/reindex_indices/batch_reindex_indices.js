"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerBatchReindexIndicesRoutes = registerBatchReindexIndicesRoutes;
var _configSchema = require("@kbn/config-schema");
var _elasticsearch = require("@elastic/elasticsearch");
var _constants = require("../../../common/constants");
var _types = require("../../../common/types");
var _es_version_precheck = require("../../lib/es_version_precheck");
var _reindex_actions = require("../../lib/reindexing/reindex_actions");
var _op_utils = require("../../lib/reindexing/op_utils");
var _map_any_error_to_kibana_http_response = require("./map_any_error_to_kibana_http_response");
var _reindex_handler = require("./reindex_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerBatchReindexIndicesRoutes({
  credentialStore,
  router,
  licensing,
  log,
  getSecurityPlugin,
  lib: {
    handleEsError
  }
}, getWorker) {
  const BASE_PATH = `${_constants.API_BASE_PATH}/reindex`;

  // Get the current batch queue
  router.get({
    path: `${BASE_PATH}/batch/queue`,
    validate: {}
  }, (0, _es_version_precheck.versionCheckHandlerWrapper)(async ({
    core
  }, request, response) => {
    const {
      elasticsearch: {
        client: esClient
      },
      savedObjects
    } = await core;
    const {
      client
    } = savedObjects;
    const callAsCurrentUser = esClient.asCurrentUser;
    const reindexActions = (0, _reindex_actions.reindexActionsFactory)(client, callAsCurrentUser);
    try {
      const inProgressOps = await reindexActions.findAllByStatus(_types.ReindexStatus.inProgress);
      const {
        queue
      } = (0, _op_utils.sortAndOrderReindexOperations)(inProgressOps);
      const result = {
        queue: queue.map(savedObject => savedObject.attributes)
      };
      return response.ok({
        body: result
      });
    } catch (error) {
      if (error instanceof _elasticsearch.errors.ResponseError) {
        return handleEsError({
          error,
          response
        });
      }
      return (0, _map_any_error_to_kibana_http_response.mapAnyErrorToKibanaHttpResponse)(error);
    }
  }));

  // Add indices for reindexing to the worker's batch
  router.post({
    path: `${BASE_PATH}/batch`,
    validate: {
      body: _configSchema.schema.object({
        indexNames: _configSchema.schema.arrayOf(_configSchema.schema.string())
      })
    }
  }, (0, _es_version_precheck.versionCheckHandlerWrapper)(async ({
    core
  }, request, response) => {
    const {
      savedObjects: {
        client: savedObjectsClient
      },
      elasticsearch: {
        client: esClient
      }
    } = await core;
    const {
      indexNames
    } = request.body;
    const results = {
      enqueued: [],
      errors: []
    };
    for (const indexName of indexNames) {
      try {
        const result = await (0, _reindex_handler.reindexHandler)({
          savedObjects: savedObjectsClient,
          dataClient: esClient,
          indexName,
          log,
          licensing,
          request,
          credentialStore,
          reindexOptions: {
            enqueue: true
          },
          security: getSecurityPlugin()
        });
        results.enqueued.push(result);
      } catch (e) {
        results.errors.push({
          indexName,
          message: e.message
        });
      }
    }
    if (results.errors.length < indexNames.length) {
      // Kick the worker on this node to immediately pickup the batch.
      getWorker().forceRefresh();
    }
    return response.ok({
      body: results
    });
  }));
}