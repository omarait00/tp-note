"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syncNewMonitor = exports.getMonitorNamespace = exports.createNewSavedObjectMonitor = exports.addSyntheticsMonitorRoute = void 0;
var _uuid = require("uuid");
var _configSchema = require("@kbn/config-schema");
var _server = require("../../../../../../src/core/server");
var _common = require("../../../../fleet/common");
var _private_locations = require("../../legacy_uptime/lib/saved_objects/private_locations");
var _runtime_types = require("../../../common/runtime_types");
var _formatters = require("../../../common/formatters");
var _constants = require("../../../common/constants");
var _monitor_defaults = require("../../../common/constants/monitor_defaults");
var _synthetics_monitor = require("../../legacy_uptime/lib/saved_objects/synthetics_monitor");
var _monitor_validation = require("./monitor_validation");
var _monitor_upgrade_sender = require("../telemetry/monitor_upgrade_sender");
var _secrets = require("../../synthetics_service/utils/secrets");
var _delete_monitor = require("./delete_monitor");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const addSyntheticsMonitorRoute = () => ({
  method: 'POST',
  path: _constants.API_URLS.SYNTHETICS_MONITORS,
  validate: {
    body: _configSchema.schema.any(),
    query: _configSchema.schema.object({
      id: _configSchema.schema.maybe(_configSchema.schema.string()),
      preserve_namespace: _configSchema.schema.maybe(_configSchema.schema.boolean())
    })
  },
  handler: async ({
    request,
    response,
    savedObjectsClient,
    server,
    syntheticsMonitorClient
  }) => {
    // usually id is auto generated, but this is useful for testing
    const {
      id
    } = request.query;
    const spaceId = server.spaces.spacesService.getSpaceId(request);
    const monitor = request.body;
    const monitorType = monitor[_runtime_types.ConfigKey.MONITOR_TYPE];
    const monitorWithDefaults = {
      ..._monitor_defaults.DEFAULT_FIELDS[monitorType],
      ...monitor
    };
    const validationResult = (0, _monitor_validation.validateMonitor)(monitorWithDefaults);
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
    const privateLocations = await (0, _private_locations.getSyntheticsPrivateLocations)(savedObjectsClient);
    try {
      const {
        errors,
        newMonitor
      } = await syncNewMonitor({
        normalizedMonitor: validationResult.decodedMonitor,
        server,
        syntheticsMonitorClient,
        savedObjectsClient,
        request,
        id,
        privateLocations,
        spaceId
      });
      if (errors && errors.length > 0) {
        return response.ok({
          body: {
            message: 'error pushing monitor to the service',
            attributes: {
              errors
            },
            id: newMonitor.id
          }
        });
      }
      return response.ok({
        body: newMonitor
      });
    } catch (getErr) {
      server.logger.error(getErr);
      if (_server.SavedObjectsErrorHelpers.isForbiddenError(getErr)) {
        return response.forbidden({
          body: getErr
        });
      }
      return response.customError({
        body: {
          message: 'Unable to create monitor'
        },
        statusCode: 500
      });
    }
  }
});
exports.addSyntheticsMonitorRoute = addSyntheticsMonitorRoute;
const createNewSavedObjectMonitor = async ({
  id,
  savedObjectsClient,
  normalizedMonitor
}) => {
  return await savedObjectsClient.create(_synthetics_monitor.syntheticsMonitorType, (0, _secrets.formatSecrets)({
    ...normalizedMonitor,
    [_runtime_types.ConfigKey.MONITOR_QUERY_ID]: normalizedMonitor[_runtime_types.ConfigKey.CUSTOM_HEARTBEAT_ID] || id,
    [_runtime_types.ConfigKey.CONFIG_ID]: id,
    revision: 1
  }), id ? {
    id,
    overwrite: true
  } : undefined);
};
exports.createNewSavedObjectMonitor = createNewSavedObjectMonitor;
const syncNewMonitor = async ({
  id,
  server,
  syntheticsMonitorClient,
  savedObjectsClient,
  request,
  normalizedMonitor,
  privateLocations,
  spaceId
}) => {
  const newMonitorId = id !== null && id !== void 0 ? id : (0, _uuid.v4)();
  const {
    preserve_namespace: preserveNamespace
  } = request.query;
  let monitorSavedObject = null;
  const monitorWithNamespace = {
    ...normalizedMonitor,
    [_runtime_types.ConfigKey.MONITOR_QUERY_ID]: normalizedMonitor[_runtime_types.ConfigKey.CUSTOM_HEARTBEAT_ID] || newMonitorId,
    [_runtime_types.ConfigKey.CONFIG_ID]: newMonitorId,
    [_runtime_types.ConfigKey.NAMESPACE]: preserveNamespace ? normalizedMonitor[_runtime_types.ConfigKey.NAMESPACE] : getMonitorNamespace(server, request, normalizedMonitor[_runtime_types.ConfigKey.NAMESPACE])
  };
  try {
    const newMonitorPromise = createNewSavedObjectMonitor({
      normalizedMonitor: monitorWithNamespace,
      id: newMonitorId,
      savedObjectsClient
    });
    const syncErrorsPromise = syntheticsMonitorClient.addMonitors([{
      monitor: monitorWithNamespace,
      id: newMonitorId
    }], request, savedObjectsClient, privateLocations, spaceId);
    const [monitorSavedObjectN, {
      syncErrors
    }] = await Promise.all([newMonitorPromise, syncErrorsPromise]);
    monitorSavedObject = monitorSavedObjectN;
    (0, _monitor_upgrade_sender.sendTelemetryEvents)(server.logger, server.telemetry, (0, _monitor_upgrade_sender.formatTelemetryEvent)({
      errors: syncErrors,
      monitor: monitorSavedObject,
      isInlineScript: Boolean(normalizedMonitor[_runtime_types.ConfigKey.SOURCE_INLINE]),
      stackVersion: server.stackVersion
    }));
    return {
      errors: syncErrors,
      newMonitor: monitorSavedObject
    };
  } catch (e) {
    var _monitorSavedObject;
    if ((_monitorSavedObject = monitorSavedObject) !== null && _monitorSavedObject !== void 0 && _monitorSavedObject.id) {
      await (0, _delete_monitor.deleteMonitor)({
        savedObjectsClient,
        server,
        monitorId: newMonitorId,
        syntheticsMonitorClient,
        request
      });
    }
    server.logger.error(e);
    throw e;
  }
};
exports.syncNewMonitor = syncNewMonitor;
const getMonitorNamespace = (server, request, configuredNamespace) => {
  const spaceId = server.spaces.spacesService.getSpaceId(request);
  const kibanaNamespace = (0, _formatters.formatKibanaNamespace)(spaceId);
  const namespace = configuredNamespace === _monitor_defaults.DEFAULT_NAMESPACE_STRING ? kibanaNamespace : configuredNamespace;
  const {
    error
  } = (0, _common.isValidNamespace)(namespace);
  if (error) {
    throw new Error(`Cannot save monitor. Monitor namespace is invalid: ${error}`);
  }
  return namespace;
};
exports.getMonitorNamespace = getMonitorNamespace;