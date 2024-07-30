"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postBulkAgentsUpgradeHandler = exports.postAgentUpgradeHandler = exports.getCurrentUpgradesHandler = exports.checkKibanaVersion = void 0;
var _coerce = _interopRequireDefault(require("semver/functions/coerce"));
var _gt = _interopRequireDefault(require("semver/functions/gt"));
var _major = _interopRequireDefault(require("semver/functions/major"));
var _minor = _interopRequireDefault(require("semver/functions/minor"));
var AgentService = _interopRequireWildcard(require("../../services/agents"));
var _services = require("../../services");
var _errors = require("../../errors");
var _services2 = require("../../../common/services");
var _get_min_max_version = require("../../../common/services/get_min_max_version");
var _get_all_fleet_server_agents = require("../../collectors/get_all_fleet_server_agents");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const postAgentUpgradeHandler = async (context, request, response) => {
  const coreContext = await context.core;
  const soClient = coreContext.savedObjects.client;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  const {
    version,
    source_uri: sourceUri,
    force
  } = request.body;
  const kibanaVersion = _services.appContextService.getKibanaVersion();
  try {
    checkKibanaVersion(version, kibanaVersion, force);
  } catch (err) {
    return response.customError({
      statusCode: 400,
      body: {
        message: err.message
      }
    });
  }
  try {
    const agent = await (0, AgentService.getAgentById)(esClient, request.params.agentId);
    const fleetServerAgents = await (0, _get_all_fleet_server_agents.getAllFleetServerAgents)(soClient, esClient);
    const agentIsFleetServer = fleetServerAgents.some(fleetServerAgent => fleetServerAgent.id === agent.id);
    if (!agentIsFleetServer) {
      try {
        checkFleetServerVersion(version, fleetServerAgents);
      } catch (err) {
        return response.customError({
          statusCode: 400,
          body: {
            message: err.message
          }
        });
      }
    }
    if (agent.unenrollment_started_at || agent.unenrolled_at) {
      return response.customError({
        statusCode: 400,
        body: {
          message: 'cannot upgrade an unenrolling or unenrolled agent'
        }
      });
    }
    if (!force && !(0, _services2.isAgentUpgradeable)(agent, kibanaVersion, version)) {
      return response.customError({
        statusCode: 400,
        body: {
          message: `agent ${request.params.agentId} is not upgradeable`
        }
      });
    }
    await AgentService.sendUpgradeAgentAction({
      soClient,
      esClient,
      agentId: request.params.agentId,
      version,
      sourceUri
    });
    const body = {};
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultFleetErrorHandler)({
      error,
      response
    });
  }
};
exports.postAgentUpgradeHandler = postAgentUpgradeHandler;
const postBulkAgentsUpgradeHandler = async (context, request, response) => {
  const coreContext = await context.core;
  const soClient = coreContext.savedObjects.client;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  const {
    version,
    source_uri: sourceUri,
    agents,
    force,
    rollout_duration_seconds: upgradeDurationSeconds,
    start_time: startTime,
    batchSize
  } = request.body;
  const kibanaVersion = _services.appContextService.getKibanaVersion();
  try {
    checkKibanaVersion(version, kibanaVersion, force);
    const fleetServerAgents = await (0, _get_all_fleet_server_agents.getAllFleetServerAgents)(soClient, esClient);
    checkFleetServerVersion(version, fleetServerAgents, force);
  } catch (err) {
    return response.customError({
      statusCode: 400,
      body: {
        message: err.message
      }
    });
  }
  try {
    const agentOptions = Array.isArray(agents) ? {
      agentIds: agents
    } : {
      kuery: agents
    };
    const upgradeOptions = {
      ...agentOptions,
      sourceUri,
      version,
      force,
      upgradeDurationSeconds,
      startTime,
      batchSize
    };
    const results = await AgentService.sendUpgradeAgentsActions(soClient, esClient, upgradeOptions);
    return response.ok({
      body: {
        actionId: results.actionId
      }
    });
  } catch (error) {
    return (0, _errors.defaultFleetErrorHandler)({
      error,
      response
    });
  }
};
exports.postBulkAgentsUpgradeHandler = postBulkAgentsUpgradeHandler;
const getCurrentUpgradesHandler = async (context, request, response) => {
  const coreContext = await context.core;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  try {
    const upgrades = await AgentService.getCurrentBulkUpgrades(esClient);
    const body = {
      items: upgrades
    };
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultFleetErrorHandler)({
      error,
      response
    });
  }
};
exports.getCurrentUpgradesHandler = getCurrentUpgradesHandler;
const checkKibanaVersion = (version, kibanaVersion, force = false) => {
  var _semverCoerce, _semverCoerce2;
  // get version number only in case "-SNAPSHOT" is in it
  const kibanaVersionNumber = (_semverCoerce = (0, _coerce.default)(kibanaVersion)) === null || _semverCoerce === void 0 ? void 0 : _semverCoerce.version;
  if (!kibanaVersionNumber) throw new Error(`kibanaVersion ${kibanaVersionNumber} is not valid`);
  const versionToUpgradeNumber = (_semverCoerce2 = (0, _coerce.default)(version)) === null || _semverCoerce2 === void 0 ? void 0 : _semverCoerce2.version;
  if (!versionToUpgradeNumber) throw new Error(`version to upgrade ${versionToUpgradeNumber} is not valid`);
  if (!force && (0, _gt.default)(versionToUpgradeNumber, kibanaVersionNumber)) {
    throw new Error(`cannot upgrade agent to ${versionToUpgradeNumber} because it is higher than the installed kibana version ${kibanaVersionNumber}`);
  }
  const kibanaMajorGt = (0, _major.default)(kibanaVersionNumber) > (0, _major.default)(versionToUpgradeNumber);
  const kibanaMajorEqMinorGte = (0, _major.default)(kibanaVersionNumber) === (0, _major.default)(versionToUpgradeNumber) && (0, _minor.default)(kibanaVersionNumber) >= (0, _minor.default)(versionToUpgradeNumber);

  // When force is enabled, only the major and minor versions are checked
  if (force && !(kibanaMajorGt || kibanaMajorEqMinorGte)) {
    throw new Error(`cannot force upgrade agent to ${versionToUpgradeNumber} because it does not satisfy the major and minor of the installed kibana version ${kibanaVersionNumber}`);
  }
};

// Check the installed fleet server version
exports.checkKibanaVersion = checkKibanaVersion;
const checkFleetServerVersion = (versionToUpgradeNumber, fleetServerAgents, force = false) => {
  const fleetServerVersions = fleetServerAgents.map(agent => agent.local_metadata.elastic.agent.version);
  const maxFleetServerVersion = (0, _get_min_max_version.getMaxVersion)(fleetServerVersions);
  if (!maxFleetServerVersion) {
    return;
  }
  if (!force && (0, _gt.default)(versionToUpgradeNumber, maxFleetServerVersion)) {
    throw new Error(`cannot upgrade agent to ${versionToUpgradeNumber} because it is higher than the latest fleet server version ${maxFleetServerVersion}`);
  }
  const fleetServerMajorGt = (0, _major.default)(maxFleetServerVersion) > (0, _major.default)(versionToUpgradeNumber);
  const fleetServerMajorEqMinorGte = (0, _major.default)(maxFleetServerVersion) === (0, _major.default)(versionToUpgradeNumber) && (0, _minor.default)(maxFleetServerVersion) >= (0, _minor.default)(versionToUpgradeNumber);

  // When force is enabled, only the major and minor versions are checked
  if (force && !(fleetServerMajorGt || fleetServerMajorEqMinorGte)) {
    throw new Error(`cannot force upgrade agent to ${versionToUpgradeNumber} because it does not satisfy the major and minor of the latest fleet server version ${maxFleetServerVersion}`);
  }
};