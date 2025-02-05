"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DownloadSourceSchema = void 0;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DownloadSourceBaseSchema = {
  id: _configSchema.schema.maybe(_configSchema.schema.string()),
  name: _configSchema.schema.string(),
  host: _configSchema.schema.uri({
    scheme: ['http', 'https']
  }),
  is_default: _configSchema.schema.boolean({
    defaultValue: false
  })
};
const DownloadSourceSchema = _configSchema.schema.object({
  ...DownloadSourceBaseSchema
});
exports.DownloadSourceSchema = DownloadSourceSchema;