"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testNowMonitorRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _uuid = require("uuid");
var _runtime_types = require("../../../common/runtime_types");
var _constants = require("../../../common/constants");
var _synthetics_monitor = require("../../legacy_uptime/lib/saved_objects/synthetics_monitor");
var _format_configs = require("../../synthetics_service/formatters/format_configs");
var _secrets = require("../../synthetics_service/utils/secrets");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const testNowMonitorRoute = () => ({
  method: 'GET',
  path: _constants.API_URLS.TRIGGER_MONITOR + '/{monitorId}',
  validate: {
    params: _configSchema.schema.object({
      monitorId: _configSchema.schema.string({
        minLength: 1,
        maxLength: 1024
      })
    })
  },
  handler: async ({
    request,
    savedObjectsClient,
    server,
    syntheticsMonitorClient
  }) => {
    const {
      monitorId
    } = request.params;
    const monitor = await savedObjectsClient.get(_synthetics_monitor.syntheticsMonitorType, monitorId);
    const encryptedClient = server.encryptedSavedObjects.getClient();
    const monitorWithSecrets = await encryptedClient.getDecryptedAsInternalUser(_synthetics_monitor.syntheticsMonitorType, monitorId);
    const normalizedMonitor = (0, _secrets.normalizeSecrets)(monitorWithSecrets);
    const {
      [_runtime_types.ConfigKey.SCHEDULE]: schedule,
      [_runtime_types.ConfigKey.LOCATIONS]: locations
    } = monitor.attributes;
    const {
      syntheticsService
    } = syntheticsMonitorClient;
    const testRunId = (0, _uuid.v4)();
    const errors = await syntheticsService.runOnceConfigs([(0, _format_configs.formatHeartbeatRequest)({
      // making it enabled, even if it's disabled in the UI
      monitor: {
        ...normalizedMonitor.attributes,
        enabled: true
      },
      monitorId,
      heartbeatId: normalizedMonitor.attributes[_runtime_types.ConfigKey.MONITOR_QUERY_ID],
      testRunId
    })]);
    if (errors && (errors === null || errors === void 0 ? void 0 : errors.length) > 0) {
      return {
        errors,
        testRunId,
        monitorId,
        schedule,
        locations
      };
    }
    return {
      testRunId,
      monitorId,
      schedule,
      locations
    };
  }
});
exports.testNowMonitorRoute = testNowMonitorRoute;