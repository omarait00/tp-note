"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineGetCspStatusRoute = exports.INDEX_TIMEOUT_IN_MINUTES = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _moment = _interopRequireDefault(require("moment"));
var _constants = require("../../../common/constants");
var _fleet_util = require("../../lib/fleet_util");
var _check_index_status = require("../../lib/check_index_status");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const INDEX_TIMEOUT_IN_MINUTES = 10;
exports.INDEX_TIMEOUT_IN_MINUTES = INDEX_TIMEOUT_IN_MINUTES;
const calculateDiffFromNowInMinutes = date => (0, _moment.default)().diff((0, _moment.default)(date), 'minutes');
const getHealthyAgents = async (soClient, installedCspPackagePolicies, agentPolicyService, agentService) => {
  // Get agent policies of package policies (from installed package policies)
  const agentPolicies = await (0, _fleet_util.getCspAgentPolicies)(soClient, installedCspPackagePolicies, agentPolicyService);

  // Get agents statuses of the following agent policies
  const agentStatusesByAgentPolicyId = await (0, _fleet_util.getAgentStatusesByAgentPolicies)(agentService, agentPolicies);
  return Object.values(agentStatusesByAgentPolicyId).reduce((sum, status) => sum + status.online + status.updating, 0);
};
const calculateCspStatusCode = (indicesStatus, installedCspPackagePolicies, healthyAgents, timeSinceInstallationInMinutes) => {
  // We check privileges only for the relevant indices for our pages to appear
  if (indicesStatus.findingsLatest === 'unprivileged' || indicesStatus.score === 'unprivileged') return 'unprivileged';
  if (indicesStatus.findingsLatest === 'not-empty') return 'indexed';
  if (installedCspPackagePolicies === 0) return 'not-installed';
  if (healthyAgents === 0) return 'not-deployed';
  if (timeSinceInstallationInMinutes <= INDEX_TIMEOUT_IN_MINUTES) return 'indexing';
  if (timeSinceInstallationInMinutes > INDEX_TIMEOUT_IN_MINUTES) return 'index-timeout';
  throw new Error('Could not determine csp status');
};
const assertResponse = (resp, logger) => {
  if (resp.status === 'unprivileged' && !resp.indicesDetails.some(idxDetails => idxDetails.status === 'unprivileged')) {
    logger.warn('Returned status in `unprivileged` but response is missing the unprivileged index');
  }
};
const getCspStatus = async ({
  logger,
  esClient,
  soClient,
  packageService,
  packagePolicyService,
  agentPolicyService,
  agentService
}) => {
  const [findingsLatestIndexStatus, findingsIndexStatus, scoreIndexStatus, installation, latestCspPackage, installedPackagePolicies] = await Promise.all([(0, _check_index_status.checkIndexStatus)(esClient.asCurrentUser, _constants.LATEST_FINDINGS_INDEX_DEFAULT_NS, logger), (0, _check_index_status.checkIndexStatus)(esClient.asCurrentUser, _constants.FINDINGS_INDEX_PATTERN, logger), (0, _check_index_status.checkIndexStatus)(esClient.asCurrentUser, _constants.BENCHMARK_SCORE_INDEX_DEFAULT_NS, logger), packageService.asInternalUser.getInstallation(_constants.CLOUD_SECURITY_POSTURE_PACKAGE_NAME), packageService.asInternalUser.fetchFindLatestPackage(_constants.CLOUD_SECURITY_POSTURE_PACKAGE_NAME), (0, _fleet_util.getCspPackagePolicies)(soClient, packagePolicyService, _constants.CLOUD_SECURITY_POSTURE_PACKAGE_NAME, {
    per_page: 10000
  })]);
  const healthyAgents = await getHealthyAgents(soClient, installedPackagePolicies.items, agentPolicyService, agentService);
  const installedPackagePoliciesTotal = installedPackagePolicies.total;
  const latestCspPackageVersion = latestCspPackage.version;
  const MIN_DATE = 0;
  const indicesDetails = [{
    index: _constants.LATEST_FINDINGS_INDEX_DEFAULT_NS,
    status: findingsLatestIndexStatus
  }, {
    index: _constants.FINDINGS_INDEX_PATTERN,
    status: findingsIndexStatus
  }, {
    index: _constants.BENCHMARK_SCORE_INDEX_DEFAULT_NS,
    status: scoreIndexStatus
  }];
  const status = calculateCspStatusCode({
    findingsLatest: findingsLatestIndexStatus,
    findings: findingsIndexStatus,
    score: scoreIndexStatus
  }, installedPackagePoliciesTotal, healthyAgents, calculateDiffFromNowInMinutes((installation === null || installation === void 0 ? void 0 : installation.install_started_at) || MIN_DATE));
  if (status === 'not-installed') return {
    status,
    indicesDetails,
    latestPackageVersion: latestCspPackageVersion,
    healthyAgents,
    installedPackagePolicies: installedPackagePoliciesTotal
  };
  const response = {
    status,
    indicesDetails,
    latestPackageVersion: latestCspPackageVersion,
    healthyAgents,
    installedPackagePolicies: installedPackagePoliciesTotal,
    installedPackageVersion: installation === null || installation === void 0 ? void 0 : installation.install_version
  };
  assertResponse(response, logger);
  return response;
};
const defineGetCspStatusRoute = router => router.get({
  path: _constants.STATUS_ROUTE_PATH,
  validate: false,
  options: {
    tags: ['access:cloud-security-posture-read']
  }
}, async (context, _, response) => {
  const cspContext = await context.csp;
  try {
    const status = await getCspStatus(cspContext);
    return response.ok({
      body: status
    });
  } catch (err) {
    cspContext.logger.error(`Error getting csp status`);
    cspContext.logger.error(err);
    const error = (0, _securitysolutionEsUtils.transformError)(err);
    return response.customError({
      body: {
        message: error.message
      },
      statusCode: error.statusCode
    });
  }
});
exports.defineGetCspStatusRoute = defineGetCspStatusRoute;