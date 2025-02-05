"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.definePutRolesRoutes = definePutRolesRoutes;
var _configSchema = require("@kbn/config-schema");
var _errors = require("../../../errors");
var _lib = require("../../../lib");
var _licensed_route_handler = require("../../licensed_route_handler");
var _model = require("./model");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const roleGrantsSubFeaturePrivileges = (features, role) => {
  if (!role.kibana) {
    return false;
  }
  const subFeaturePrivileges = new Map(features.map(feature => [feature.id, feature.subFeatures.map(sf => sf.privilegeGroups.map(pg => pg.privileges)).flat(2)]));
  const hasAnySubFeaturePrivileges = role.kibana.some(kibanaPrivilege => {
    var _kibanaPrivilege$feat;
    return Object.entries((_kibanaPrivilege$feat = kibanaPrivilege.feature) !== null && _kibanaPrivilege$feat !== void 0 ? _kibanaPrivilege$feat : {}).some(([featureId, privileges]) => {
      var _subFeaturePrivileges;
      return !!((_subFeaturePrivileges = subFeaturePrivileges.get(featureId)) !== null && _subFeaturePrivileges !== void 0 && _subFeaturePrivileges.some(({
        id
      }) => privileges.includes(id)));
    });
  });
  return hasAnySubFeaturePrivileges;
};
function definePutRolesRoutes({
  router,
  authz,
  getFeatures,
  getFeatureUsageService
}) {
  router.put({
    path: '/api/security/role/{name}',
    validate: {
      params: _configSchema.schema.object({
        name: _configSchema.schema.string({
          minLength: 1,
          maxLength: 1024
        })
      }),
      query: _configSchema.schema.object({
        createOnly: _configSchema.schema.boolean({
          defaultValue: false
        })
      }),
      body: (0, _model.getPutPayloadSchema)(() => {
        const privileges = authz.privileges.get();
        return {
          global: Object.keys(privileges.global),
          space: Object.keys(privileges.space)
        };
      })
    }
  }, (0, _licensed_route_handler.createLicensedRouteHandler)(async (context, request, response) => {
    const {
      name
    } = request.params;
    const {
      createOnly
    } = request.query;
    try {
      const esClient = (await context.core).elasticsearch.client;
      const [features, rawRoles] = await Promise.all([getFeatures(), esClient.asCurrentUser.security.getRole({
        name: request.params.name
      }, {
        ignore: [404]
      })]);
      const {
        validationErrors
      } = (0, _lib.validateKibanaPrivileges)(features, request.body.kibana);
      if (validationErrors.length) {
        return response.badRequest({
          body: {
            message: `Role cannot be updated due to validation errors: ${JSON.stringify(validationErrors)}`
          }
        });
      }
      if (createOnly && !!rawRoles[name]) {
        return response.conflict({
          body: {
            message: `Role already exists and cannot be created: ${name}`
          }
        });
      }
      const body = (0, _model.transformPutPayloadToElasticsearchRole)(request.body, authz.applicationName, rawRoles[name] ? rawRoles[name].applications : []);
      await esClient.asCurrentUser.security.putRole({
        name: request.params.name,
        // @ts-expect-error RoleIndexPrivilege is not compatible. grant is required in IndicesPrivileges.field_security
        body
      });
      if (roleGrantsSubFeaturePrivileges(features, request.body)) {
        getFeatureUsageService().recordSubFeaturePrivilegeUsage();
      }
      return response.noContent();
    } catch (error) {
      return response.customError((0, _errors.wrapIntoCustomErrorResponse)(error));
    }
  }));
}