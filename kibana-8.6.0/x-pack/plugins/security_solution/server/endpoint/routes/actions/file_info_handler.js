"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerActionFileInfoRoute = exports.getActionFileInfoRouteHandler = void 0;
var _action_files = require("../../services/actions/action_files");
var _services = require("../../services");
var _constants = require("../../../../common/endpoint/constants");
var _actions = require("../../../../common/endpoint/schema/actions");
var _with_endpoint_authz = require("../with_endpoint_authz");
var _custom_http_request_error = require("../../../utils/custom_http_request_error");
var _get_file_download_id = require("../../../../common/endpoint/service/response_actions/get_file_download_id");
var _error_handler = require("../error_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getActionFileInfoRouteHandler = endpointContext => {
  const logger = endpointContext.logFactory.get('actionFileInfo');
  return async (context, req, res) => {
    const {
      action_id: actionId,
      agent_id: agentId
    } = req.params;
    const esClient = (await context.core).elasticsearch.client.asInternalUser;
    const endpointMetadataService = endpointContext.service.getEndpointMetadataService();
    try {
      // Ensure action id is valid and that it was sent to the Agent ID requested.
      const actionDetails = await (0, _services.getActionDetailsById)(esClient, endpointMetadataService, actionId);
      if (!actionDetails.agents.includes(agentId)) {
        throw new _custom_http_request_error.CustomHttpRequestError(`Action was not sent to agent id [${agentId}]`, 400);
      }
      const fileId = (0, _get_file_download_id.getFileDownloadId)(actionDetails, agentId);
      return res.ok({
        body: {
          data: await (0, _action_files.getFileInfo)(esClient, logger, fileId)
        }
      });
    } catch (error) {
      return (0, _error_handler.errorHandler)(logger, res, error);
    }
  };
};
exports.getActionFileInfoRouteHandler = getActionFileInfoRouteHandler;
const registerActionFileInfoRoute = (router, endpointContext) => {
  router.get({
    path: _constants.ACTION_AGENT_FILE_INFO_ROUTE,
    validate: _actions.EndpointActionFileInfoSchema,
    options: {
      authRequired: true,
      tags: ['access:securitySolution']
    }
  }, (0, _with_endpoint_authz.withEndpointAuthz)({
    all: ['canWriteFileOperations']
  }, endpointContext.logFactory.get('actionFileInfo'), getActionFileInfoRouteHandler(endpointContext)));
};
exports.registerActionFileInfoRoute = registerActionFileInfoRoute;