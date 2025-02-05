"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerAppRoutes = registerAppRoutes;
var _common = require("../../../common");
var _helpers = require("../helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const extractMissingPrivileges = (privilegesObject = {}) => Object.keys(privilegesObject).reduce((privileges, privilegeName) => {
  if (!privilegesObject[privilegeName]) {
    privileges.push(privilegeName);
  }
  return privileges;
}, []);
function registerAppRoutes({
  router,
  config: {
    isSecurityEnabled
  },
  license,
  lib: {
    handleEsError
  }
}) {
  router.get({
    path: (0, _helpers.addBasePath)('privileges'),
    validate: false
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      client: clusterClient
    } = (await ctx.core).elasticsearch;
    const privilegesResult = {
      hasAllPrivileges: true,
      missingPrivileges: {
        cluster: [],
        index: []
      }
    };
    if (!isSecurityEnabled()) {
      // If security isn't enabled, let the user use app.
      return res.ok({
        body: privilegesResult
      });
    }
    try {
      // Get cluster privileges
      const {
        has_all_requested: hasAllPrivileges,
        cluster
      } = await clusterClient.asCurrentUser.security.hasPrivileges({
        body: {
          // @ts-expect-error @elastic/elasticsearch doesn't declare all possible values in SecurityClusterPrivilege
          cluster: [..._common.APP_REQUIRED_CLUSTER_PRIVILEGES, ..._common.APP_SLM_CLUSTER_PRIVILEGES]
        }
      });

      // Find missing cluster privileges and set overall app privileges
      privilegesResult.missingPrivileges.cluster = extractMissingPrivileges(cluster);
      privilegesResult.hasAllPrivileges = hasAllPrivileges;

      // Get all index privileges the user has
      const {
        indices
      } = await clusterClient.asCurrentUser.security.getUserPrivileges();

      // Check if they have all the required index privileges for at least one index
      const oneIndexWithAllPrivileges = indices.find(({
        privileges
      }) => {
        if (privileges.includes('all')) {
          return true;
        }
        const indexHasAllPrivileges = _common.APP_RESTORE_INDEX_PRIVILEGES.every(privilege =>
        // @ts-expect-error SecurityClusterPrivilege doesn’t list all the possible privileges.
        privileges.includes(privilege));
        return indexHasAllPrivileges;
      });

      // If they don't, return list of required index privileges
      if (!oneIndexWithAllPrivileges) {
        privilegesResult.missingPrivileges.index = [..._common.APP_RESTORE_INDEX_PRIVILEGES];
      }
      return res.ok({
        body: privilegesResult
      });
    } catch (e) {
      return handleEsError({
        error: e,
        response: res
      });
    }
  }));
}