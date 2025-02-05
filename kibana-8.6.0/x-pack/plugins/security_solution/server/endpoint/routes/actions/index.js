"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerActionRoutes = registerActionRoutes;
var _file_info_handler = require("./file_info_handler");
var _file_download_handler = require("./file_download_handler");
var _details = require("./details");
var _status = require("./status");
var _audit_log = require("./audit_log");
var _list = require("./list");
var _response_actions = require("./response_actions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// wrap route registration

function registerActionRoutes(router, endpointContext) {
  (0, _status.registerActionStatusRoutes)(router, endpointContext);
  (0, _audit_log.registerActionAuditLogRoutes)(router, endpointContext);
  (0, _list.registerActionListRoutes)(router, endpointContext);
  (0, _details.registerActionDetailsRoutes)(router, endpointContext);
  (0, _response_actions.registerResponseActionRoutes)(router, endpointContext);

  // APIs specific to `get-file` are behind FF
  if (endpointContext.experimentalFeatures.responseActionGetFileEnabled) {
    (0, _file_download_handler.registerActionFileDownloadRoutes)(router, endpointContext);
    (0, _file_info_handler.registerActionFileInfoRoute)(router, endpointContext);
  }
}