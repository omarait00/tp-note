"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProjectMonitorFormatter = exports.INSUFFICIENT_FLEET_PERMISSIONS = exports.FAILED_TO_UPDATE_MONITORS = exports.FAILED_TO_UPDATE_MONITOR = exports.CANNOT_UPDATE_MONITOR_TO_DIFFERENT_TYPE = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _pMap = _interopRequireDefault(require("p-map"));
var _i18n = require("@kbn/i18n");
var _get_all_locations = require("../get_all_locations");
var _add_monitor_bulk = require("../../routes/monitor_cruds/bulk_cruds/add_monitor_bulk");
var _edit_monitor_bulk = require("../../routes/monitor_cruds/bulk_cruds/edit_monitor_bulk");
var _runtime_types = require("../../../common/runtime_types");
var _synthetics_monitor = require("../../legacy_uptime/lib/saved_objects/synthetics_monitor");
var _secrets = require("../utils/secrets");
var _monitor_validation = require("../../routes/monitor_cruds/monitor_validation");
var _normalizers = require("./normalizers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const INSUFFICIENT_FLEET_PERMISSIONS = _i18n.i18n.translate('xpack.synthetics.service.projectMonitors.insufficientFleetPermissions', {
  defaultMessage: 'Insufficient permissions. In order to configure private locations, you must have Fleet and Integrations write permissions. To resolve, please generate a new API key with a user who has Fleet and Integrations write permissions.'
});
exports.INSUFFICIENT_FLEET_PERMISSIONS = INSUFFICIENT_FLEET_PERMISSIONS;
const CANNOT_UPDATE_MONITOR_TO_DIFFERENT_TYPE = _i18n.i18n.translate('xpack.synthetics.service.projectMonitors.cannotUpdateMonitorToDifferentType', {
  defaultMessage: 'Cannot update monitor to different type.'
});
exports.CANNOT_UPDATE_MONITOR_TO_DIFFERENT_TYPE = CANNOT_UPDATE_MONITOR_TO_DIFFERENT_TYPE;
const FAILED_TO_UPDATE_MONITOR = _i18n.i18n.translate('xpack.synthetics.service.projectMonitors.failedToUpdateMonitor', {
  defaultMessage: 'Failed to create or update monitor'
});
exports.FAILED_TO_UPDATE_MONITOR = FAILED_TO_UPDATE_MONITOR;
const FAILED_TO_UPDATE_MONITORS = _i18n.i18n.translate('xpack.synthetics.service.projectMonitors.failedToUpdateMonitors', {
  defaultMessage: 'Failed to create or update monitors'
});
exports.FAILED_TO_UPDATE_MONITORS = FAILED_TO_UPDATE_MONITORS;
class ProjectMonitorFormatter {
  constructor({
    savedObjectsClient,
    encryptedSavedObjectsClient,
    projectId,
    spaceId,
    monitors: _monitors,
    server,
    syntheticsMonitorClient,
    request
  }) {
    (0, _defineProperty2.default)(this, "projectId", void 0);
    (0, _defineProperty2.default)(this, "spaceId", void 0);
    (0, _defineProperty2.default)(this, "publicLocations", void 0);
    (0, _defineProperty2.default)(this, "privateLocations", void 0);
    (0, _defineProperty2.default)(this, "savedObjectsClient", void 0);
    (0, _defineProperty2.default)(this, "encryptedSavedObjectsClient", void 0);
    (0, _defineProperty2.default)(this, "monitors", []);
    (0, _defineProperty2.default)(this, "createdMonitors", []);
    (0, _defineProperty2.default)(this, "updatedMonitors", []);
    (0, _defineProperty2.default)(this, "failedMonitors", []);
    (0, _defineProperty2.default)(this, "server", void 0);
    (0, _defineProperty2.default)(this, "projectFilter", void 0);
    (0, _defineProperty2.default)(this, "syntheticsMonitorClient", void 0);
    (0, _defineProperty2.default)(this, "request", void 0);
    (0, _defineProperty2.default)(this, "writeIntegrationPoliciesPermissions", void 0);
    (0, _defineProperty2.default)(this, "init", async () => {
      const locationsPromise = (0, _get_all_locations.getAllLocations)(this.server, this.syntheticsMonitorClient, this.savedObjectsClient);
      const existingMonitorsPromise = this.getProjectMonitorsForProject();
      const [locations, existingMonitors] = await Promise.all([locationsPromise, existingMonitorsPromise]);
      const {
        publicLocations,
        privateLocations
      } = locations;
      this.publicLocations = publicLocations;
      this.privateLocations = privateLocations;
      return existingMonitors;
    });
    (0, _defineProperty2.default)(this, "configureAllProjectMonitors", async () => {
      const existingMonitors = await this.init();
      const normalizedNewMonitors = [];
      const normalizedUpdateMonitors = [];
      for (const monitor of this.monitors) {
        const previousMonitor = existingMonitors.find(monitorObj => monitorObj.attributes[_runtime_types.ConfigKey.JOURNEY_ID] === monitor.id);
        const normM = await this.validateProjectMonitor({
          monitor
        });
        if (normM) {
          if (previousMonitor && previousMonitor.attributes[_runtime_types.ConfigKey.MONITOR_TYPE] !== normM[_runtime_types.ConfigKey.MONITOR_TYPE]) {
            this.failedMonitors.push({
              reason: CANNOT_UPDATE_MONITOR_TO_DIFFERENT_TYPE,
              details: _i18n.i18n.translate('xpack.synthetics.service.projectMonitors.cannotUpdateMonitorToDifferentTypeDetails', {
                defaultMessage: 'Monitor {monitorId} of type {previousType} cannot be updated to type {currentType}. Please delete the monitor first and try again.',
                values: {
                  currentType: monitor.type,
                  previousType: previousMonitor.attributes[_runtime_types.ConfigKey.MONITOR_TYPE],
                  monitorId: monitor.id
                }
              }),
              payload: monitor
            });
          } else if (previousMonitor) {
            this.updatedMonitors.push(monitor.id);
            normalizedUpdateMonitors.push({
              monitor: normM,
              previousMonitor
            });
          } else {
            normalizedNewMonitors.push(normM);
          }
        }
      }
      await this.createMonitorsBulk(normalizedNewMonitors);
      await this.updateMonitorsBulk(normalizedUpdateMonitors);
    });
    (0, _defineProperty2.default)(this, "validatePermissions", async ({
      monitor
    }) => {
      var _monitor$privateLocat;
      if (this.writeIntegrationPoliciesPermissions || ((_monitor$privateLocat = monitor.privateLocations) !== null && _monitor$privateLocat !== void 0 ? _monitor$privateLocat : []).length === 0) {
        return;
      }
      const {
        integrations: {
          writeIntegrationPolicies
        }
      } = await this.server.fleet.authz.fromRequest(this.request);
      this.writeIntegrationPoliciesPermissions = writeIntegrationPolicies;
      if (!writeIntegrationPolicies) {
        throw new Error(INSUFFICIENT_FLEET_PERMISSIONS);
      }
    });
    (0, _defineProperty2.default)(this, "validateProjectMonitor", async ({
      monitor
    }) => {
      try {
        await this.validatePermissions({
          monitor
        });
        const {
          normalizedFields: normalizedMonitor,
          errors
        } = (0, _normalizers.normalizeProjectMonitor)({
          monitor,
          locations: this.publicLocations,
          privateLocations: this.privateLocations,
          projectId: this.projectId,
          namespace: this.spaceId,
          version: this.server.stackVersion
        });
        if (errors.length) {
          this.failedMonitors.push(...errors);
          return null;
        }

        /* Validates that the payload sent from the synthetics agent is valid */
        const {
          valid: isMonitorPayloadValid
        } = this.validateMonitor({
          validationResult: (0, _monitor_validation.validateProjectMonitor)({
            ...monitor,
            type: normalizedMonitor[_runtime_types.ConfigKey.MONITOR_TYPE]
          }),
          monitorId: monitor.id
        });
        if (!isMonitorPayloadValid) {
          return null;
        }

        /* Validates that the normalized monitor is a valid monitor saved object type */
        const {
          valid: isNormalizedMonitorValid,
          decodedMonitor
        } = this.validateMonitor({
          validationResult: (0, _monitor_validation.validateMonitor)(normalizedMonitor),
          monitorId: monitor.id
        });
        if (!isNormalizedMonitorValid || !decodedMonitor) {
          return null;
        }
        return decodedMonitor;
      } catch (e) {
        this.server.logger.error(e);
        this.failedMonitors.push({
          id: monitor.id,
          reason: FAILED_TO_UPDATE_MONITOR,
          details: e.message,
          payload: monitor
        });
      }
    });
    (0, _defineProperty2.default)(this, "getProjectMonitorsForProject", async () => {
      const finder = this.savedObjectsClient.createPointInTimeFinder({
        type: _synthetics_monitor.syntheticsMonitorType,
        perPage: 1000,
        filter: this.projectFilter
      });
      const hits = [];
      for await (const result of finder.find()) {
        hits.push(...result.saved_objects);
      }

      // no need to wait for it
      finder.close();
      return hits;
    });
    (0, _defineProperty2.default)(this, "createMonitorsBulk", async monitors => {
      try {
        if (monitors.length > 0) {
          const {
            newMonitors
          } = await (0, _add_monitor_bulk.syncNewMonitorBulk)({
            normalizedMonitors: monitors,
            server: this.server,
            syntheticsMonitorClient: this.syntheticsMonitorClient,
            soClient: this.savedObjectsClient,
            request: this.request,
            privateLocations: this.privateLocations,
            spaceId: this.spaceId
          });
          if (newMonitors && newMonitors.length === monitors.length) {
            this.createdMonitors.push(...monitors.map(monitor => monitor[_runtime_types.ConfigKey.JOURNEY_ID]));
          } else {
            this.failedMonitors.push({
              reason: _i18n.i18n.translate('xpack.synthetics.service.projectMonitors.failedToCreateXMonitors', {
                defaultMessage: 'Failed to create {length} monitors',
                values: {
                  length: monitors.length
                }
              }),
              details: FAILED_TO_UPDATE_MONITORS,
              payload: monitors
            });
          }
        }
      } catch (e) {
        this.server.logger.error(e);
        this.failedMonitors.push({
          reason: _i18n.i18n.translate('xpack.synthetics.service.projectMonitors.failedToCreateXMonitors', {
            defaultMessage: 'Failed to create {length} monitors',
            values: {
              length: monitors.length
            }
          }),
          details: e.message,
          payload: monitors
        });
      }
    });
    (0, _defineProperty2.default)(this, "getDecryptedMonitors", async monitors => {
      return await (0, _pMap.default)(monitors, async monitor => {
        var _monitor$namespaces;
        return this.encryptedSavedObjectsClient.getDecryptedAsInternalUser(_synthetics_monitor.syntheticsMonitorType, monitor.id, {
          namespace: (_monitor$namespaces = monitor.namespaces) === null || _monitor$namespaces === void 0 ? void 0 : _monitor$namespaces[0]
        });
      }, {
        concurrency: 500
      });
    });
    (0, _defineProperty2.default)(this, "updateMonitorsBulk", async monitors => {
      if (monitors.length === 0) {
        return {
          editedMonitors: [],
          errors: [],
          updatedCount: 0
        };
      }
      const decryptedPreviousMonitors = await this.getDecryptedMonitors(monitors.map(m => m.previousMonitor));
      const monitorsToUpdate = [];
      for (let i = 0; i < decryptedPreviousMonitors.length; i++) {
        const decryptedPreviousMonitor = decryptedPreviousMonitors[i];
        const previousMonitor = monitors[i].previousMonitor;
        const normalizedMonitor = monitors[i].monitor;
        const {
          attributes: {
            [_runtime_types.ConfigKey.REVISION]: _,
            ...normalizedPreviousMonitorAttributes
          }
        } = (0, _secrets.normalizeSecrets)(decryptedPreviousMonitor);
        const monitorWithRevision = (0, _secrets.formatSecrets)({
          ...normalizedPreviousMonitorAttributes,
          ...normalizedMonitor,
          revision: (previousMonitor.attributes[_runtime_types.ConfigKey.REVISION] || 0) + 1
        });
        monitorsToUpdate.push({
          normalizedMonitor,
          previousMonitor,
          monitorWithRevision,
          decryptedPreviousMonitor
        });
      }
      const {
        editedMonitors
      } = await (0, _edit_monitor_bulk.syncEditedMonitorBulk)({
        monitorsToUpdate,
        server: this.server,
        syntheticsMonitorClient: this.syntheticsMonitorClient,
        savedObjectsClient: this.savedObjectsClient,
        request: this.request,
        privateLocations: this.privateLocations,
        spaceId: this.spaceId
      });
      return {
        editedMonitors: editedMonitors !== null && editedMonitors !== void 0 ? editedMonitors : [],
        errors: [],
        updatedCount: monitorsToUpdate.length
      };
    });
    (0, _defineProperty2.default)(this, "validateMonitor", ({
      validationResult,
      monitorId
    }) => {
      const {
        reason: message,
        details,
        payload: validationPayload,
        valid
      } = validationResult;
      if (!valid) {
        this.failedMonitors.push({
          id: monitorId,
          reason: message,
          details,
          payload: validationPayload
        });
      }
      return validationResult;
    });
    this.projectId = projectId;
    this.spaceId = spaceId;
    this.savedObjectsClient = savedObjectsClient;
    this.encryptedSavedObjectsClient = encryptedSavedObjectsClient;
    this.syntheticsMonitorClient = syntheticsMonitorClient;
    this.monitors = _monitors;
    this.server = server;
    this.projectFilter = `${_synthetics_monitor.syntheticsMonitorType}.attributes.${_runtime_types.ConfigKey.PROJECT_ID}: "${this.projectId}"`;
    this.request = request;
    this.publicLocations = [];
    this.privateLocations = [];
  }
}
exports.ProjectMonitorFormatter = ProjectMonitorFormatter;