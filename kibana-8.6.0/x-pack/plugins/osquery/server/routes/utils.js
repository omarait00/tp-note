"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInternalSavedObjectsClient = exports.convertShardsToObject = exports.convertShardsToArray = exports.convertECSMappingToObject = exports.convertECSMappingToArray = void 0;
var _server = require("../../../../../src/core/server");
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const convertECSMappingToArray = ecsMapping => ecsMapping ? Object.entries(ecsMapping).map(item => ({
  key: item[0],
  value: item[1]
})) : undefined;
exports.convertECSMappingToArray = convertECSMappingToArray;
const convertECSMappingToObject = ecsMapping => (0, _lodash.reduce)(ecsMapping, (acc, value) => {
  acc[value.key] = value.value;
  return acc;
}, {});
exports.convertECSMappingToObject = convertECSMappingToObject;
const convertShardsToArray = shards => Object.entries(shards).map(item => ({
  key: item[0],
  value: item[1]
}));
exports.convertShardsToArray = convertShardsToArray;
const convertShardsToObject = shards => (0, _lodash.reduce)(shards, (acc, value) => {
  acc[value.key] = value.value;
  return acc;
}, {});
exports.convertShardsToObject = convertShardsToObject;
const getInternalSavedObjectsClient = async getStartServices => {
  const [coreStart] = await getStartServices();
  return new _server.SavedObjectsClient(coreStart.savedObjects.createInternalRepository());
};
exports.getInternalSavedObjectsClient = getInternalSavedObjectsClient;