"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineRoleMappingGetRoutes = defineRoleMappingGetRoutes;
var _configSchema = require("@kbn/config-schema");
var _errors = require("../../errors");
var _licensed_route_handler = require("../licensed_route_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function defineRoleMappingGetRoutes(params) {
  const {
    logger,
    router
  } = params;
  router.get({
    path: '/internal/security/role_mapping/{name?}',
    validate: {
      params: _configSchema.schema.object({
        name: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, (0, _licensed_route_handler.createLicensedRouteHandler)(async (context, request, response) => {
    const expectSingleEntity = typeof request.params.name === 'string';
    try {
      const esClient = (await context.core).elasticsearch.client;
      const roleMappingsResponse = await esClient.asCurrentUser.security.getRoleMapping({
        name: request.params.name
      });
      const mappings = Object.entries(roleMappingsResponse).map(([name, mapping]) => {
        return {
          name,
          ...mapping,
          // @ts-expect-error @elastic/elasticsearch `SecurityRoleMapping` doeesn't contain `role_templates`
          role_templates: (mapping.role_templates || []).map(entry => {
            return {
              ...entry,
              template: tryParseRoleTemplate(entry.template)
            };
          })
        };
      });
      if (expectSingleEntity) {
        return response.ok({
          body: mappings[0]
        });
      }
      return response.ok({
        body: mappings
      });
    } catch (error) {
      const wrappedError = (0, _errors.wrapError)(error);
      return response.customError({
        body: wrappedError,
        statusCode: wrappedError.output.statusCode
      });
    }
  }));

  /**
   * While role templates are normally persisted as objects via the create API, they are stored internally as strings.
   * As a result, the ES APIs to retrieve role mappings represent the templates as strings, so we have to attempt
   * to parse them back out. ES allows for invalid JSON to be stored, so we have to account for that as well.
   *
   * @param roleTemplate the string-based template to parse
   */
  function tryParseRoleTemplate(roleTemplate) {
    try {
      return JSON.parse(roleTemplate);
    } catch (e) {
      logger.debug(`Role template is not valid JSON: ${e}`);
      return roleTemplate;
    }
  }
}