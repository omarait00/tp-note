"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templateSavedQueries = exports.templatePacks = exports.templateConfigs = void 0;
var _lodash = require("lodash");
var _common = require("../../../../fleet/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Constructs the configs telemetry schema from a collection of config saved objects
 */
const templateConfigs = configsData => configsData.map(item => {
  var _item$package, _find, _find$config;
  return {
    id: item.id,
    version: (_item$package = item.package) === null || _item$package === void 0 ? void 0 : _item$package.version,
    enabled: item.enabled,
    config: (_find = (0, _lodash.find)(item.inputs, ['type', 'osquery'])) === null || _find === void 0 ? void 0 : (_find$config = _find.config) === null || _find$config === void 0 ? void 0 : _find$config.osquery.value
  };
});

/**
 * Constructs the packs telemetry schema from a collection of packs saved objects
 */
exports.templateConfigs = templateConfigs;
const templatePacks = packsData => {
  const nonEmptyQueryPacks = (0, _lodash.filter)(packsData, pack => !(0, _lodash.isEmpty)(pack.attributes.queries));
  return nonEmptyQueryPacks.map(item => {
    var _ref;
    return (0, _lodash.pick)({
      name: item.attributes.name,
      enabled: item.attributes.enabled,
      queries: item.attributes.queries,
      policies: (_ref = ((0, _lodash.filter)(item.references, ['type', _common.AGENT_POLICY_SAVED_OBJECT_TYPE]), 'id')) === null || _ref === void 0 ? void 0 : _ref.length,
      prebuilt: !!(0, _lodash.filter)(item.references, ['type', 'osquery-pack-asset']) && item.attributes.version !== undefined
    }, ['name', 'queries', 'policies', 'prebuilt', 'enabled']);
  });
};

/**
 * Constructs the packs telemetry schema from a collection of packs saved objects
 */
exports.templatePacks = templatePacks;
const templateSavedQueries = (savedQueriesData, prebuiltSavedQueryIds) => savedQueriesData.map(item => ({
  id: item.attributes.id,
  query: item.attributes.query,
  platform: item.attributes.platform,
  interval: (0, _lodash.isString)(item.attributes.interval) ? parseInt(item.attributes.interval, 10) : item.attributes.interval,
  ...(!(0, _lodash.isEmpty)(item.attributes.snapshot) ? {
    snapshot: item.attributes.snapshot
  } : {}),
  ...(!(0, _lodash.isEmpty)(item.attributes.removed) ? {
    snapshot: item.attributes.removed
  } : {}),
  ...(!(0, _lodash.isEmpty)(item.attributes.ecs_mapping) ? {
    ecs_mapping: item.attributes.ecs_mapping
  } : {}),
  prebuilt: prebuiltSavedQueryIds.includes(item.id)
}));
exports.templateSavedQueries = templateSavedQueries;