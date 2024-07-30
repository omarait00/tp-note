"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installILMPolicy = installILMPolicy;
var _types = require("../../../../types");
var _archive = require("../../archive");
var _install = require("../../packages/install");
var _meta = require("../meta");
var _retry = require("../retry");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function installILMPolicy(packageInfo, paths, esClient, savedObjectsClient, logger, esReferences) {
  const ilmPaths = paths.filter(path => isILMPolicy(path));
  if (!ilmPaths.length) return esReferences;
  const ilmPolicies = ilmPaths.map(path => {
    const body = JSON.parse((0, _archive.getAsset)(path).toString('utf-8'));
    body.policy._meta = (0, _meta.getESAssetMetadata)({
      packageName: packageInfo.name
    });
    const {
      file
    } = (0, _archive.getPathParts)(path);
    const name = file.substr(0, file.lastIndexOf('.'));
    return {
      name,
      body
    };
  });
  esReferences = await (0, _install.updateEsAssetReferences)(savedObjectsClient, packageInfo.name, esReferences, {
    assetsToAdd: ilmPolicies.map(policy => ({
      type: _types.ElasticsearchAssetType.ilmPolicy,
      id: policy.name
    }))
  });
  await Promise.all(ilmPolicies.map(async policy => {
    try {
      await (0, _retry.retryTransientEsErrors)(() => esClient.transport.request({
        method: 'PUT',
        path: '/_ilm/policy/' + policy.name,
        body: policy.body
      }), {
        logger
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }));
  return esReferences;
}
const isILMPolicy = path => {
  const pathParts = (0, _archive.getPathParts)(path);
  return pathParts.type === _types.ElasticsearchAssetType.ilmPolicy;
};