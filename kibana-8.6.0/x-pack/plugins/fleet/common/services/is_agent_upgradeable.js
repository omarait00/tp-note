"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAgentUpgradeable = isAgentUpgradeable;
exports.isNotDowngrade = exports.isAgentVersionLessThanKibana = void 0;
var _coerce = _interopRequireDefault(require("semver/functions/coerce"));
var _lt = _interopRequireDefault(require("semver/functions/lt"));
var _gt = _interopRequireDefault(require("semver/functions/gt"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function isAgentUpgradeable(agent, kibanaVersion, versionToUpgrade) {
  var _agent$local_metadata, _agent$local_metadata2, _agent$local_metadata3;
  let agentVersion;
  if (typeof (agent === null || agent === void 0 ? void 0 : (_agent$local_metadata = agent.local_metadata) === null || _agent$local_metadata === void 0 ? void 0 : (_agent$local_metadata2 = _agent$local_metadata.elastic) === null || _agent$local_metadata2 === void 0 ? void 0 : (_agent$local_metadata3 = _agent$local_metadata2.agent) === null || _agent$local_metadata3 === void 0 ? void 0 : _agent$local_metadata3.version) === 'string') {
    agentVersion = agent.local_metadata.elastic.agent.version;
  } else {
    return false;
  }
  if (agent.unenrollment_started_at || agent.unenrolled_at) {
    return false;
  }
  if (!agent.local_metadata.elastic.agent.upgradeable) {
    return false;
  }
  // check that the agent is not already in the process of updating
  if (agent.upgrade_started_at && !agent.upgraded_at) {
    return false;
  }
  if (versionToUpgrade !== undefined) {
    return isNotDowngrade(agentVersion, versionToUpgrade) && isAgentVersionLessThanKibana(agentVersion, kibanaVersion);
  }
  return isAgentVersionLessThanKibana(agentVersion, kibanaVersion);
}
const isAgentVersionLessThanKibana = (agentVersion, kibanaVersion) => {
  // make sure versions are only the number before comparison
  const agentVersionNumber = (0, _coerce.default)(agentVersion);
  if (!agentVersionNumber) throw new Error('agent version is not valid');
  const kibanaVersionNumber = (0, _coerce.default)(kibanaVersion);
  if (!kibanaVersionNumber) throw new Error('kibana version is not valid');
  return (0, _lt.default)(agentVersionNumber, kibanaVersionNumber);
};
exports.isAgentVersionLessThanKibana = isAgentVersionLessThanKibana;
const isNotDowngrade = (agentVersion, versionToUpgrade) => {
  const agentVersionNumber = (0, _coerce.default)(agentVersion);
  if (!agentVersionNumber) throw new Error('agent version is not valid');
  const versionToUpgradeNumber = (0, _coerce.default)(versionToUpgrade);
  if (!versionToUpgradeNumber) throw new Error('target version is not valid');
  return (0, _gt.default)(versionToUpgradeNumber, agentVersionNumber);
};
exports.isNotDowngrade = isNotDowngrade;