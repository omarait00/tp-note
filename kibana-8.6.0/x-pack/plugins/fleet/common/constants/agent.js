"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FleetServerAgentComponentStatuses = exports.AGENT_UPDATE_LAST_CHECKIN_INTERVAL_MS = exports.AGENT_UPDATE_ACTIONS_INTERVAL_MS = exports.AGENT_TYPE_TEMPORARY = exports.AGENT_TYPE_PERMANENT = exports.AGENT_TYPE_EPHEMERAL = exports.AGENT_POLLING_THRESHOLD_MS = exports.AGENT_POLLING_REQUEST_TIMEOUT_MS = exports.AGENT_POLLING_REQUEST_TIMEOUT_MARGIN_MS = exports.AGENT_POLLING_INTERVAL = exports.AGENT_POLICY_ROLLOUT_RATE_LIMIT_REQUEST_PER_INTERVAL = exports.AGENT_POLICY_ROLLOUT_RATE_LIMIT_INTERVAL_MS = exports.AGENT_ACTIONS_RESULTS_INDEX = exports.AGENT_ACTIONS_INDEX = exports.AGENTS_PREFIX = exports.AGENTS_INDEX = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const AGENTS_PREFIX = 'fleet-agents';
exports.AGENTS_PREFIX = AGENTS_PREFIX;
const AGENT_TYPE_PERMANENT = 'PERMANENT';
exports.AGENT_TYPE_PERMANENT = AGENT_TYPE_PERMANENT;
const AGENT_TYPE_EPHEMERAL = 'EPHEMERAL';
exports.AGENT_TYPE_EPHEMERAL = AGENT_TYPE_EPHEMERAL;
const AGENT_TYPE_TEMPORARY = 'TEMPORARY';
exports.AGENT_TYPE_TEMPORARY = AGENT_TYPE_TEMPORARY;
const AGENT_POLLING_REQUEST_TIMEOUT_MS = 300000; // 5 minutes
exports.AGENT_POLLING_REQUEST_TIMEOUT_MS = AGENT_POLLING_REQUEST_TIMEOUT_MS;
const AGENT_POLLING_REQUEST_TIMEOUT_MARGIN_MS = 20000; // 20s
exports.AGENT_POLLING_REQUEST_TIMEOUT_MARGIN_MS = AGENT_POLLING_REQUEST_TIMEOUT_MARGIN_MS;
const AGENT_POLLING_THRESHOLD_MS = 30000;
exports.AGENT_POLLING_THRESHOLD_MS = AGENT_POLLING_THRESHOLD_MS;
const AGENT_POLLING_INTERVAL = 1000;
exports.AGENT_POLLING_INTERVAL = AGENT_POLLING_INTERVAL;
const AGENT_UPDATE_LAST_CHECKIN_INTERVAL_MS = 30000;
exports.AGENT_UPDATE_LAST_CHECKIN_INTERVAL_MS = AGENT_UPDATE_LAST_CHECKIN_INTERVAL_MS;
const AGENT_UPDATE_ACTIONS_INTERVAL_MS = 5000;
exports.AGENT_UPDATE_ACTIONS_INTERVAL_MS = AGENT_UPDATE_ACTIONS_INTERVAL_MS;
const AGENT_POLICY_ROLLOUT_RATE_LIMIT_INTERVAL_MS = 1000;
exports.AGENT_POLICY_ROLLOUT_RATE_LIMIT_INTERVAL_MS = AGENT_POLICY_ROLLOUT_RATE_LIMIT_INTERVAL_MS;
const AGENT_POLICY_ROLLOUT_RATE_LIMIT_REQUEST_PER_INTERVAL = 5;
exports.AGENT_POLICY_ROLLOUT_RATE_LIMIT_REQUEST_PER_INTERVAL = AGENT_POLICY_ROLLOUT_RATE_LIMIT_REQUEST_PER_INTERVAL;
const AGENTS_INDEX = '.fleet-agents';
exports.AGENTS_INDEX = AGENTS_INDEX;
const AGENT_ACTIONS_INDEX = '.fleet-actions';
exports.AGENT_ACTIONS_INDEX = AGENT_ACTIONS_INDEX;
const AGENT_ACTIONS_RESULTS_INDEX = '.fleet-actions-results';
exports.AGENT_ACTIONS_RESULTS_INDEX = AGENT_ACTIONS_RESULTS_INDEX;
const FleetServerAgentComponentStatuses = ['starting', 'configuring', 'healthy', 'degraded', 'failed', 'stopping', 'stopped'];
exports.FleetServerAgentComponentStatuses = FleetServerAgentComponentStatuses;