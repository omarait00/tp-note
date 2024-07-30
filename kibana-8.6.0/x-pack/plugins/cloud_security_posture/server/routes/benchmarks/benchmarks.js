"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCspRulesStatus = exports.defineGetBenchmarksRoute = exports.addPackagePolicyCspRules = exports.PACKAGE_POLICY_SAVED_OBJECT_TYPE = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _constants = require("../../../common/constants");
var _benchmark = require("../../../common/schemas/benchmark");
var _helpers = require("../../../common/utils/helpers");
var _fleet_util = require("../../lib/fleet_util");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const PACKAGE_POLICY_SAVED_OBJECT_TYPE = 'ingest-package-policies';
exports.PACKAGE_POLICY_SAVED_OBJECT_TYPE = PACKAGE_POLICY_SAVED_OBJECT_TYPE;
const getCspRulesStatus = (soClient, packagePolicy) => {
  const cspRules = soClient.find({
    type: _constants.CSP_RULE_SAVED_OBJECT_TYPE,
    filter: (0, _helpers.createCspRuleSearchFilterByPackagePolicy)({
      packagePolicyId: packagePolicy.id,
      policyId: packagePolicy.policy_id
    }),
    aggs: {
      enabled_status: {
        filter: {
          term: {
            [`${_constants.CSP_RULE_SAVED_OBJECT_TYPE}.attributes.enabled`]: true
          }
        }
      }
    },
    perPage: 0
  });
  return cspRules;
};
exports.getCspRulesStatus = getCspRulesStatus;
const addPackagePolicyCspRules = async (soClient, packagePolicy) => {
  var _rules$aggregations, _rules$aggregations2;
  const rules = await getCspRulesStatus(soClient, packagePolicy);
  const packagePolicyRules = {
    all: rules.total,
    enabled: ((_rules$aggregations = rules.aggregations) === null || _rules$aggregations === void 0 ? void 0 : _rules$aggregations.enabled_status.doc_count) || 0,
    disabled: rules.total - (((_rules$aggregations2 = rules.aggregations) === null || _rules$aggregations2 === void 0 ? void 0 : _rules$aggregations2.enabled_status.doc_count) || 0)
  };
  return packagePolicyRules;
};
exports.addPackagePolicyCspRules = addPackagePolicyCspRules;
const createBenchmarks = (soClient, agentPolicies, agentStatusByAgentPolicyId, cspPackagePolicies) => {
  const cspPackagePoliciesMap = new Map(cspPackagePolicies.map(packagePolicy => [packagePolicy.id, packagePolicy]));
  return Promise.all(agentPolicies.flatMap(agentPolicy => {
    var _agentPolicy$package_, _agentPolicy$package_2;
    const cspPackagesOnAgent = (_agentPolicy$package_ = (_agentPolicy$package_2 = agentPolicy.package_policies) === null || _agentPolicy$package_2 === void 0 ? void 0 : _agentPolicy$package_2.map(({
      id: pckPolicyId
    }) => {
      return cspPackagePoliciesMap.get(pckPolicyId);
    }).filter(_helpers.isNonNullable)) !== null && _agentPolicy$package_ !== void 0 ? _agentPolicy$package_ : [];
    const benchmarks = cspPackagesOnAgent.map(async cspPackage => {
      const cspRulesStatus = await addPackagePolicyCspRules(soClient, cspPackage);
      const agentPolicyStatus = {
        id: agentPolicy.id,
        name: agentPolicy.name,
        agents: agentStatusByAgentPolicyId[agentPolicy.id].total
      };
      return {
        package_policy: cspPackage,
        agent_policy: agentPolicyStatus,
        rules: cspRulesStatus
      };
    });
    return benchmarks;
  }));
};
const defineGetBenchmarksRoute = router => router.get({
  path: _constants.BENCHMARKS_ROUTE_PATH,
  validate: {
    query: _benchmark.benchmarksQueryParamsSchema
  },
  options: {
    tags: ['access:cloud-security-posture-read']
  }
}, async (context, request, response) => {
  if (!(await context.fleet).authz.fleet.all) {
    return response.forbidden();
  }
  const cspContext = await context.csp;
  try {
    const cspPackagePolicies = await (0, _fleet_util.getCspPackagePolicies)(cspContext.soClient, cspContext.packagePolicyService, _constants.CLOUD_SECURITY_POSTURE_PACKAGE_NAME, request.query);
    const agentPolicies = await (0, _fleet_util.getCspAgentPolicies)(cspContext.soClient, cspPackagePolicies.items, cspContext.agentPolicyService);
    const agentStatusesByAgentPolicyId = await (0, _fleet_util.getAgentStatusesByAgentPolicies)(cspContext.agentService, agentPolicies);
    const benchmarks = await createBenchmarks(cspContext.soClient, agentPolicies, agentStatusesByAgentPolicyId, cspPackagePolicies.items);
    return response.ok({
      body: {
        ...cspPackagePolicies,
        items: benchmarks
      }
    });
  } catch (err) {
    const error = (0, _securitysolutionEsUtils.transformError)(err);
    cspContext.logger.error(`Failed to fetch benchmarks ${err}`);
    return response.customError({
      body: {
        message: error.message
      },
      statusCode: error.statusCode
    });
  }
});
exports.defineGetBenchmarksRoute = defineGetBenchmarksRoute;