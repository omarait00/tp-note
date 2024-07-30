"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCspPackagePolicies = exports.getCspAgentPolicies = exports.getAgentStatusesByAgentPolicies = exports.PACKAGE_POLICY_SAVED_OBJECT_TYPE = void 0;
var _lodash = require("lodash");
var _benchmark = require("../../common/schemas/benchmark");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const PACKAGE_POLICY_SAVED_OBJECT_TYPE = 'ingest-package-policies';
exports.PACKAGE_POLICY_SAVED_OBJECT_TYPE = PACKAGE_POLICY_SAVED_OBJECT_TYPE;
const getPackageNameQuery = (packageName, benchmarkFilter) => {
  const integrationNameQuery = `${PACKAGE_POLICY_SAVED_OBJECT_TYPE}.package.name:${packageName}`;
  const kquery = benchmarkFilter ? `${integrationNameQuery} AND ${PACKAGE_POLICY_SAVED_OBJECT_TYPE}.name: *${benchmarkFilter}*` : integrationNameQuery;
  return kquery;
};
const getAgentStatusesByAgentPolicies = async (agentService, agentPolicies) => {
  if (!(agentPolicies !== null && agentPolicies !== void 0 && agentPolicies.length)) return {};
  const internalAgentService = agentService.asInternalUser;
  const result = {};
  for (const agentPolicy of agentPolicies) {
    result[agentPolicy.id] = await internalAgentService.getAgentStatusForAgentPolicy(agentPolicy.id);
  }
  return result;
};
exports.getAgentStatusesByAgentPolicies = getAgentStatusesByAgentPolicies;
const getCspAgentPolicies = async (soClient, packagePolicies, agentPolicyService) => agentPolicyService.getByIds(soClient, (0, _lodash.uniq)((0, _lodash.map)(packagePolicies, 'policy_id')), {
  withPackagePolicies: true,
  ignoreMissing: true
});
exports.getCspAgentPolicies = getCspAgentPolicies;
const getCspPackagePolicies = (soClient, packagePolicyService, packageName, queryParams) => {
  var _queryParams$sort_fie;
  const sortField = (_queryParams$sort_fie = queryParams.sort_field) === null || _queryParams$sort_fie === void 0 ? void 0 : _queryParams$sort_fie.replaceAll(_benchmark.BENCHMARK_PACKAGE_POLICY_PREFIX, '');
  return packagePolicyService.list(soClient, {
    kuery: getPackageNameQuery(packageName, queryParams.benchmark_name),
    page: queryParams.page,
    perPage: queryParams.per_page,
    sortField,
    sortOrder: queryParams.sort_order
  });
};
exports.getCspPackagePolicies = getCspPackagePolicies;