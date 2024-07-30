"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineCreateApiKeyRoutes = defineCreateApiKeyRoutes;
var _configSchema = require("@kbn/config-schema");
var _api_keys = require("../../authentication/api_keys");
var _errors = require("../../errors");
var _lib = require("../../lib");
var _licensed_route_handler = require("../licensed_route_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const bodySchema = _configSchema.schema.object({
  name: _configSchema.schema.string(),
  expiration: _configSchema.schema.maybe(_configSchema.schema.string()),
  role_descriptors: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.object({}, {
    unknowns: 'allow'
  }), {
    defaultValue: {}
  }),
  metadata: _configSchema.schema.maybe(_configSchema.schema.object({}, {
    unknowns: 'allow'
  }))
});
const getBodySchemaWithKibanaPrivileges = getBasePrivilegeNames => _configSchema.schema.object({
  name: _configSchema.schema.string(),
  expiration: _configSchema.schema.maybe(_configSchema.schema.string()),
  kibana_role_descriptors: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.object({
    elasticsearch: _lib.elasticsearchRoleSchema.extends({}, {
      unknowns: 'allow'
    }),
    kibana: (0, _lib.getKibanaRoleSchema)(getBasePrivilegeNames)
  })),
  metadata: _configSchema.schema.maybe(_configSchema.schema.object({}, {
    unknowns: 'allow'
  }))
});
function defineCreateApiKeyRoutes({
  router,
  authz,
  getAuthenticationService
}) {
  const bodySchemaWithKibanaPrivileges = getBodySchemaWithKibanaPrivileges(() => {
    const privileges = authz.privileges.get();
    return {
      global: Object.keys(privileges.global),
      space: Object.keys(privileges.space)
    };
  });
  router.post({
    path: '/internal/security/api_key',
    validate: {
      body: _configSchema.schema.oneOf([bodySchema, bodySchemaWithKibanaPrivileges])
    }
  }, (0, _licensed_route_handler.createLicensedRouteHandler)(async (context, request, response) => {
    try {
      const apiKey = await getAuthenticationService().apiKeys.create(request, request.body);
      if (!apiKey) {
        return response.badRequest({
          body: {
            message: `API Keys are not available`
          }
        });
      }
      return response.ok({
        body: apiKey
      });
    } catch (error) {
      if (error instanceof _api_keys.CreateApiKeyValidationError) {
        return response.badRequest({
          body: {
            message: error.message
          }
        });
      }
      return response.customError((0, _errors.wrapIntoCustomErrorResponse)(error));
    }
  }));
}