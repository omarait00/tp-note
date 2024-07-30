"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SyntheticsPrivateLocation = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _lodash = require("lodash");
var _format_synthetics_policy = require("../../../common/formatters/format_synthetics_policy");
var _private_locations = require("../../legacy_uptime/lib/saved_objects/private_locations");
var _runtime_types = require("../../../common/runtime_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class SyntheticsPrivateLocation {
  constructor(_server) {
    (0, _defineProperty2.default)(this, "server", void 0);
    this.server = _server;
  }
  async buildNewPolicy(savedObjectsClient) {
    return await this.server.fleet.packagePolicyService.buildPackagePolicyFromPackage(savedObjectsClient, 'synthetics', this.server.logger);
  }
  getPolicyId(config, {
    id: locId
  }, spaceId) {
    if (config[_runtime_types.ConfigKey.MONITOR_SOURCE_TYPE] === _runtime_types.SourceType.PROJECT) {
      return `${config.id}-${locId}`;
    }
    return `${config.id}-${locId}-${spaceId}`;
  }
  generateNewPolicy(config, privateLocation, savedObjectsClient, newPolicyTemplate, spaceId) {
    if (!savedObjectsClient) {
      throw new Error('Could not find savedObjectsClient');
    }
    const {
      label: locName
    } = privateLocation;
    const newPolicy = (0, _lodash.cloneDeep)(newPolicyTemplate);
    try {
      var _config$fields, _config$fields2, _config$fields3;
      newPolicy.is_managed = true;
      newPolicy.policy_id = privateLocation.agentPolicyId;
      if (config[_runtime_types.ConfigKey.MONITOR_SOURCE_TYPE] === _runtime_types.SourceType.PROJECT) {
        newPolicy.name = `${config.id}-${locName}`;
      } else {
        newPolicy.name = `${config[_runtime_types.ConfigKey.NAME]}-${locName}-${spaceId}`;
      }
      newPolicy.namespace = config[_runtime_types.ConfigKey.NAMESPACE];
      const {
        formattedPolicy
      } = (0, _format_synthetics_policy.formatSyntheticsPolicy)(newPolicy, config.type, {
        ...config,
        config_id: (_config$fields = config.fields) === null || _config$fields === void 0 ? void 0 : _config$fields.config_id,
        location_name: privateLocation.label,
        'monitor.project.id': (_config$fields2 = config.fields) === null || _config$fields2 === void 0 ? void 0 : _config$fields2['monitor.project.name'],
        'monitor.project.name': (_config$fields3 = config.fields) === null || _config$fields3 === void 0 ? void 0 : _config$fields3['monitor.project.name']
      });
      return formattedPolicy;
    } catch (e) {
      this.server.logger.error(e);
      return null;
    }
  }
  async checkPermissions(request, error) {
    const {
      integrations: {
        writeIntegrationPolicies
      }
    } = await this.server.fleet.authz.fromRequest(request);
    if (!writeIntegrationPolicies) {
      throw new Error(error);
    }
  }
  async createMonitors(configs, request, savedObjectsClient, privateLocations, spaceId) {
    await this.checkPermissions(request, `Unable to create Synthetics package policy for monitor. Fleet write permissions are needed to use Synthetics private locations.`);
    const newPolicies = [];
    const newPolicyTemplate = await this.buildNewPolicy(savedObjectsClient);
    if (!newPolicyTemplate) {
      throw new Error(`Unable to create Synthetics package policy for private location`);
    }
    for (const config of configs) {
      try {
        const {
          locations
        } = config;
        const fleetManagedLocations = locations.filter(loc => !loc.isServiceManaged);
        for (const privateLocation of fleetManagedLocations) {
          const location = privateLocations === null || privateLocations === void 0 ? void 0 : privateLocations.find(loc => loc.id === privateLocation.id);
          if (!location) {
            throw new Error(`Unable to find Synthetics private location for agentId ${privateLocation.id}`);
          }
          const newPolicy = this.generateNewPolicy(config, location, savedObjectsClient, newPolicyTemplate, spaceId);
          if (!newPolicy) {
            throw new Error(`Unable to create Synthetics package policy for monitor ${config[_runtime_types.ConfigKey.NAME]} with private location ${location.label}`);
          }
          if (newPolicy) {
            newPolicies.push({
              ...newPolicy,
              id: this.getPolicyId(config, location, spaceId)
            });
          }
        }
      } catch (e) {
        this.server.logger.error(e);
      }
    }
    if (newPolicies.length === 0) {
      throw new Error('Failed to build package policies for all monitors');
    }
    try {
      return await this.createPolicyBulk(newPolicies, savedObjectsClient);
    } catch (e) {
      this.server.logger.error(e);
    }
  }
  async editMonitors(configs, request, savedObjectsClient, allPrivateLocations, spaceId) {
    await this.checkPermissions(request, `Unable to update Synthetics package policy for monitor. Fleet write permissions are needed to use Synthetics private locations.`);
    const newPolicyTemplate = await this.buildNewPolicy(savedObjectsClient);
    if (!newPolicyTemplate) {
      throw new Error(`Unable to create Synthetics package policy for private location`);
    }
    const policiesToUpdate = [];
    const policiesToCreate = [];
    const policiesToDelete = [];
    const existingPolicies = await this.getExistingPolicies(configs, allPrivateLocations, savedObjectsClient, spaceId);
    for (const config of configs) {
      const {
        locations
      } = config;
      const monitorPrivateLocations = locations.filter(loc => !loc.isServiceManaged);
      for (const privateLocation of allPrivateLocations) {
        const hasLocation = monitorPrivateLocations === null || monitorPrivateLocations === void 0 ? void 0 : monitorPrivateLocations.some(loc => loc.id === privateLocation.id);
        const currId = this.getPolicyId(config, privateLocation, spaceId);
        const hasPolicy = existingPolicies === null || existingPolicies === void 0 ? void 0 : existingPolicies.some(policy => policy.id === currId);
        try {
          if (hasLocation) {
            const newPolicy = this.generateNewPolicy(config, privateLocation, savedObjectsClient, newPolicyTemplate, spaceId);
            if (!newPolicy) {
              throw new Error(`Unable to ${hasPolicy ? 'update' : 'create'} Synthetics package policy for private location ${privateLocation.label}`);
            }
            if (hasPolicy) {
              policiesToUpdate.push({
                ...newPolicy,
                id: currId
              });
            } else {
              policiesToCreate.push({
                ...newPolicy,
                id: currId
              });
            }
          } else if (hasPolicy) {
            policiesToDelete.push(currId);
          }
        } catch (e) {
          this.server.logger.error(e);
          throw new Error(`Unable to ${hasPolicy ? 'update' : 'create'} Synthetics package policy for monitor ${config[_runtime_types.ConfigKey.NAME]} with private location ${privateLocation.label}`);
        }
      }
    }
    await Promise.all([this.createPolicyBulk(policiesToCreate, savedObjectsClient), this.updatePolicyBulk(policiesToUpdate, savedObjectsClient), this.deletePolicyBulk(policiesToDelete, savedObjectsClient)]);
  }
  async getExistingPolicies(configs, allPrivateLocations, savedObjectsClient, spaceId) {
    var _await$this$server$fl;
    const listOfPolicies = [];
    for (const config of configs) {
      for (const privateLocation of allPrivateLocations) {
        const currId = this.getPolicyId(config, privateLocation, spaceId);
        listOfPolicies.push(currId);
      }
    }
    return (_await$this$server$fl = await this.server.fleet.packagePolicyService.getByIDs(savedObjectsClient, listOfPolicies, {
      ignoreMissing: true
    })) !== null && _await$this$server$fl !== void 0 ? _await$this$server$fl : [];
  }
  async createPolicyBulk(newPolicies, savedObjectsClient) {
    const soClient = savedObjectsClient;
    const esClient = this.server.uptimeEsClient.baseESClient;
    if (soClient && esClient && newPolicies.length > 0) {
      return await this.server.fleet.packagePolicyService.bulkCreate(soClient, esClient, newPolicies);
    }
  }
  async updatePolicyBulk(updatedPolicies, savedObjectsClient) {
    const soClient = savedObjectsClient;
    const esClient = this.server.uptimeEsClient.baseESClient;
    if (soClient && esClient && updatedPolicies.length > 0) {
      return await this.server.fleet.packagePolicyService.bulkUpdate(soClient, esClient, updatedPolicies, {
        force: true
      });
    }
  }
  async deletePolicyBulk(policyIdsToDelete, savedObjectsClient) {
    const soClient = savedObjectsClient;
    const esClient = this.server.uptimeEsClient.baseESClient;
    if (soClient && esClient && policyIdsToDelete.length > 0) {
      return await this.server.fleet.packagePolicyService.delete(soClient, esClient, policyIdsToDelete, {
        force: true
      });
    }
  }
  async deleteMonitors(configs, request, savedObjectsClient, spaceId) {
    const soClient = savedObjectsClient;
    const esClient = this.server.uptimeEsClient.baseESClient;
    const allPrivateLocations = await (0, _private_locations.getSyntheticsPrivateLocations)(soClient);
    if (soClient && esClient) {
      const policyIdsToDelete = [];
      for (const config of configs) {
        const {
          locations
        } = config;
        const monitorPrivateLocations = locations.filter(loc => !loc.isServiceManaged);
        for (const privateLocation of monitorPrivateLocations) {
          const location = allPrivateLocations === null || allPrivateLocations === void 0 ? void 0 : allPrivateLocations.find(loc => loc.id === privateLocation.id);
          if (location) {
            await this.checkPermissions(request, `Unable to delete Synthetics package policy for monitor ${config[_runtime_types.ConfigKey.NAME]}. Fleet write permissions are needed to use Synthetics private locations.`);
            try {
              policyIdsToDelete.push(this.getPolicyId(config, location, spaceId));
            } catch (e) {
              this.server.logger.error(e);
              throw new Error(`Unable to delete Synthetics package policy for monitor ${config[_runtime_types.ConfigKey.NAME]} with private location ${location.label}`);
            }
          }
        }
      }
      if (policyIdsToDelete.length > 0) {
        await this.checkPermissions(request, `Unable to delete Synthetics package policy for monitor. Fleet write permissions are needed to use Synthetics private locations.`);
        await this.deletePolicyBulk(policyIdsToDelete, savedObjectsClient);
      }
    }
  }
  async getAgentPolicies() {
    const agentPolicies = await this.server.fleet.agentPolicyService.list(this.server.savedObjectsClient, {
      page: 1,
      perPage: 10000
    });
    return agentPolicies.items;
  }
}
exports.SyntheticsPrivateLocation = SyntheticsPrivateLocation;