"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserRiskIndex = exports.getHostRiskIndex = exports.buildUserNamesFilter = exports.buildHostNamesFilter = exports.buildEntityNameFilter = exports.RiskScoreEntity = exports.RiskQueries = void 0;
var _constants = require("../../../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Make sure this aligns with the index in step 6, 9 in
 * prebuilt_dev_tool_content/console_templates/enable_host_risk_score.console
 */
const getHostRiskIndex = (spaceId, onlyLatest = true) => {
  return `${_constants.RISKY_HOSTS_INDEX_PREFIX}${onlyLatest ? 'latest_' : ''}${spaceId}`;
};
exports.getHostRiskIndex = getHostRiskIndex;
const getUserRiskIndex = (spaceId, onlyLatest = true) => {
  return `${_constants.RISKY_USERS_INDEX_PREFIX}${onlyLatest ? 'latest_' : ''}${spaceId}`;
};
exports.getUserRiskIndex = getUserRiskIndex;
const buildHostNamesFilter = hostNames => {
  return {
    terms: {
      'host.name': hostNames
    }
  };
};
exports.buildHostNamesFilter = buildHostNamesFilter;
const buildUserNamesFilter = userNames => {
  return {
    terms: {
      'user.name': userNames
    }
  };
};
exports.buildUserNamesFilter = buildUserNamesFilter;
const buildEntityNameFilter = (entityNames, riskEntity) => {
  return riskEntity === RiskScoreEntity.host ? {
    terms: {
      'host.name': entityNames
    }
  } : {
    terms: {
      'user.name': entityNames
    }
  };
};
exports.buildEntityNameFilter = buildEntityNameFilter;
let RiskQueries;
exports.RiskQueries = RiskQueries;
(function (RiskQueries) {
  RiskQueries["hostsRiskScore"] = "hostsRiskScore";
  RiskQueries["usersRiskScore"] = "usersRiskScore";
  RiskQueries["kpiRiskScore"] = "kpiRiskScore";
})(RiskQueries || (exports.RiskQueries = RiskQueries = {}));
let RiskScoreEntity;
exports.RiskScoreEntity = RiskScoreEntity;
(function (RiskScoreEntity) {
  RiskScoreEntity["host"] = "host";
  RiskScoreEntity["user"] = "user";
})(RiskScoreEntity || (exports.RiskScoreEntity = RiskScoreEntity = {}));