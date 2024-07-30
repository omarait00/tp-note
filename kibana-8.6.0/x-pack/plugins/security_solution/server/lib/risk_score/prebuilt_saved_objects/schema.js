"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deletePrebuiltSavedObjectsSchema = exports.createPrebuiltSavedObjectsSchema = void 0;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createPrebuiltSavedObjectsSchema = {
  params: _configSchema.schema.object({
    template_name: _configSchema.schema.oneOf([_configSchema.schema.literal('hostRiskScoreDashboards'), _configSchema.schema.literal('userRiskScoreDashboards')])
  })
};
exports.createPrebuiltSavedObjectsSchema = createPrebuiltSavedObjectsSchema;
const deletePrebuiltSavedObjectsSchema = {
  params: _configSchema.schema.object({
    template_name: _configSchema.schema.oneOf([_configSchema.schema.literal('hostRiskScoreDashboards'), _configSchema.schema.literal('userRiskScoreDashboards')])
  }),
  body: _configSchema.schema.nullable(_configSchema.schema.object({
    deleteAll: _configSchema.schema.maybe(_configSchema.schema.boolean())
  }))
};
exports.deletePrebuiltSavedObjectsSchema = deletePrebuiltSavedObjectsSchema;