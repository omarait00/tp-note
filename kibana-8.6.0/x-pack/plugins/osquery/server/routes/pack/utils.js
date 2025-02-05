"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInitialPolicies = exports.findMatchingShards = exports.convertSOQueriesToPackConfig = exports.convertSOQueriesToPack = exports.convertPackQueriesToSO = void 0;
var _lodash = require("lodash");
var _semver = require("semver");
var _constants = require("../../../common/constants");
var _remove_multilines = require("../../../common/utils/build_query/remove_multilines");
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// @ts-expect-error update types
const convertPackQueriesToSO = queries => (0, _lodash.reduce)(queries, (acc, value, key) => {
  const ecsMapping = value.ecs_mapping && (0, _utils.convertECSMappingToArray)(value.ecs_mapping);
  acc.push({
    id: key,
    ...(0, _lodash.pick)(value, ['name', 'query', 'interval', 'platform', 'version', 'snapshot', 'removed']),
    ...(ecsMapping ? {
      ecs_mapping: ecsMapping
    } : {})
  });
  return acc;
}, []);
exports.convertPackQueriesToSO = convertPackQueriesToSO;
const convertSOQueriesToPack = (
// @ts-expect-error update types
queries) => (0, _lodash.reduce)(queries,
// eslint-disable-next-line @typescript-eslint/naming-convention
(acc, {
  id: queryId,
  ecs_mapping,
  query,
  platform,
  ...rest
}, key) => {
  const index = queryId ? queryId : key;
  acc[index] = {
    ...rest,
    query,
    ...(!(0, _lodash.isEmpty)(ecs_mapping) ? (0, _lodash.isArray)(ecs_mapping) ? {
      ecs_mapping: (0, _utils.convertECSMappingToObject)(ecs_mapping)
    } : {
      ecs_mapping
    } : {}),
    ...(platform === _constants.DEFAULT_PLATFORM || platform === undefined ? {} : {
      platform
    })
  };
  return acc;
},
// eslint-disable-next-line @typescript-eslint/no-explicit-any
{});
exports.convertSOQueriesToPack = convertSOQueriesToPack;
const convertSOQueriesToPackConfig = (
// @ts-expect-error update types
queries) => (0, _lodash.reduce)(queries,
// eslint-disable-next-line @typescript-eslint/naming-convention
(acc, {
  id: queryId,
  ecs_mapping,
  query,
  platform,
  removed,
  snapshot,
  ...rest
}, key) => {
  const resultType = snapshot === false ? {
    removed,
    snapshot
  } : {};
  const index = queryId ? queryId : key;
  acc[index] = {
    ...rest,
    query: (0, _remove_multilines.removeMultilines)(query),
    ...(!(0, _lodash.isEmpty)(ecs_mapping) ? (0, _lodash.isArray)(ecs_mapping) ? {
      ecs_mapping: (0, _utils.convertECSMappingToObject)(ecs_mapping)
    } : {
      ecs_mapping
    } : {}),
    ...(platform === _constants.DEFAULT_PLATFORM || platform === undefined ? {} : {
      platform
    }),
    ...resultType
  };
  return acc;
},
// eslint-disable-next-line @typescript-eslint/no-explicit-any
{});
exports.convertSOQueriesToPackConfig = convertSOQueriesToPackConfig;
const getInitialPolicies = (packagePolicies, policyIds = [], shards) => {
  // we want to find all policies, because this is a global pack
  if (shards !== null && shards !== void 0 && shards['*']) {
    const supportedPackagePolicyIds = (0, _lodash.filter)(packagePolicies, packagePolicy => {
      var _packagePolicy$packag, _packagePolicy$packag2;
      return (0, _semver.satisfies)((_packagePolicy$packag = (_packagePolicy$packag2 = packagePolicy.package) === null || _packagePolicy$packag2 === void 0 ? void 0 : _packagePolicy$packag2.version) !== null && _packagePolicy$packag !== void 0 ? _packagePolicy$packag : '', '>=0.6.0');
    });
    return (0, _lodash.uniq)((0, _lodash.map)(supportedPackagePolicyIds, 'policy_id'));
  }
  return policyIds;
};
exports.getInitialPolicies = getInitialPolicies;
const findMatchingShards = (agentPolicies, shards) => {
  const policyShards = {};
  if (!(0, _lodash.isEmpty)(shards)) {
    const agentPoliciesIdMap = (0, _lodash.mapKeys)(agentPolicies, 'id');
    (0, _lodash.map)(shards, (shard, shardName) => {
      if (agentPoliciesIdMap[shardName]) {
        policyShards[agentPoliciesIdMap[shardName].id] = shard;
      }
    });
  }
  return policyShards;
};
exports.findMatchingShards = findMatchingShards;