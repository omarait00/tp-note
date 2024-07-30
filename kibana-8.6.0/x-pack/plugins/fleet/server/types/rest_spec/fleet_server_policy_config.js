"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PutFleetServerHostRequestSchema = exports.PostFleetServerHostRequestSchema = exports.GetOneFleetServerHostRequestSchema = exports.GetAllFleetServerHostRequestSchema = void 0;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const PostFleetServerHostRequestSchema = {
  body: _configSchema.schema.object({
    id: _configSchema.schema.maybe(_configSchema.schema.string()),
    name: _configSchema.schema.string(),
    host_urls: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
      minSize: 1
    }),
    is_default: _configSchema.schema.boolean({
      defaultValue: false
    })
  })
};
exports.PostFleetServerHostRequestSchema = PostFleetServerHostRequestSchema;
const GetOneFleetServerHostRequestSchema = {
  params: _configSchema.schema.object({
    itemId: _configSchema.schema.string()
  })
};
exports.GetOneFleetServerHostRequestSchema = GetOneFleetServerHostRequestSchema;
const PutFleetServerHostRequestSchema = {
  params: _configSchema.schema.object({
    itemId: _configSchema.schema.string()
  }),
  body: _configSchema.schema.object({
    name: _configSchema.schema.maybe(_configSchema.schema.string()),
    host_urls: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string(), {
      minSize: 1
    })),
    is_default: _configSchema.schema.maybe(_configSchema.schema.boolean({
      defaultValue: false
    }))
  })
};
exports.PutFleetServerHostRequestSchema = PutFleetServerHostRequestSchema;
const GetAllFleetServerHostRequestSchema = {};
exports.GetAllFleetServerHostRequestSchema = GetAllFleetServerHostRequestSchema;