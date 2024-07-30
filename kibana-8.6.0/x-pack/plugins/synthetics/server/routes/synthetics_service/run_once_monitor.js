"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runOnceSyntheticsMonitorRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _constants = require("../../../common/constants");
var _format_configs = require("../../synthetics_service/formatters/format_configs");
var _monitor_validation = require("../monitor_cruds/monitor_validation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const runOnceSyntheticsMonitorRoute = () => ({
  method: 'POST',
  path: _constants.API_URLS.RUN_ONCE_MONITOR + '/{monitorId}',
  validate: {
    body: _configSchema.schema.any(),
    params: _configSchema.schema.object({
      monitorId: _configSchema.schema.string({
        minLength: 1,
        maxLength: 1024
      })
    })
  },
  handler: async ({
    request,
    response,
    server,
    syntheticsMonitorClient
  }) => {
    const monitor = request.body;
    const {
      monitorId
    } = request.params;
    const validationResult = (0, _monitor_validation.validateMonitor)(monitor);
    if (!validationResult.valid || !validationResult.decodedMonitor) {
      const {
        reason: message,
        details,
        payload
      } = validationResult;
      return response.badRequest({
        body: {
          message,
          attributes: {
            details,
            ...payload
          }
        }
      });
    }
    const {
      syntheticsService
    } = syntheticsMonitorClient;
    const errors = await syntheticsService.runOnceConfigs([(0, _format_configs.formatHeartbeatRequest)({
      // making it enabled, even if it's disabled in the UI
      monitor: {
        ...validationResult.decodedMonitor,
        enabled: true
      },
      monitorId,
      heartbeatId: monitorId,
      runOnce: true
    })]);
    if (errors) {
      return {
        errors
      };
    }
    return monitor;
  }
});
exports.runOnceSyntheticsMonitorRoute = runOnceSyntheticsMonitorRoute;