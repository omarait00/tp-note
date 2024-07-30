"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerActionListRoutes = registerActionListRoutes;
var _constants = require("../../../../common/endpoint/constants");
var _actions = require("../../../../common/endpoint/schema/actions");
var _list_handler = require("./list_handler");
var _with_endpoint_authz = require("../with_endpoint_authz");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Registers the endpoint activity_log route
 */
function registerActionListRoutes(router, endpointContext) {
  router.get({
    path: _constants.ENDPOINTS_ACTION_LIST_ROUTE,
    validate: _actions.EndpointActionListRequestSchema,
    options: {
      authRequired: true,
      tags: ['access:securitySolution']
    }
  }, (0, _with_endpoint_authz.withEndpointAuthz)({
    any: ['canReadActionsLogManagement', 'canAccessEndpointActionsLogManagement']
  }, endpointContext.logFactory.get('endpointActionList'), (0, _list_handler.actionListHandler)(endpointContext)));
}