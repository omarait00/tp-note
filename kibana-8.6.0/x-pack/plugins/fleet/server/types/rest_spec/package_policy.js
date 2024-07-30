"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UpgradePackagePoliciesRequestSchema = exports.UpdatePackagePolicyRequestSchema = exports.GetPackagePoliciesRequestSchema = exports.GetOnePackagePolicyRequestSchema = exports.DryRunPackagePoliciesRequestSchema = exports.DeletePackagePoliciesRequestSchema = exports.DeleteOnePackagePolicyRequestSchema = exports.CreatePackagePolicyRequestSchema = exports.BulkGetPackagePoliciesRequestSchema = void 0;
var _configSchema = require("@kbn/config-schema");
var _models = require("../models");
var _common = require("./common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const GetPackagePoliciesRequestSchema = {
  query: _common.ListWithKuerySchema
};
exports.GetPackagePoliciesRequestSchema = GetPackagePoliciesRequestSchema;
const BulkGetPackagePoliciesRequestSchema = {
  body: _common.BulkRequestBodySchema
};
exports.BulkGetPackagePoliciesRequestSchema = BulkGetPackagePoliciesRequestSchema;
const GetOnePackagePolicyRequestSchema = {
  params: _configSchema.schema.object({
    packagePolicyId: _configSchema.schema.string()
  })
};
exports.GetOnePackagePolicyRequestSchema = GetOnePackagePolicyRequestSchema;
const CreatePackagePolicyRequestSchema = {
  body: _configSchema.schema.oneOf([_models.CreatePackagePolicyRequestBodySchema, _models.SimplifiedCreatePackagePolicyRequestBodySchema])
};
exports.CreatePackagePolicyRequestSchema = CreatePackagePolicyRequestSchema;
const UpdatePackagePolicyRequestSchema = {
  ...GetOnePackagePolicyRequestSchema,
  body: _configSchema.schema.oneOf([_models.UpdatePackagePolicyRequestBodySchema, _models.SimplifiedCreatePackagePolicyRequestBodySchema])
};
exports.UpdatePackagePolicyRequestSchema = UpdatePackagePolicyRequestSchema;
const DeletePackagePoliciesRequestSchema = {
  body: _configSchema.schema.object({
    packagePolicyIds: _configSchema.schema.arrayOf(_configSchema.schema.string()),
    force: _configSchema.schema.maybe(_configSchema.schema.boolean())
  })
};
exports.DeletePackagePoliciesRequestSchema = DeletePackagePoliciesRequestSchema;
const DeleteOnePackagePolicyRequestSchema = {
  params: _configSchema.schema.object({
    packagePolicyId: _configSchema.schema.string()
  }),
  query: _configSchema.schema.object({
    force: _configSchema.schema.maybe(_configSchema.schema.boolean())
  })
};
exports.DeleteOnePackagePolicyRequestSchema = DeleteOnePackagePolicyRequestSchema;
const UpgradePackagePoliciesRequestSchema = {
  body: _configSchema.schema.object({
    packagePolicyIds: _configSchema.schema.arrayOf(_configSchema.schema.string())
  })
};
exports.UpgradePackagePoliciesRequestSchema = UpgradePackagePoliciesRequestSchema;
const DryRunPackagePoliciesRequestSchema = {
  body: _configSchema.schema.object({
    packagePolicyIds: _configSchema.schema.arrayOf(_configSchema.schema.string()),
    packageVersion: _configSchema.schema.maybe(_configSchema.schema.string())
  })
};
exports.DryRunPackagePoliciesRequestSchema = DryRunPackagePoliciesRequestSchema;