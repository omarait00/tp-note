"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNodes = void 0;
exports.registerTransformNodesRoutes = registerTransformNodesRoutes;
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _mlIsPopulatedObject = require("@kbn/ml-is-populated-object");
var _constants = require("../../../common/constants");
var _ = require("..");
var _error_utils = require("./error_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const NODE_ROLES = 'roles';
const isNodes = arg => {
  return (0, _mlIsPopulatedObject.isPopulatedObject)(arg) && Object.values(arg).every(node => (0, _mlIsPopulatedObject.isPopulatedObject)(node, [NODE_ROLES]) && Array.isArray(node.roles));
};
exports.isNodes = isNodes;
function registerTransformNodesRoutes({
  router,
  license
}) {
  /**
   * @apiGroup Transform Nodes
   *
   * @api {get} /api/transforms/_nodes Transform Nodes
   * @apiName GetTransformNodes
   * @apiDescription Get transform nodes
   */
  router.get({
    path: (0, _.addBasePath)('transforms/_nodes'),
    validate: false
  }, license.guardApiRoute(async (ctx, req, res) => {
    try {
      const esClient = (await ctx.core).elasticsearch.client;
      // If security is enabled, check that the user has at least permission to
      // view transforms before calling the _nodes endpoint with the internal user.
      if (license.getStatus().isSecurityEnabled === true) {
        const {
          has_all_requested: hasAllPrivileges
        } = await esClient.asCurrentUser.security.hasPrivileges({
          body: {
            // @ts-expect-error SecurityClusterPrivilege doesn’t contain all the priviledges
            cluster: _constants.NODES_INFO_PRIVILEGES
          }
        });
        if (!hasAllPrivileges) {
          return res.customError((0, _error_utils.wrapError)(new _boom.default.Boom('Forbidden', {
            statusCode: 403
          })));
        }
      }
      const {
        nodes
      } = await esClient.asInternalUser.nodes.info({
        filter_path: `nodes.*.${NODE_ROLES}`
      });
      let count = 0;
      if (isNodes(nodes)) {
        for (const {
          roles
        } of Object.values(nodes)) {
          if (roles.includes('transform')) {
            count++;
          }
        }
      }
      return res.ok({
        body: {
          count
        }
      });
    } catch (e) {
      return res.customError((0, _error_utils.wrapError)((0, _error_utils.wrapEsError)(e)));
    }
  }));
}