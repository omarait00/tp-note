"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerPrivilegesRoute = registerPrivilegesRoute;
var _constants = require("../../../common/constants");
var _ = require("..");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerPrivilegesRoute({
  router,
  license
}) {
  router.get({
    path: (0, _.addBasePath)('privileges'),
    validate: {}
  }, license.guardApiRoute(async (ctx, req, res) => {
    const privilegesResult = {
      hasAllPrivileges: true,
      missingPrivileges: {
        cluster: [],
        index: []
      }
    };
    if (license.getStatus().isSecurityEnabled === false) {
      // If security isn't enabled, let the user use app.
      return res.ok({
        body: privilegesResult
      });
    }
    const esClient = (await ctx.core).elasticsearch.client;
    // Get cluster privileges
    const {
      has_all_requested: hasAllPrivileges,
      cluster
    } = await esClient.asCurrentUser.security.hasPrivileges({
      body: {
        // @ts-expect-error SecurityClusterPrivilege doesn’t contain all the priviledges
        cluster: _constants.APP_CLUSTER_PRIVILEGES
      }
    });

    // Find missing cluster privileges and set overall app privileges
    privilegesResult.missingPrivileges.cluster = extractMissingPrivileges(cluster);
    privilegesResult.hasAllPrivileges = hasAllPrivileges;

    // Get all index privileges the user has
    const {
      indices
    } = await esClient.asCurrentUser.security.getUserPrivileges();

    // Check if they have all the required index privileges for at least one index
    const oneIndexWithAllPrivileges = indices.find(({
      privileges
    }) => {
      if (privileges.includes('all')) {
        return true;
      }
      const indexHasAllPrivileges = _constants.APP_INDEX_PRIVILEGES.every(privilege => privileges.includes(privilege));
      return indexHasAllPrivileges;
    });

    // If they don't, return list of required index privileges
    if (!oneIndexWithAllPrivileges) {
      privilegesResult.missingPrivileges.index = [..._constants.APP_INDEX_PRIVILEGES];
    }
    return res.ok({
      body: privilegesResult
    });
  }));
}
const extractMissingPrivileges = (privilegesObject = {}) => Object.keys(privilegesObject).reduce((privileges, privilegeName) => {
  if (!privilegesObject[privilegeName]) {
    privileges.push(privilegeName);
  }
  return privileges;
}, []);