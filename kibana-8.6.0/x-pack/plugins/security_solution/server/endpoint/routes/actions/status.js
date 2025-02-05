"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actionStatusRequestHandler = void 0;
exports.registerActionStatusRoutes = registerActionStatusRoutes;
var _actions = require("../../../../common/endpoint/schema/actions");
var _constants = require("../../../../common/endpoint/constants");
var _services = require("../../services");
var _with_endpoint_authz = require("../with_endpoint_authz");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Registers routes for checking status of actions
 */
function registerActionStatusRoutes(router, endpointContext) {
  // Summary of action status for a given list of endpoints
  router.get({
    path: _constants.ACTION_STATUS_ROUTE,
    validate: _actions.ActionStatusRequestSchema,
    options: {
      authRequired: true,
      tags: ['access:securitySolution']
    }
  }, (0, _with_endpoint_authz.withEndpointAuthz)({
    all: ['canReadSecuritySolution']
  }, endpointContext.logFactory.get('hostIsolationStatus'), actionStatusRequestHandler(endpointContext)));
}
const actionStatusRequestHandler = function (endpointContext) {
  const logger = endpointContext.logFactory.get('actionStatusApi');
  return async (context, req, res) => {
    const esClient = (await context.core).elasticsearch.client.asInternalUser;
    const agentIDs = Array.isArray(req.query.agent_ids) ? [...new Set(req.query.agent_ids)] : [req.query.agent_ids];
    const response = await (0, _services.getPendingActionsSummary)(esClient, endpointContext.service.getEndpointMetadataService(), logger, agentIDs, endpointContext.experimentalFeatures.pendingActionResponsesWithAck);
    return res.ok({
      body: {
        data: response
      }
    });
  };
};
exports.actionStatusRequestHandler = actionStatusRequestHandler;