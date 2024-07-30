"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SyntheticsMonitorClient = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _synthetics_private_location = require("../private_location/synthetics_private_location");
var _format_configs = require("../formatters/format_configs");
var _runtime_types = require("../../../common/runtime_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class SyntheticsMonitorClient {
  constructor(syntheticsService, server) {
    (0, _defineProperty2.default)(this, "syntheticsService", void 0);
    (0, _defineProperty2.default)(this, "privateLocationAPI", void 0);
    this.syntheticsService = syntheticsService;
    this.privateLocationAPI = new _synthetics_private_location.SyntheticsPrivateLocation(server);
  }
  async addMonitors(monitors, request, savedObjectsClient, allPrivateLocations, spaceId) {
    const privateConfigs = [];
    const publicConfigs = [];
    for (const monitorObj of monitors) {
      const {
        monitor,
        id
      } = monitorObj;
      const config = (0, _format_configs.formatHeartbeatRequest)({
        monitor,
        monitorId: id,
        heartbeatId: monitor[_runtime_types.ConfigKey.MONITOR_QUERY_ID]
      });
      const {
        privateLocations,
        publicLocations
      } = this.parseLocations(config);
      if (privateLocations.length > 0) {
        privateConfigs.push(config);
      }
      if (publicLocations.length > 0) {
        publicConfigs.push(config);
      }
    }
    let newPolicies;
    if (privateConfigs.length > 0) {
      newPolicies = await this.privateLocationAPI.createMonitors(privateConfigs, request, savedObjectsClient, allPrivateLocations, spaceId);
    }
    let syncErrors;
    if (publicConfigs.length > 0) {
      syncErrors = await this.syntheticsService.addConfig(publicConfigs);
    }
    return {
      newPolicies,
      syncErrors
    };
  }
  async editMonitors(monitors, request, savedObjectsClient, allPrivateLocations, spaceId) {
    const privateConfigs = [];
    const publicConfigs = [];
    for (const editedMonitor of monitors) {
      const editedConfig = (0, _format_configs.formatHeartbeatRequest)({
        monitor: editedMonitor.monitor,
        monitorId: editedMonitor.id,
        heartbeatId: editedMonitor.monitor[_runtime_types.ConfigKey.MONITOR_QUERY_ID]
      });
      const {
        publicLocations,
        privateLocations
      } = this.parseLocations(editedConfig);
      if (publicLocations.length > 0) {
        publicConfigs.push(editedConfig);
      }
      if (privateLocations.length > 0 || this.hasPrivateLocations(editedMonitor.previousMonitor)) {
        privateConfigs.push(editedConfig);
      }
    }
    await this.privateLocationAPI.editMonitors(privateConfigs, request, savedObjectsClient, allPrivateLocations, spaceId);
    if (publicConfigs.length > 0) {
      return await this.syntheticsService.editConfig(publicConfigs);
    }
  }
  async deleteMonitors(monitors, request, savedObjectsClient, spaceId) {
    /* Type cast encrypted saved objects to decrypted saved objects for delete flow only.
     * Deletion does not require all monitor fields */
    const privateDeletePromise = this.privateLocationAPI.deleteMonitors(monitors, request, savedObjectsClient, spaceId);
    const publicDeletePromise = this.syntheticsService.deleteConfigs(monitors);
    const [pubicResponse] = await Promise.all([publicDeletePromise, privateDeletePromise]);
    return pubicResponse;
  }
  hasPrivateLocations(previousMonitor) {
    if (!previousMonitor) {
      return false;
    }
    const {
      locations
    } = previousMonitor.attributes;
    return locations.some(loc => !loc.isServiceManaged);
  }
  parseLocations(config) {
    const {
      locations
    } = config;
    const privateLocations = locations.filter(loc => !loc.isServiceManaged);
    const publicLocations = locations.filter(loc => loc.isServiceManaged);
    return {
      privateLocations,
      publicLocations
    };
  }
}
exports.SyntheticsMonitorClient = SyntheticsMonitorClient;