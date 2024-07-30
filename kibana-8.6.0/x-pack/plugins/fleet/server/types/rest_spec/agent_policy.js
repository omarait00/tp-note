"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UpdateAgentPolicyRequestSchema = exports.GetOneAgentPolicyRequestSchema = exports.GetK8sManifestRequestSchema = exports.GetFullAgentPolicyRequestSchema = exports.GetAgentPoliciesRequestSchema = exports.DeleteAgentPolicyRequestSchema = exports.CreateAgentPolicyRequestSchema = exports.CopyAgentPolicyRequestSchema = exports.BulkGetAgentPoliciesRequestSchema = void 0;
var _configSchema = require("@kbn/config-schema");
var _models = require("../models");
var _common = require("./common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const GetAgentPoliciesRequestSchema = {
  query: _common.ListWithKuerySchema.extends({
    full: _configSchema.schema.maybe(_configSchema.schema.boolean())
  })
};
exports.GetAgentPoliciesRequestSchema = GetAgentPoliciesRequestSchema;
const BulkGetAgentPoliciesRequestSchema = {
  body: _common.BulkRequestBodySchema.extends({
    full: _configSchema.schema.maybe(_configSchema.schema.boolean())
  })
};
exports.BulkGetAgentPoliciesRequestSchema = BulkGetAgentPoliciesRequestSchema;
const GetOneAgentPolicyRequestSchema = {
  params: _configSchema.schema.object({
    agentPolicyId: _configSchema.schema.string()
  })
};
exports.GetOneAgentPolicyRequestSchema = GetOneAgentPolicyRequestSchema;
const CreateAgentPolicyRequestSchema = {
  body: _models.NewAgentPolicySchema,
  query: _configSchema.schema.object({
    sys_monitoring: _configSchema.schema.maybe(_configSchema.schema.boolean())
  })
};
exports.CreateAgentPolicyRequestSchema = CreateAgentPolicyRequestSchema;
const UpdateAgentPolicyRequestSchema = {
  ...GetOneAgentPolicyRequestSchema,
  body: _models.NewAgentPolicySchema.extends({
    force: _configSchema.schema.maybe(_configSchema.schema.boolean())
  })
};
exports.UpdateAgentPolicyRequestSchema = UpdateAgentPolicyRequestSchema;
const CopyAgentPolicyRequestSchema = {
  ...GetOneAgentPolicyRequestSchema,
  body: _configSchema.schema.object({
    name: _configSchema.schema.string({
      minLength: 1
    }),
    description: _configSchema.schema.maybe(_configSchema.schema.string())
  })
};
exports.CopyAgentPolicyRequestSchema = CopyAgentPolicyRequestSchema;
const DeleteAgentPolicyRequestSchema = {
  body: _configSchema.schema.object({
    agentPolicyId: _configSchema.schema.string()
  })
};
exports.DeleteAgentPolicyRequestSchema = DeleteAgentPolicyRequestSchema;
const GetFullAgentPolicyRequestSchema = {
  params: _configSchema.schema.object({
    agentPolicyId: _configSchema.schema.string()
  }),
  query: _configSchema.schema.object({
    download: _configSchema.schema.maybe(_configSchema.schema.boolean()),
    standalone: _configSchema.schema.maybe(_configSchema.schema.boolean()),
    kubernetes: _configSchema.schema.maybe(_configSchema.schema.boolean())
  })
};
exports.GetFullAgentPolicyRequestSchema = GetFullAgentPolicyRequestSchema;
const GetK8sManifestRequestSchema = {
  query: _configSchema.schema.object({
    download: _configSchema.schema.maybe(_configSchema.schema.boolean()),
    fleetServer: _configSchema.schema.maybe(_configSchema.schema.string()),
    enrolToken: _configSchema.schema.maybe(_configSchema.schema.string())
  })
};
exports.GetK8sManifestRequestSchema = GetK8sManifestRequestSchema;