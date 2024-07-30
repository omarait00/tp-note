"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateGlobalPacksCreateCallback = void 0;
var _lodash = require("lodash");
var _common = require("../../../fleet/common");
var _immer = _interopRequireDefault(require("immer"));
var _utils = require("../routes/utils");
var _types = require("../../common/types");
var _utils2 = require("../routes/pack/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const updateGlobalPacksCreateCallback = async (packagePolicy, packsClient, allPacks, osqueryContext, esClient) => {
  const agentPolicyService = osqueryContext.getAgentPolicyService();
  const packagePolicyService = osqueryContext.getPackagePolicyService();
  const agentPoliciesResult = await (agentPolicyService === null || agentPolicyService === void 0 ? void 0 : agentPolicyService.getByIds(packsClient, [packagePolicy.policy_id]));
  const agentPolicyResultIds = (0, _lodash.map)(agentPoliciesResult, 'id');
  const agentPolicies = agentPoliciesResult ? (0, _lodash.mapKeys)(await (agentPolicyService === null || agentPolicyService === void 0 ? void 0 : agentPolicyService.getByIds(packsClient, agentPolicyResultIds)), 'id') : {};
  const packsContainingShardForPolicy = [];
  allPacks.saved_objects.map(pack => {
    const shards = (0, _utils.convertShardsToObject)(pack.attributes.shards);
    return (0, _lodash.map)(shards, (shard, shardName) => {
      if (shardName === '*') {
        packsContainingShardForPolicy.push(pack);
      }
    });
  });
  if (packsContainingShardForPolicy.length) {
    await Promise.all((0, _lodash.map)(packsContainingShardForPolicy, pack => {
      var _agentPolicies$packag;
      packsClient.update(_types.packSavedObjectType, pack.id, {}, {
        references: [...pack.references, {
          id: packagePolicy.policy_id,
          name: (_agentPolicies$packag = agentPolicies[packagePolicy.policy_id]) === null || _agentPolicies$packag === void 0 ? void 0 : _agentPolicies$packag.name,
          type: _common.AGENT_POLICY_SAVED_OBJECT_TYPE
        }]
      });
    }));
    await (packagePolicyService === null || packagePolicyService === void 0 ? void 0 : packagePolicyService.update(packsClient, esClient, packagePolicy.id, (0, _immer.default)(packagePolicy, draft => {
      (0, _lodash.unset)(draft, 'id');
      if (!(0, _lodash.has)(draft, 'inputs[0].streams')) {
        (0, _lodash.set)(draft, 'inputs[0].streams', []);
      }
      (0, _lodash.map)(packsContainingShardForPolicy, pack => {
        (0, _lodash.set)(draft, `inputs[0].config.osquery.value.packs.${pack.attributes.name}`, {
          shard: 100,
          queries: (0, _utils2.convertSOQueriesToPackConfig)(pack.attributes.queries)
        });
      });
      return draft;
    })));
  }
};
exports.updateGlobalPacksCreateCallback = updateGlobalPacksCreateCallback;