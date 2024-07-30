"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UpgradeActionRunner = void 0;
exports.upgradeBatch = upgradeBatch;
var _moment = _interopRequireDefault(require("moment"));
var _uuid = _interopRequireDefault(require("uuid"));
var _services = require("../../../common/services");
var _errors = require("../../errors");
var _app_context = require("../app_context");
var _action_runner = require("./action_runner");
var _crud = require("./crud");
var _actions = require("./actions");
var _hosted_agent = require("./hosted_agent");
var _bulk_actions_resolver = require("./bulk_actions_resolver");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class UpgradeActionRunner extends _action_runner.ActionRunner {
  async processAgents(agents) {
    return await upgradeBatch(this.soClient, this.esClient, agents, {}, this.actionParams);
  }
  getTaskType() {
    return _bulk_actions_resolver.BulkActionTaskType.UPGRADE_RETRY;
  }
  getActionType() {
    return 'UPGRADE';
  }
}
exports.UpgradeActionRunner = UpgradeActionRunner;
async function upgradeBatch(soClient, esClient, givenAgents, outgoingErrors, options) {
  var _options$actionId, _options$total;
  const errors = {
    ...outgoingErrors
  };
  const hostedPolicies = await (0, _hosted_agent.getHostedPolicies)(soClient, givenAgents);

  // results from getAgents with options.kuery '' (or even 'active:false') may include hosted agents
  // filter them out unless options.force
  const agentsToCheckUpgradeable = 'kuery' in options && !options.force ? givenAgents.filter(agent => !(0, _hosted_agent.isHostedAgent)(hostedPolicies, agent)) : givenAgents;
  const kibanaVersion = _app_context.appContextService.getKibanaVersion();
  const upgradeableResults = await Promise.allSettled(agentsToCheckUpgradeable.map(async agent => {
    // Filter out agents currently unenrolling, unenrolled, or not upgradeable b/c of version check
    const isNotAllowed = !options.force && !(0, _services.isAgentUpgradeable)(agent, kibanaVersion, options.version);
    if (isNotAllowed) {
      throw new _errors.FleetError(`Agent ${agent.id} is not upgradeable`);
    }
    if (!options.force && (0, _hosted_agent.isHostedAgent)(hostedPolicies, agent)) {
      throw new _errors.HostedAgentPolicyRestrictionRelatedError(`Cannot upgrade agent in hosted agent policy ${agent.policy_id}`);
    }
    return agent;
  }));

  // Filter & record errors from results
  const agentsToUpdate = upgradeableResults.reduce((agents, result, index) => {
    if (result.status === 'fulfilled') {
      agents.push(result.value);
    } else {
      const id = givenAgents[index].id;
      errors[id] = result.reason;
    }
    return agents;
  }, []);

  // Create upgrade action for each agent
  const now = new Date().toISOString();
  const data = {
    version: options.version,
    sourceURI: options.sourceUri
  };
  const rollingUpgradeOptions = getRollingUpgradeOptions(options === null || options === void 0 ? void 0 : options.startTime, options.upgradeDurationSeconds);
  await (0, _crud.bulkUpdateAgents)(esClient, agentsToUpdate.map(agent => ({
    agentId: agent.id,
    data: {
      upgraded_at: null,
      upgrade_started_at: now
    }
  })), errors);
  const actionId = (_options$actionId = options.actionId) !== null && _options$actionId !== void 0 ? _options$actionId : (0, _uuid.default)();
  const total = (_options$total = options.total) !== null && _options$total !== void 0 ? _options$total : givenAgents.length;
  await (0, _actions.createAgentAction)(esClient, {
    id: actionId,
    created_at: now,
    data,
    ack_data: data,
    type: 'UPGRADE',
    total,
    agents: agentsToUpdate.map(agent => agent.id),
    ...rollingUpgradeOptions
  });
  await (0, _actions.createErrorActionResults)(esClient, actionId, errors, 'cannot upgrade hosted agent or agent not upgradeable');
  return {
    actionId
  };
}
const MINIMUM_EXECUTION_DURATION_SECONDS = 60 * 60 * 2; // 2h

const getRollingUpgradeOptions = (startTime, upgradeDurationSeconds) => {
  const now = new Date().toISOString();
  // Perform a rolling upgrade
  if (upgradeDurationSeconds) {
    return {
      start_time: startTime !== null && startTime !== void 0 ? startTime : now,
      minimum_execution_duration: Math.min(MINIMUM_EXECUTION_DURATION_SECONDS, upgradeDurationSeconds),
      expiration: (0, _moment.default)(startTime !== null && startTime !== void 0 ? startTime : now).add(upgradeDurationSeconds, 'seconds').toISOString()
    };
  }
  // Schedule without rolling upgrade (Immediately after start_time)
  if (startTime && !upgradeDurationSeconds) {
    return {
      start_time: startTime !== null && startTime !== void 0 ? startTime : now,
      minimum_execution_duration: MINIMUM_EXECUTION_DURATION_SECONDS,
      expiration: (0, _moment.default)(startTime).add(MINIMUM_EXECUTION_DURATION_SECONDS, 'seconds').toISOString()
    };
  } else {
    // Regular bulk upgrade (non scheduled, non rolling)
    return {};
  }
};