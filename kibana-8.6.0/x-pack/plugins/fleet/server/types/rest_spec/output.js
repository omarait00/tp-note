"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PutOutputRequestSchema = exports.PostOutputRequestSchema = exports.GetOutputsRequestSchema = exports.GetOneOutputRequestSchema = exports.DeleteOutputRequestSchema = void 0;
var _configSchema = require("@kbn/config-schema");
var _models = require("../models");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const GetOneOutputRequestSchema = {
  params: _configSchema.schema.object({
    outputId: _configSchema.schema.string()
  })
};
exports.GetOneOutputRequestSchema = GetOneOutputRequestSchema;
const DeleteOutputRequestSchema = {
  params: _configSchema.schema.object({
    outputId: _configSchema.schema.string()
  })
};
exports.DeleteOutputRequestSchema = DeleteOutputRequestSchema;
const GetOutputsRequestSchema = {};
exports.GetOutputsRequestSchema = GetOutputsRequestSchema;
const PostOutputRequestSchema = {
  body: _models.NewOutputSchema
};
exports.PostOutputRequestSchema = PostOutputRequestSchema;
const PutOutputRequestSchema = {
  params: _configSchema.schema.object({
    outputId: _configSchema.schema.string()
  }),
  body: _models.UpdateOutputSchema
};
exports.PutOutputRequestSchema = PutOutputRequestSchema;