"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStatusRoute = void 0;
var _immer = require("immer");
var _semver = require("semver");
var _lodash = require("lodash");
var _common = require("../../../../fleet/common");
var _types = require("../../../common/types");
var _common2 = require("../../../common");
var _utils = require("../pack/utils");
var _utils2 = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createStatusRoute = (router, osqueryContext) => {
  router.get({
    path: '/internal/osquery/status',
    validate: false,
    options: {
      tags: [`access:${_common2.PLUGIN_ID}-read`]
    }
  }, async (context, request, response) => {
    var _osqueryContext$servi;
    const coreContext = await context.core;
    const esClient = coreContext.elasticsearch.client.asInternalUser;
    const internalSavedObjectsClient = await (0, _utils2.getInternalSavedObjectsClient)(osqueryContext.getStartServices);
    const packageService = (_osqueryContext$servi = osqueryContext.service.getPackageService()) === null || _osqueryContext$servi === void 0 ? void 0 : _osqueryContext$servi.asInternalUser;
    const packagePolicyService = osqueryContext.service.getPackagePolicyService();
    const agentPolicyService = osqueryContext.service.getAgentPolicyService();
    const packageInfo = await (packageService === null || packageService === void 0 ? void 0 : packageService.getInstallation(_common2.OSQUERY_INTEGRATION_NAME));
    if (packageInfo !== null && packageInfo !== void 0 && packageInfo.install_version && (0, _semver.satisfies)(packageInfo === null || packageInfo === void 0 ? void 0 : packageInfo.install_version, '<0.6.0')) {
      try {
        const policyPackages = await (packagePolicyService === null || packagePolicyService === void 0 ? void 0 : packagePolicyService.list(internalSavedObjectsClient, {
          kuery: `${_common.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.package.name:${_common2.OSQUERY_INTEGRATION_NAME}`,
          perPage: 10000,
          page: 1
        }));
        const migrationObject = (0, _lodash.reduce)(policyPackages === null || policyPackages === void 0 ? void 0 : policyPackages.items, (acc, policy) => {
          if (acc.agentPolicyToPackage[policy.policy_id]) {
            acc.packagePoliciesToDelete.push(policy.id);
          } else {
            acc.agentPolicyToPackage[policy.policy_id] = policy.id;
          }
          const packagePolicyName = policy.name;
          const currentOsqueryManagerNamePacksCount = (0, _lodash.filter)(Object.keys(acc.packs), packName => packName.startsWith(_common2.OSQUERY_INTEGRATION_NAME)).length;
          const packName = packagePolicyName.startsWith(_common2.OSQUERY_INTEGRATION_NAME) ? `osquery_manager-1_${currentOsqueryManagerNamePacksCount + 1}` : packagePolicyName;
          if ((0, _lodash.has)(policy, 'inputs[0].streams[0]')) {
            if (!acc.packs[packName]) {
              acc.packs[packName] = {
                policy_ids: [policy.policy_id],
                enabled: !packName.startsWith(_common2.OSQUERY_INTEGRATION_NAME),
                name: packName,
                description: policy.description,
                queries: (0, _lodash.reduce)(policy.inputs[0].streams, (queries, stream) => {
                  var _stream$compiled_stre;
                  if ((_stream$compiled_stre = stream.compiled_stream) !== null && _stream$compiled_stre !== void 0 && _stream$compiled_stre.id) {
                    const {
                      id: queryId,
                      ...query
                    } = stream.compiled_stream;
                    queries[queryId] = query;
                  }
                  return queries;
                }, {})
              };
            } else {
              acc.packs[packName].policy_ids.push(policy.policy_id);
            }
          }
          return acc;
        }, {
          packs: {},
          agentPolicyToPackage: {},
          packagePoliciesToDelete: []
        });
        await (packageService === null || packageService === void 0 ? void 0 : packageService.ensureInstalledPackage({
          pkgName: _common2.OSQUERY_INTEGRATION_NAME
        }));
        const agentPolicyIds = (0, _lodash.uniq)((0, _lodash.map)(policyPackages === null || policyPackages === void 0 ? void 0 : policyPackages.items, 'policy_id'));
        const agentPolicies = (0, _lodash.mapKeys)(await (agentPolicyService === null || agentPolicyService === void 0 ? void 0 : agentPolicyService.getByIds(internalSavedObjectsClient, agentPolicyIds)), 'id');
        await Promise.all((0, _lodash.map)(migrationObject.packs, async packObject => {
          await internalSavedObjectsClient.create(_types.packSavedObjectType, {
            name: packObject.name,
            description: packObject.description,
            queries: (0, _utils.convertPackQueriesToSO)(packObject.queries),
            enabled: packObject.enabled,
            created_at: new Date().toISOString(),
            created_by: 'system',
            updated_at: new Date().toISOString(),
            updated_by: 'system'
          }, {
            references: packObject.policy_ids.map(policyId => ({
              id: policyId,
              name: agentPolicies[policyId].name,
              type: _common.AGENT_POLICY_SAVED_OBJECT_TYPE
            })),
            refresh: 'wait_for'
          });
        }));

        // delete unnecessary package policies
        await (packagePolicyService === null || packagePolicyService === void 0 ? void 0 : packagePolicyService.delete(internalSavedObjectsClient, esClient, migrationObject.packagePoliciesToDelete));

        // updatePackagePolicies
        await Promise.all((0, _lodash.map)(migrationObject.agentPolicyToPackage, async (value, key) => {
          const agentPacks = (0, _lodash.filter)(migrationObject.packs, pack => pack.policy_ids.includes(key));
          await (packagePolicyService === null || packagePolicyService === void 0 ? void 0 : packagePolicyService.upgrade(internalSavedObjectsClient, esClient, [value]));
          const packagePolicy = await (packagePolicyService === null || packagePolicyService === void 0 ? void 0 : packagePolicyService.get(internalSavedObjectsClient, value));
          if (packagePolicy) {
            return packagePolicyService === null || packagePolicyService === void 0 ? void 0 : packagePolicyService.update(internalSavedObjectsClient, esClient, packagePolicy.id, (0, _immer.produce)(packagePolicy, draft => {
              (0, _lodash.unset)(draft, 'id');
              (0, _lodash.set)(draft, 'name', 'osquery_manager-1');
              (0, _lodash.set)(draft, 'inputs[0]', {
                enabled: true,
                policy_template: _common2.OSQUERY_INTEGRATION_NAME,
                streams: [],
                type: 'osquery'
              });
              (0, _lodash.each)(agentPacks, agentPack => {
                (0, _lodash.set)(draft, `inputs[0].config.osquery.value.packs.${agentPack.name}`, {
                  queries: agentPack.queries
                });
              });
              return draft;
            }));
          }
        }));
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }
    return response.ok({
      body: packageInfo
    });
  });
};
exports.createStatusRoute = createStatusRoute;