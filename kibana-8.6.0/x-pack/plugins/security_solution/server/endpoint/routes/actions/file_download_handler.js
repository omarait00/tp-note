"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerActionFileDownloadRoutes = exports.getActionFileDownloadRouteHandler = void 0;
var _get_file_download_id = require("../../../../common/endpoint/service/response_actions/get_file_download_id");
var _services = require("../../services");
var _error_handler = require("../error_handler");
var _constants = require("../../../../common/endpoint/constants");
var _actions = require("../../../../common/endpoint/schema/actions");
var _with_endpoint_authz = require("../with_endpoint_authz");
var _custom_http_request_error = require("../../../utils/custom_http_request_error");
var _action_files = require("../../services/actions/action_files");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const registerActionFileDownloadRoutes = (router, endpointContext) => {
  const logger = endpointContext.logFactory.get('actionFileDownload');
  router.get({
    path: _constants.ACTION_AGENT_FILE_DOWNLOAD_ROUTE,
    validate: _actions.EndpointActionFileDownloadSchema,
    options: {
      authRequired: true,
      tags: ['access:securitySolution']
    }
  }, (0, _with_endpoint_authz.withEndpointAuthz)({
    all: ['canWriteFileOperations']
  }, logger, getActionFileDownloadRouteHandler(endpointContext)));
};
exports.registerActionFileDownloadRoutes = registerActionFileDownloadRoutes;
const getActionFileDownloadRouteHandler = endpointContext => {
  const logger = endpointContext.logFactory.get('actionFileDownload');
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
      const fileDownloadId = (0, _get_file_download_id.getFileDownloadId)(actionDetails, agentId);
      const {
        stream,
        fileName
      } = await (0, _action_files.getFileDownloadStream)(esClient, logger, fileDownloadId);
      return res.ok({
        body: stream,
        headers: {
          'content-type': 'application/octet-stream',
          'cache-control': 'max-age=31536000, immutable',
          // Note, this name can be overridden by the client if set via a "download" attribute on the HTML tag.
          'content-disposition': `attachment; filename="${fileName !== null && fileName !== void 0 ? fileName : 'download.zip'}"`,
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
          'x-content-type-options': 'nosniff'
        }
      });
    } catch (error) {
      return (0, _error_handler.errorHandler)(logger, res, error);
    }
  };
};
exports.getActionFileDownloadRouteHandler = getActionFileDownloadRouteHandler;