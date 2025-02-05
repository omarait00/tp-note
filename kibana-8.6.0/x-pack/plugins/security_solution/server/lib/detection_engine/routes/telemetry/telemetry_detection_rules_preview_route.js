"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.telemetryDetectionRulesPreviewRoute = void 0;
var _constants = require("../../../../../common/constants");
var _get_detecton_rules_preview = require("./utils/get_detecton_rules_preview");
var _get_security_lists_preview = require("./utils/get_security_lists_preview");
var _get_endpoint_preview = require("./utils/get_endpoint_preview");
var _get_diagnostics_preview = require("./utils/get_diagnostics_preview");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const telemetryDetectionRulesPreviewRoute = (router, logger, telemetryReceiver, telemetrySender) => {
  router.get({
    path: _constants.SECURITY_TELEMETRY_URL,
    validate: false,
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const detectionRules = await (0, _get_detecton_rules_preview.getDetectionRulesPreview)({
      logger,
      telemetryReceiver,
      telemetrySender
    });
    const securityLists = await (0, _get_security_lists_preview.getSecurityListsPreview)({
      logger,
      telemetryReceiver,
      telemetrySender
    });
    const endpoints = await (0, _get_endpoint_preview.getEndpointPreview)({
      logger,
      telemetryReceiver,
      telemetrySender
    });
    const diagnostics = await (0, _get_diagnostics_preview.getDiagnosticsPreview)({
      logger,
      telemetryReceiver,
      telemetrySender
    });
    return response.ok({
      body: {
        detection_rules: detectionRules,
        security_lists: securityLists,
        endpoints,
        diagnostics
      }
    });
  });
};
exports.telemetryDetectionRulesPreviewRoute = telemetryDetectionRulesPreviewRoute;