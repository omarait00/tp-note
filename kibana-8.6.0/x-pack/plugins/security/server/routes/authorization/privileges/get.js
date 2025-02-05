"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineGetPrivilegesRoutes = defineGetPrivilegesRoutes;
var _configSchema = require("@kbn/config-schema");
var _licensed_route_handler = require("../../licensed_route_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function defineGetPrivilegesRoutes({
  router,
  authz
}) {
  router.get({
    path: '/api/security/privileges',
    validate: {
      query: _configSchema.schema.object({
        // We don't use `schema.boolean` here, because all query string parameters are treated as
        // strings and @kbn/config-schema doesn't coerce strings to booleans.
        includeActions: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal('true'), _configSchema.schema.literal('false')])),
        respectLicenseLevel: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal('true'), _configSchema.schema.literal('false')]))
      })
    }
  }, (0, _licensed_route_handler.createLicensedRouteHandler)((context, request, response) => {
    const respectLicenseLevel = request.query.respectLicenseLevel !== 'false'; // if undefined resolve to true by default
    const privileges = authz.privileges.get(respectLicenseLevel);
    const includeActions = request.query.includeActions === 'true';
    const privilegesResponseBody = includeActions ? privileges : {
      global: Object.keys(privileges.global),
      space: Object.keys(privileges.space),
      features: Object.entries(privileges.features).reduce((acc, [featureId, featurePrivileges]) => {
        return {
          ...acc,
          [featureId]: Object.keys(featurePrivileges)
        };
      }, {}),
      reserved: Object.keys(privileges.reserved)
    };
    return response.ok({
      body: privilegesResponseBody
    });
  }));
}