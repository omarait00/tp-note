"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExternalIncidentServiceSecretConfigurationSchema = exports.ExternalIncidentServiceSecretConfiguration = exports.ExternalIncidentServiceConfigurationSchema = exports.ExternalIncidentServiceConfiguration = exports.ExecutorSubActionPushParamsSchema = exports.ExecutorParamsSchema = void 0;
var _configSchema = require("@kbn/config-schema");
var _types = require("./types");
var _nullable = require("../../lib/nullable");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const HeadersSchema = _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.string());
const ExternalIncidentServiceConfiguration = {
  createIncidentUrl: _configSchema.schema.string(),
  createIncidentMethod: _configSchema.schema.oneOf([_configSchema.schema.literal(_types.CasesWebhookMethods.POST), _configSchema.schema.literal(_types.CasesWebhookMethods.PUT)], {
    defaultValue: _types.CasesWebhookMethods.POST
  }),
  createIncidentJson: _configSchema.schema.string(),
  // stringified object
  createIncidentResponseKey: _configSchema.schema.string(),
  getIncidentUrl: _configSchema.schema.string(),
  getIncidentResponseExternalTitleKey: _configSchema.schema.string(),
  viewIncidentUrl: _configSchema.schema.string(),
  updateIncidentUrl: _configSchema.schema.string(),
  updateIncidentMethod: _configSchema.schema.oneOf([_configSchema.schema.literal(_types.CasesWebhookMethods.POST), _configSchema.schema.literal(_types.CasesWebhookMethods.PATCH), _configSchema.schema.literal(_types.CasesWebhookMethods.PUT)], {
    defaultValue: _types.CasesWebhookMethods.PUT
  }),
  updateIncidentJson: _configSchema.schema.string(),
  createCommentUrl: _configSchema.schema.nullable(_configSchema.schema.string()),
  createCommentMethod: _configSchema.schema.nullable(_configSchema.schema.oneOf([_configSchema.schema.literal(_types.CasesWebhookMethods.POST), _configSchema.schema.literal(_types.CasesWebhookMethods.PUT), _configSchema.schema.literal(_types.CasesWebhookMethods.PATCH)], {
    defaultValue: _types.CasesWebhookMethods.PUT
  })),
  createCommentJson: _configSchema.schema.nullable(_configSchema.schema.string()),
  headers: (0, _nullable.nullableType)(HeadersSchema),
  hasAuth: _configSchema.schema.boolean({
    defaultValue: true
  })
};
exports.ExternalIncidentServiceConfiguration = ExternalIncidentServiceConfiguration;
const ExternalIncidentServiceConfigurationSchema = _configSchema.schema.object(ExternalIncidentServiceConfiguration);
exports.ExternalIncidentServiceConfigurationSchema = ExternalIncidentServiceConfigurationSchema;
const ExternalIncidentServiceSecretConfiguration = {
  user: _configSchema.schema.nullable(_configSchema.schema.string()),
  password: _configSchema.schema.nullable(_configSchema.schema.string())
};
exports.ExternalIncidentServiceSecretConfiguration = ExternalIncidentServiceSecretConfiguration;
const ExternalIncidentServiceSecretConfigurationSchema = _configSchema.schema.object(ExternalIncidentServiceSecretConfiguration);
exports.ExternalIncidentServiceSecretConfigurationSchema = ExternalIncidentServiceSecretConfigurationSchema;
const ExecutorSubActionPushParamsSchema = _configSchema.schema.object({
  incident: _configSchema.schema.object({
    title: _configSchema.schema.string(),
    description: _configSchema.schema.nullable(_configSchema.schema.string()),
    externalId: _configSchema.schema.nullable(_configSchema.schema.string()),
    tags: _configSchema.schema.nullable(_configSchema.schema.arrayOf(_configSchema.schema.string()))
  }),
  comments: _configSchema.schema.nullable(_configSchema.schema.arrayOf(_configSchema.schema.object({
    comment: _configSchema.schema.string(),
    commentId: _configSchema.schema.string()
  })))
});
exports.ExecutorSubActionPushParamsSchema = ExecutorSubActionPushParamsSchema;
const ExecutorParamsSchema = _configSchema.schema.oneOf([_configSchema.schema.object({
  subAction: _configSchema.schema.literal('pushToService'),
  subActionParams: ExecutorSubActionPushParamsSchema
})]);
exports.ExecutorParamsSchema = ExecutorParamsSchema;