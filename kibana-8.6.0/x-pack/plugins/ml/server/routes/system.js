"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.systemRoutes = systemRoutes;
var _configSchema = require("@kbn/config-schema");
var _error_wrapper = require("../client/error_wrapper");
var _log = require("../lib/log");
var _capabilities = require("../lib/capabilities");
var _spaces_utils = require("../lib/spaces_utils");
var _node_utils = require("../lib/node_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * System routes
 */
function systemRoutes({
  router,
  mlLicense,
  routeGuard
}, {
  getSpaces,
  cloud,
  resolveMlCapabilities
}) {
  /**
   * @apiGroup SystemRoutes
   *
   * @api {post} /api/ml/_has_privileges Check privileges
   * @apiName HasPrivileges
   * @apiDescription Checks if the user has required privileges
   */
  router.post({
    path: '/api/ml/_has_privileges',
    validate: {
      body: _configSchema.schema.maybe(_configSchema.schema.any())
    },
    options: {
      tags: ['access:ml:canAccessML']
    }
  }, routeGuard.basicLicenseAPIGuard(async ({
    mlClient,
    client,
    request,
    response
  }) => {
    try {
      const {
        asCurrentUser
      } = client;
      let upgradeInProgress = false;
      try {
        const body = await mlClient.info();
        // if ml indices are currently being migrated, upgrade_mode will be set to true
        // pass this back with the privileges to allow for the disabling of UI controls.
        upgradeInProgress = body.upgrade_mode === true;
      } catch (error) {
        // if the ml.info check fails, it could be due to the user having insufficient privileges
        // most likely they do not have the ml_user role and therefore will be blocked from using
        // ML at all. However, we need to catch this error so the privilege check doesn't fail.
        if (error.status === 403) {
          _log.mlLog.info('Unable to determine whether upgrade is being performed due to insufficient user privileges');
        } else {
          _log.mlLog.warn('Unable to determine whether upgrade is being performed');
        }
      }
      if (mlLicense.isSecurityEnabled() === false) {
        // if xpack.security.enabled has been explicitly set to false
        // return that security is disabled and don't call the privilegeCheck endpoint
        return response.ok({
          body: {
            securityDisabled: true,
            upgradeInProgress
          }
        });
      } else {
        const body = await asCurrentUser.security.hasPrivileges({
          body: request.body
        });
        return response.ok({
          body: {
            ...body,
            upgradeInProgress
          }
        });
      }
    } catch (error) {
      return response.customError((0, _error_wrapper.wrapError)(error));
    }
  }));

  /**
   * @apiGroup SystemRoutes
   *
   * @api {get} /api/ml/ml_capabilities Check ML capabilities
   * @apiName MlCapabilitiesResponse
   * @apiDescription Checks ML capabilities
   */
  router.get({
    path: '/api/ml/ml_capabilities',
    validate: false
  }, routeGuard.basicLicenseAPIGuard(async ({
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        isMlEnabledInSpace
      } = (0, _spaces_utils.spacesUtilsProvider)(getSpaces, request);
      const mlCapabilities = await resolveMlCapabilities(request);
      if (mlCapabilities === null) {
        return response.customError((0, _error_wrapper.wrapError)(new Error('resolveMlCapabilities is not defined')));
      }
      const {
        getCapabilities
      } = (0, _capabilities.capabilitiesProvider)(mlClient, mlCapabilities, mlLicense, isMlEnabledInSpace);
      return response.ok({
        body: await getCapabilities()
      });
    } catch (error) {
      return response.customError((0, _error_wrapper.wrapError)(error));
    }
  }));

  /**
   * @apiGroup SystemRoutes
   *
   * @api {get} /api/ml/ml_node_count Get the amount of ML nodes
   * @apiName MlNodeCount
   * @apiDescription Returns the amount of ML nodes.
   */
  router.get({
    path: '/api/ml/ml_node_count',
    validate: false,
    options: {
      tags: ['access:ml:canGetJobs', 'access:ml:canGetDatafeeds']
    }
  }, routeGuard.basicLicenseAPIGuard(async ({
    client,
    response
  }) => {
    try {
      return response.ok({
        body: await (0, _node_utils.getMlNodeCount)(client)
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup SystemRoutes
   *
   * @api {get} /api/ml/info Get ML info
   * @apiName MlInfo
   * @apiDescription Returns defaults and limits used by machine learning.
   */
  router.get({
    path: '/api/ml/info',
    validate: false,
    options: {
      tags: ['access:ml:canAccessML']
    }
  }, routeGuard.basicLicenseAPIGuard(async ({
    mlClient,
    response
  }) => {
    try {
      const body = await mlClient.info();
      const cloudId = cloud === null || cloud === void 0 ? void 0 : cloud.cloudId;
      const isCloudTrial = (cloud === null || cloud === void 0 ? void 0 : cloud.trialEndDate) && Date.now() < cloud.trialEndDate.getTime();
      return response.ok({
        body: {
          ...body,
          cloudId,
          isCloudTrial
        }
      });
    } catch (error) {
      return response.customError((0, _error_wrapper.wrapError)(error));
    }
  }));

  /**
   * @apiGroup SystemRoutes
   *
   * @apiDeprecated
   *
   * @api {post} /api/ml/es_search ES Search wrapper
   * @apiName MlEsSearch
   */
  router.post({
    path: '/api/ml/es_search',
    validate: {
      body: _configSchema.schema.maybe(_configSchema.schema.any())
    },
    options: {
      tags: ['access:ml:canGetJobs']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    request,
    response
  }) => {
    try {
      const body = await client.asCurrentUser.search(request.body);
      return response.ok({
        body
      });
    } catch (error) {
      return response.customError((0, _error_wrapper.wrapError)(error));
    }
  }));

  /**
   * @apiGroup SystemRoutes
   *
   * @api {post} /api/ml/index_exists ES Field caps wrapper checks if index exists
   * @apiName MlIndexExists
   */
  router.post({
    path: '/api/ml/index_exists',
    validate: {
      body: _configSchema.schema.object({
        indices: _configSchema.schema.arrayOf(_configSchema.schema.string())
      })
    },
    options: {
      tags: ['access:ml:canAccessML']
    }
  }, routeGuard.basicLicenseAPIGuard(async ({
    client,
    request,
    response
  }) => {
    try {
      const {
        indices
      } = request.body;
      const results = await Promise.all(indices.map(async index => client.asCurrentUser.indices.exists({
        index,
        allow_no_indices: false
      })));
      const result = indices.reduce((acc, cur, i) => {
        acc[cur] = {
          exists: results[i]
        };
        return acc;
      }, {});
      return response.ok({
        body: result
      });
    } catch (error) {
      return response.customError((0, _error_wrapper.wrapError)(error));
    }
  }));
}