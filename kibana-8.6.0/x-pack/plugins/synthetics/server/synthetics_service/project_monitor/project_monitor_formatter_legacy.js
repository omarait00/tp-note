"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProjectMonitorFormatterLegacy = exports.INSUFFICIENT_FLEET_PERMISSIONS = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _lodash = require("lodash");
var _pMap = _interopRequireDefault(require("p-map"));
var _add_monitor_bulk = require("../../routes/monitor_cruds/bulk_cruds/add_monitor_bulk");
var _delete_monitor_bulk = require("../../routes/monitor_cruds/bulk_cruds/delete_monitor_bulk");
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

const INSUFFICIENT_FLEET_PERMISSIONS = 'Insufficient permissions. In order to configure private locations, you must have Fleet and Integrations write permissions. To resolve, please generate a new API key with a user who has Fleet and Integrations write permissions.';
exports.INSUFFICIENT_FLEET_PERMISSIONS = INSUFFICIENT_FLEET_PERMISSIONS;
class ProjectMonitorFormatterLegacy {
  constructor({
    locations,
    privateLocations,
    keepStale,
    savedObjectsClient,
    encryptedSavedObjectsClient,
    projectId,
    spaceId,
    monitors: _monitors,
    server,
    syntheticsMonitorClient,
    request,
    subject
  }) {
    (0, _defineProperty2.default)(this, "projectId", void 0);
    (0, _defineProperty2.default)(this, "spaceId", void 0);
    (0, _defineProperty2.default)(this, "keepStale", void 0);
    (0, _defineProperty2.default)(this, "locations", void 0);
    (0, _defineProperty2.default)(this, "privateLocations", void 0);
    (0, _defineProperty2.default)(this, "savedObjectsClient", void 0);
    (0, _defineProperty2.default)(this, "encryptedSavedObjectsClient", void 0);
    (0, _defineProperty2.default)(this, "staleMonitorsMap", {});
    (0, _defineProperty2.default)(this, "monitors", []);
    (0, _defineProperty2.default)(this, "createdMonitors", []);
    (0, _defineProperty2.default)(this, "deletedMonitors", []);
    (0, _defineProperty2.default)(this, "updatedMonitors", []);
    (0, _defineProperty2.default)(this, "staleMonitors", []);
    (0, _defineProperty2.default)(this, "failedMonitors", []);
    (0, _defineProperty2.default)(this, "failedStaleMonitors", []);
    (0, _defineProperty2.default)(this, "server", void 0);
    (0, _defineProperty2.default)(this, "projectFilter", void 0);
    (0, _defineProperty2.default)(this, "syntheticsMonitorClient", void 0);
    (0, _defineProperty2.default)(this, "request", void 0);
    (0, _defineProperty2.default)(this, "subject", void 0);
    (0, _defineProperty2.default)(this, "writeIntegrationPoliciesPermissions", void 0);
    (0, _defineProperty2.default)(this, "configureAllProjectMonitors", async () => {
      const existingMonitors = await this.getProjectMonitorsForProject();
      this.staleMonitorsMap = await this.getStaleMonitorsMap(existingMonitors);
      const normalizedNewMonitors = [];
      const normalizedUpdateMonitors = [];
      for (const monitor of this.monitors) {
        const previousMonitor = existingMonitors.find(monitorObj => monitorObj.attributes[_runtime_types.ConfigKey.JOURNEY_ID] === monitor.id);
        const normM = await this.validateProjectMonitor({
          monitor
        });
        if (normM) {
          if (previousMonitor) {
            this.updatedMonitors.push(monitor.id);
            if (this.staleMonitorsMap[monitor.id]) {
              this.staleMonitorsMap[monitor.id].stale = false;
            }
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
      const {
        updatedCount
      } = await this.updateMonitorsBulk(normalizedUpdateMonitors);
      if (normalizedUpdateMonitors.length > 0) {
        let updateMessage = '';
        if (updatedCount > 0) {
          updateMessage = `${updatedCount} monitor${updatedCount > 1 ? 's' : ''} updated successfully.`;
        }
        const noChanges = normalizedUpdateMonitors.length - updatedCount;
        let noChangeMessage = '';
        if (noChanges > 0) {
          noChangeMessage = `${noChanges} monitor${noChanges > 1 ? 's' : ''} found with no changes.`;
        }
        this.handleStreamingMessage({
          message: `${updateMessage} ${noChangeMessage}`
        });
      }
      await this.handleStaleMonitors();
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
          locations: this.locations,
          privateLocations: this.privateLocations,
          projectId: this.projectId,
          namespace: this.spaceId,
          version: this.server.stackVersion
        });
        if (errors.length) {
          this.failedMonitors.push(...errors);
          this.handleStreamingMessage({
            message: `${monitor.id}: failed to create or update monitor`
          });
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
          reason: 'Failed to create or update monitor',
          details: e.message,
          payload: monitor
        });
        this.handleStreamingMessage({
          message: `${monitor.id}: failed to create or update monitor`
        });
        if (this.staleMonitorsMap[monitor.id]) {
          this.staleMonitorsMap[monitor.id].stale = false;
        }
      }
    });
    (0, _defineProperty2.default)(this, "getStaleMonitorsMap", async existingMonitors => {
      const staleMonitors = {};
      existingMonitors.forEach(savedObject => {
        const journeyId = savedObject.attributes[_runtime_types.ConfigKey.JOURNEY_ID];
        if (journeyId) {
          staleMonitors[journeyId] = {
            stale: true,
            savedObjectId: savedObject.id,
            journeyId
          };
        }
      });
      return staleMonitors;
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
      await finder.close();
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
            this.handleStreamingMessage({
              message: `${monitors.length} monitor${monitors.length > 1 ? 's' : ''} created successfully.`
            });
          } else {
            this.failedMonitors.push({
              reason: `Failed to create ${monitors.length} monitors`,
              details: 'Failed to create monitors',
              payload: monitors
            });
            this.handleStreamingMessage({
              message: `Failed to create ${monitors.length} monitors`
            });
          }
        }
      } catch (e) {
        this.server.logger.error(e);
        this.failedMonitors.push({
          reason: `Failed to create ${monitors.length} monitors`,
          details: e.message,
          payload: monitors
        });
        this.handleStreamingMessage({
          message: `Failed to create ${monitors.length} monitors`
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
      const decryptedPreviousMonitors = await this.getDecryptedMonitors(monitors.map(m => m.previousMonitor));
      const monitorsToUpdate = [];
      for (let i = 0; i < decryptedPreviousMonitors.length; i++) {
        const decryptedPreviousMonitor = decryptedPreviousMonitors[i];
        const previousMonitor = monitors[i].previousMonitor;
        const normalizedMonitor = monitors[i].monitor;
        const keysToOmit = [_runtime_types.ConfigKey.REVISION, _runtime_types.ConfigKey.MONITOR_QUERY_ID, _runtime_types.ConfigKey.CONFIG_ID];
        const {
          attributes: normalizedPreviousMonitorAttributes
        } = (0, _secrets.normalizeSecrets)(decryptedPreviousMonitor);
        const hasMonitorBeenEdited = !(0, _lodash.isEqual)((0, _lodash.omit)(normalizedMonitor, keysToOmit), (0, _lodash.omit)(normalizedPreviousMonitorAttributes, keysToOmit));
        if (hasMonitorBeenEdited) {
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
    (0, _defineProperty2.default)(this, "handleStaleMonitors", async () => {
      try {
        const staleMonitorsList = Object.values(this.staleMonitorsMap).filter(monitor => monitor.stale === true);
        const encryptedMonitors = await this.savedObjectsClient.bulkGet(staleMonitorsList.map(staleMonitor => ({
          id: staleMonitor.savedObjectId,
          type: _synthetics_monitor.syntheticsMonitorType
        })));
        let monitors = encryptedMonitors.saved_objects;
        const hasPrivateMonitor = monitors.some(monitor => monitor.attributes.locations.some(location => !location.isServiceManaged));
        if (hasPrivateMonitor) {
          const {
            integrations: {
              writeIntegrationPolicies
            }
          } = await this.server.fleet.authz.fromRequest(this.request);
          if (!writeIntegrationPolicies) {
            monitors = monitors.filter(monitor => {
              const hasPrivateLocation = monitor.attributes.locations.some(location => !location.isServiceManaged);
              if (hasPrivateLocation) {
                const journeyId = monitor.attributes[_runtime_types.ConfigKey.JOURNEY_ID];
                const monitorName = monitor.attributes[_runtime_types.ConfigKey.NAME];
                this.handleStreamingMessage({
                  message: `Monitor ${journeyId} could not be deleted`
                });
                this.failedStaleMonitors.push({
                  id: journeyId,
                  reason: 'Failed to delete stale monitor',
                  details: `Unable to delete Synthetics package policy for monitor ${monitorName}. Fleet write permissions are needed to use Synthetics private locations.`
                });
              }
              return !hasPrivateLocation;
            });
          }
        }
        const chunkSize = 100;
        for (let i = 0; i < monitors.length; i += chunkSize) {
          const chunkMonitors = monitors.slice(i, i + chunkSize);
          try {
            if (!this.keepStale) {
              await (0, _delete_monitor_bulk.deleteMonitorBulk)({
                monitors: chunkMonitors,
                savedObjectsClient: this.savedObjectsClient,
                server: this.server,
                syntheticsMonitorClient: this.syntheticsMonitorClient,
                request: this.request
              });
              for (const sm of chunkMonitors) {
                const journeyId = sm.attributes[_runtime_types.ConfigKey.JOURNEY_ID];
                this.deletedMonitors.push(journeyId);
                this.handleStreamingMessage({
                  message: `Monitor ${journeyId} deleted successfully`
                });
              }
            } else {
              chunkMonitors.forEach(sm => {
                const journeyId = sm.attributes[_runtime_types.ConfigKey.JOURNEY_ID];
                this.staleMonitors.push(journeyId);
              });
            }
          } catch (e) {
            chunkMonitors.forEach(sm => {
              const journeyId = sm.attributes[_runtime_types.ConfigKey.JOURNEY_ID];
              this.handleStreamingMessage({
                message: `Monitor ${journeyId} could not be deleted`
              });
              this.failedStaleMonitors.push({
                id: journeyId,
                reason: 'Failed to delete stale monitor',
                details: e.message,
                payload: staleMonitorsList.find(staleMonitor => staleMonitor.savedObjectId === sm.id)
              });
            });
            this.server.logger.error(e);
          }
        }
      } catch (e) {
        this.server.logger.error(e);
      }
    });
    (0, _defineProperty2.default)(this, "handleStreamingMessage", ({
      message
    }) => {
      if (this.subject) {
        var _this$subject;
        (_this$subject = this.subject) === null || _this$subject === void 0 ? void 0 : _this$subject.next(message);
      }
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
        if (this.staleMonitorsMap[monitorId]) {
          this.staleMonitorsMap[monitorId].stale = false;
        }
      }
      return validationResult;
    });
    this.projectId = projectId;
    this.spaceId = spaceId;
    this.locations = locations;
    this.privateLocations = privateLocations;
    this.keepStale = keepStale;
    this.savedObjectsClient = savedObjectsClient;
    this.encryptedSavedObjectsClient = encryptedSavedObjectsClient;
    this.syntheticsMonitorClient = syntheticsMonitorClient;
    this.monitors = _monitors;
    this.server = server;
    this.projectFilter = `${_synthetics_monitor.syntheticsMonitorType}.attributes.${_runtime_types.ConfigKey.PROJECT_ID}: "${this.projectId}"`;
    this.request = request;
    this.subject = subject;
  }
}
exports.ProjectMonitorFormatterLegacy = ProjectMonitorFormatterLegacy;