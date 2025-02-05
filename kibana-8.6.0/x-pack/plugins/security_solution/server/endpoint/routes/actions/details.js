"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerActionDetailsRoutes = exports.getActionDetailsRequestHandler = void 0;
var _constants = require("../../../../common/endpoint/constants");
var _actions = require("../../../../common/endpoint/schema/actions");
var _with_endpoint_authz = require("../with_endpoint_authz");
var _services = require("../../services");
var _error_handler = require("../error_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Registers the route for handling retrieval of Action Details
 * @param router
 * @param endpointContext
 */
const registerActionDetailsRoutes = (router, endpointContext) => {
  // Details for a given action id
  router.get({
    path: _constants.ACTION_DETAILS_ROUTE,
    validate: _actions.ActionDetailsRequestSchema,
    options: {
      authRequired: true,
      tags: ['access:securitySolution']
    }
  }, (0, _with_endpoint_authz.withEndpointAuthz)({
    all: ['canReadSecuritySolution']
  }, endpointContext.logFactory.get('hostIsolationDetails'), getActionDetailsRequestHandler(endpointContext)));
};
exports.registerActionDetailsRoutes = registerActionDetailsRoutes;
const getActionDetailsRequestHandler = endpointContext => {
  return async (context, req, res) => {
    try {
      return res.ok({
        body: {
          data: await (0, _services.getActionDetailsById)((await context.core).elasticsearch.client.asInternalUser, endpointContext.service.getEndpointMetadataService(), req.params.action_id)
        }
      });
    } catch (error) {
      return (0, _error_handler.errorHandler)(endpointContext.logFactory.get('EndpointActionDetails'), res, error);
    }
  };
};
exports.getActionDetailsRequestHandler = getActionDetailsRequestHandler;