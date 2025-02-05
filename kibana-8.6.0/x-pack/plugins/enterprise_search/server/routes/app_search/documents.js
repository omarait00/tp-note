"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDocumentRoutes = registerDocumentRoutes;
exports.registerDocumentsRoutes = registerDocumentsRoutes;
var _configSchema = require("@kbn/config-schema");
var _route_config_helpers = require("../../lib/route_config_helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerDocumentsRoutes({
  router,
  enterpriseSearchRequestHandler
}) {
  router.post((0, _route_config_helpers.skipBodyValidation)({
    path: '/internal/app_search/engines/{engineName}/documents',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string()
      })
    }
  }), enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:engineName/documents/new'
  }));
}
function registerDocumentRoutes({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/internal/app_search/engines/{engineName}/documents/{documentId}',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string(),
        documentId: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:engineName/documents/:documentId'
  }));
  router.delete({
    path: '/internal/app_search/engines/{engineName}/documents/{documentId}',
    validate: {
      params: _configSchema.schema.object({
        engineName: _configSchema.schema.string(),
        documentId: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/as/engines/:engineName/documents/:documentId'
  }));
}