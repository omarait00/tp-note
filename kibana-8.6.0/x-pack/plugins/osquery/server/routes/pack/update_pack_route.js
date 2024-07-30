"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePackRoute = void 0;
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _lodash = require("lodash");
var _configSchema = require("@kbn/config-schema");
var _immer = require("immer");
var _common = require("../../../../fleet/common");
var _common2 = require("../../../common");
var _types = require("../../../common/types");
var _utils = require("./utils");
var _utils2 = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const updatePackRoute = (router, osqueryContext) => {
  router.put({
    path: '/api/osquery/packs/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      }, {
        unknowns: 'allow'
      }),
      body: _configSchema.schema.object({
        name: _configSchema.schema.maybe(_configSchema.schema.string()),
        description: _configSchema.schema.maybe(_configSchema.schema.string()),
        enabled: _configSchema.schema.maybe(_configSchema.schema.boolean()),
        policy_ids: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
        shards: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.number())),
        queries: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.object({
          query: _configSchema.schema.string(),
          interval: _configSchema.schema.maybe(_configSchema.schema.number()),
          snapshot: _configSchema.schema.maybe(_configSchema.schema.boolean()),
          removed: _configSchema.schema.maybe(_configSchema.schema.boolean()),
          platform: _configSchema.schema.maybe(_configSchema.schema.string()),
          version: _configSchema.schema.maybe(_configSchema.schema.string()),
          ecs_mapping: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.object({
            field: _configSchema.schema.maybe(_configSchema.schema.string()),
            value: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())]))
          })))
        })))
      }, {
        unknowns: 'allow'
      })
    },
    options: {
      tags: [`access:${_common2.PLUGIN_ID}-writePacks`]
    }
  }, async (context, request, response) => {
    var _osqueryContext$secur, _await$packagePolicyS;
    const coreContext = await context.core;
    const esClient = coreContext.elasticsearch.client.asCurrentUser;
    const savedObjectsClient = coreContext.savedObjects.client;
    const internalSavedObjectsClient = await (0, _utils2.getInternalSavedObjectsClient)(osqueryContext.getStartServices);
    const agentPolicyService = osqueryContext.service.getAgentPolicyService();
    const packagePolicyService = osqueryContext.service.getPackagePolicyService();
    const currentUser = await ((_osqueryContext$secur = osqueryContext.security.authc.getCurrentUser(request)) === null || _osqueryContext$secur === void 0 ? void 0 : _osqueryContext$secur.username);

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const {
      name,
      description,
      queries,
      enabled,
      policy_ids,
      shards = {}
    } = request.body;
    const currentPackSO = await savedObjectsClient.get(_types.packSavedObjectType, request.params.id);
    if (name) {
      const conflictingEntries = await savedObjectsClient.find({
        type: _types.packSavedObjectType,
        filter: `${_types.packSavedObjectType}.attributes.name: "${name}"`
      });
      if ((0, _lodash.some)((0, _lodash.filter)(conflictingEntries.saved_objects, packSO => packSO.id !== currentPackSO.id), ['attributes.name', name])) {
        return response.conflict({
          body: `Pack with name "${name}" already exists.`
        });
      }
    }
    const {
      items: packagePolicies
    } = (_await$packagePolicyS = await (packagePolicyService === null || packagePolicyService === void 0 ? void 0 : packagePolicyService.list(internalSavedObjectsClient, {
      kuery: `${_common.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.package.name:${_common2.OSQUERY_INTEGRATION_NAME}`,
      perPage: 1000,
      page: 1
    }))) !== null && _await$packagePolicyS !== void 0 ? _await$packagePolicyS : {
      items: []
    };
    const currentPackagePolicies = (0, _lodash.filter)(packagePolicies, packagePolicy => (0, _lodash.has)(packagePolicy, `inputs[0].config.osquery.value.packs.${currentPackSO.attributes.name}`));
    const policiesList = (0, _utils.getInitialPolicies)(packagePolicies, policy_ids, shards);
    const agentPolicies = await (agentPolicyService === null || agentPolicyService === void 0 ? void 0 : agentPolicyService.getByIds(internalSavedObjectsClient, policiesList));
    const policyShards = (0, _utils.findMatchingShards)(agentPolicies, shards);
    const agentPoliciesIdMap = (0, _lodash.mapKeys)(agentPolicies, 'id');
    const nonAgentPolicyReferences = (0, _lodash.filter)(currentPackSO.references, reference => reference.type !== _common.AGENT_POLICY_SAVED_OBJECT_TYPE);
    const getUpdatedReferences = () => {
      if (!policy_ids && (0, _lodash.isEmpty)(shards)) {
        return currentPackSO.references;
      }
      return [...nonAgentPolicyReferences, ...policiesList.map(id => {
        var _agentPoliciesIdMap$i;
        return {
          id,
          name: (_agentPoliciesIdMap$i = agentPoliciesIdMap[id]) === null || _agentPoliciesIdMap$i === void 0 ? void 0 : _agentPoliciesIdMap$i.name,
          type: _common.AGENT_POLICY_SAVED_OBJECT_TYPE
        };
      })];
    };
    const references = getUpdatedReferences();
    await savedObjectsClient.update(_types.packSavedObjectType, request.params.id, {
      enabled,
      name,
      description: description || '',
      queries: queries && (0, _utils.convertPackQueriesToSO)(queries),
      updated_at: (0, _momentTimezone.default)().toISOString(),
      updated_by: currentUser,
      shards: (0, _utils2.convertShardsToArray)(shards)
    }, {
      refresh: 'wait_for',
      references
    });
    const currentAgentPolicyIds = (0, _lodash.map)((0, _lodash.filter)(currentPackSO.references, ['type', _common.AGENT_POLICY_SAVED_OBJECT_TYPE]), 'id');
    const updatedPackSO = await savedObjectsClient.get(_types.packSavedObjectType, request.params.id);
    updatedPackSO.attributes.queries = (0, _utils.convertSOQueriesToPack)(updatedPackSO.attributes.queries);
    if (enabled == null && !currentPackSO.attributes.enabled) {
      return response.ok({
        body: updatedPackSO
      });
    }
    if (enabled != null && enabled !== currentPackSO.attributes.enabled) {
      if (enabled) {
        const policyIds = policy_ids || !(0, _lodash.isEmpty)(shards) ? policiesList : currentAgentPolicyIds;
        await Promise.all(policyIds.map(agentPolicyId => {
          const packagePolicy = (0, _lodash.find)(packagePolicies, ['policy_id', agentPolicyId]);
          if (packagePolicy) {
            return packagePolicyService === null || packagePolicyService === void 0 ? void 0 : packagePolicyService.update(internalSavedObjectsClient, esClient, packagePolicy.id, (0, _immer.produce)(packagePolicy, draft => {
              (0, _lodash.unset)(draft, 'id');
              if (!(0, _lodash.has)(draft, 'inputs[0].streams')) {
                (0, _lodash.set)(draft, 'inputs[0].streams', []);
              }
              (0, _lodash.set)(draft, `inputs[0].config.osquery.value.packs.${updatedPackSO.attributes.name}`, {
                queries: updatedPackSO.attributes.queries
              });
              return draft;
            }));
          }
        }));
      } else {
        await Promise.all(currentAgentPolicyIds.map(agentPolicyId => {
          const packagePolicy = (0, _lodash.find)(currentPackagePolicies, ['policy_id', agentPolicyId]);
          if (!packagePolicy) return;
          return packagePolicyService === null || packagePolicyService === void 0 ? void 0 : packagePolicyService.update(internalSavedObjectsClient, esClient, packagePolicy.id, (0, _immer.produce)(packagePolicy, draft => {
            (0, _lodash.unset)(draft, 'id');
            (0, _lodash.unset)(draft, `inputs[0].config.osquery.value.packs.${currentPackSO.attributes.name}`);
            return draft;
          }));
        }));
      }
    } else {
      // TODO double check if policiesList shouldnt be changed into policyIds
      const agentPolicyIdsToRemove = (0, _lodash.uniq)((0, _lodash.difference)(currentAgentPolicyIds, policiesList));
      const agentPolicyIdsToUpdate = (0, _lodash.uniq)((0, _lodash.difference)(currentAgentPolicyIds, agentPolicyIdsToRemove));
      const agentPolicyIdsToAdd = (0, _lodash.uniq)((0, _lodash.difference)(policiesList, currentAgentPolicyIds));
      await Promise.all(agentPolicyIdsToRemove.map(agentPolicyId => {
        const packagePolicy = (0, _lodash.find)(currentPackagePolicies, ['policy_id', agentPolicyId]);
        if (packagePolicy) {
          return packagePolicyService === null || packagePolicyService === void 0 ? void 0 : packagePolicyService.update(internalSavedObjectsClient, esClient, packagePolicy.id, (0, _immer.produce)(packagePolicy, draft => {
            (0, _lodash.unset)(draft, 'id');
            (0, _lodash.unset)(draft, `inputs[0].config.osquery.value.packs.${currentPackSO.attributes.name}`);
            return draft;
          }));
        }
      }));
      await Promise.all(agentPolicyIdsToUpdate.map(agentPolicyId => {
        const packagePolicy = (0, _lodash.find)(packagePolicies, ['policy_id', agentPolicyId]);
        if (packagePolicy) {
          return packagePolicyService === null || packagePolicyService === void 0 ? void 0 : packagePolicyService.update(internalSavedObjectsClient, esClient, packagePolicy.id, (0, _immer.produce)(packagePolicy, draft => {
            (0, _lodash.unset)(draft, 'id');
            if (updatedPackSO.attributes.name !== currentPackSO.attributes.name) {
              (0, _lodash.unset)(draft, `inputs[0].config.osquery.value.packs.${currentPackSO.attributes.name}`);
            }
            (0, _lodash.set)(draft, `inputs[0].config.osquery.value.packs.${updatedPackSO.attributes.name}`, {
              shard: policyShards[packagePolicy.policy_id] ? policyShards[packagePolicy.policy_id] : 100,
              queries: (0, _utils.convertSOQueriesToPackConfig)(updatedPackSO.attributes.queries)
            });
            return draft;
          }));
        }
      }));
      await Promise.all(agentPolicyIdsToAdd.map(agentPolicyId => {
        const packagePolicy = (0, _lodash.find)(packagePolicies, ['policy_id', agentPolicyId]);
        if (packagePolicy) {
          return packagePolicyService === null || packagePolicyService === void 0 ? void 0 : packagePolicyService.update(internalSavedObjectsClient, esClient, packagePolicy.id, (0, _immer.produce)(packagePolicy, draft => {
            (0, _lodash.unset)(draft, 'id');
            if (!(draft.inputs.length && draft.inputs[0].streams.length)) {
              (0, _lodash.set)(draft, 'inputs[0].streams', []);
            }
            (0, _lodash.set)(draft, `inputs[0].config.osquery.value.packs.${updatedPackSO.attributes.name}`, {
              shard: policyShards[packagePolicy.policy_id] ? policyShards[packagePolicy.policy_id] : 100,
              queries: (0, _utils.convertSOQueriesToPackConfig)(updatedPackSO.attributes.queries)
            });
            return draft;
          }));
        }
      }));
    }
    return response.ok({
      body: {
        data: updatedPackSO
      }
    });
  });
};
exports.updatePackRoute = updatePackRoute;