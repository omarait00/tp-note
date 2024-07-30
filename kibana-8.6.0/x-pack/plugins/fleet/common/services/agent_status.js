"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildKueryForEnrollingAgents = buildKueryForEnrollingAgents;
exports.buildKueryForErrorAgents = buildKueryForErrorAgents;
exports.buildKueryForInactiveAgents = buildKueryForInactiveAgents;
exports.buildKueryForOfflineAgents = buildKueryForOfflineAgents;
exports.buildKueryForOnlineAgents = buildKueryForOnlineAgents;
exports.buildKueryForUnenrollingAgents = buildKueryForUnenrollingAgents;
exports.buildKueryForUpdatingAgents = buildKueryForUpdatingAgents;
exports.buildKueryForUpgradingAgents = buildKueryForUpgradingAgents;
exports.getAgentStatus = getAgentStatus;
exports.getPreviousAgentStatusForOfflineAgents = getPreviousAgentStatusForOfflineAgents;
var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const offlineTimeoutIntervalCount = 10; // 30s*10 = 5m timeout

function getAgentStatus(agent) {
  var _agent$last_checkin_s, _agent$last_checkin_s2;
  const {
    last_checkin: lastCheckIn
  } = agent;
  if (!agent.active) {
    return 'inactive';
  }
  if (!agent.last_checkin) {
    return 'enrolling';
  }
  const msLastCheckIn = new Date(lastCheckIn || 0).getTime();
  const msSinceLastCheckIn = new Date().getTime() - msLastCheckIn;
  const intervalsSinceLastCheckIn = Math.floor(msSinceLastCheckIn / _constants.AGENT_POLLING_THRESHOLD_MS);
  if (intervalsSinceLastCheckIn >= offlineTimeoutIntervalCount) {
    return 'offline';
  }
  if (agent.unenrollment_started_at && !agent.unenrolled_at) {
    return 'unenrolling';
  }
  if (((_agent$last_checkin_s = agent.last_checkin_status) === null || _agent$last_checkin_s === void 0 ? void 0 : _agent$last_checkin_s.toLowerCase()) === 'error') {
    return 'error';
  }
  if (((_agent$last_checkin_s2 = agent.last_checkin_status) === null || _agent$last_checkin_s2 === void 0 ? void 0 : _agent$last_checkin_s2.toLowerCase()) === 'degraded') {
    return 'degraded';
  }
  const policyRevision = 'policy_revision' in agent ? agent.policy_revision : 'policy_revision_idx' in agent ? agent.policy_revision_idx : undefined;
  if (!policyRevision || agent.upgrade_started_at && !agent.upgraded_at) {
    return 'updating';
  }
  return 'online';
}
function getPreviousAgentStatusForOfflineAgents(agent) {
  var _agent$last_checkin_s3, _agent$last_checkin_s4;
  if (agent.unenrollment_started_at && !agent.unenrolled_at) {
    return 'unenrolling';
  }
  if (((_agent$last_checkin_s3 = agent.last_checkin_status) === null || _agent$last_checkin_s3 === void 0 ? void 0 : _agent$last_checkin_s3.toLowerCase()) === 'error') {
    return 'error';
  }
  if (((_agent$last_checkin_s4 = agent.last_checkin_status) === null || _agent$last_checkin_s4 === void 0 ? void 0 : _agent$last_checkin_s4.toLowerCase()) === 'degraded') {
    return 'degraded';
  }
  const policyRevision = 'policy_revision' in agent ? agent.policy_revision : 'policy_revision_idx' in agent ? agent.policy_revision_idx : undefined;
  if (!policyRevision || agent.upgrade_started_at && !agent.upgraded_at) {
    return 'updating';
  }
}
function buildKueryForEnrollingAgents(path = '') {
  return `not (${path}last_checkin:*)`;
}
function buildKueryForUnenrollingAgents(path = '') {
  return `${path}unenrollment_started_at:*`;
}
function buildKueryForOnlineAgents(path = '') {
  return `${path}last_checkin:* ${addExclusiveKueryFilter([buildKueryForOfflineAgents, buildKueryForUpdatingAgents, buildKueryForErrorAgents], path)}`;
}
function buildKueryForErrorAgents(path = '') {
  return `(${path}last_checkin_status:error or ${path}last_checkin_status:degraded or ${path}last_checkin_status:DEGRADED or ${path}last_checkin_status:ERROR) ${addExclusiveKueryFilter([buildKueryForOfflineAgents, buildKueryForUnenrollingAgents], path)}`;
}
function buildKueryForOfflineAgents(path = '') {
  return `${path}last_checkin < now-${offlineTimeoutIntervalCount * _constants.AGENT_POLLING_THRESHOLD_MS / 1000}s`;
}
function buildKueryForUpgradingAgents(path = '') {
  return `(${path}upgrade_started_at:*) and not (${path}upgraded_at:*)`;
}
function buildKueryForUpdatingAgents(path = '') {
  return `((${buildKueryForUpgradingAgents(path)}) or (${buildKueryForEnrollingAgents(path)}) or (${buildKueryForUnenrollingAgents(path)}) or (not ${path}policy_revision_idx:*)) ${addExclusiveKueryFilter([buildKueryForOfflineAgents, buildKueryForErrorAgents], path)}`;
}
function buildKueryForInactiveAgents(path = '') {
  return `${path}active:false`;
}
function addExclusiveKueryFilter(kueryBuilders, path) {
  return ` AND not (${kueryBuilders.map(kueryBuilder => `(${kueryBuilder(path)})`).join(' or ')})`;
}