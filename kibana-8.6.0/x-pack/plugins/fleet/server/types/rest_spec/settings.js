"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PutSettingsRequestSchema = exports.GetSettingsRequestSchema = void 0;
var _configSchema = require("@kbn/config-schema");
var _services = require("../../../common/services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const GetSettingsRequestSchema = {};
exports.GetSettingsRequestSchema = GetSettingsRequestSchema;
const PutSettingsRequestSchema = {
  body: _configSchema.schema.object({
    fleet_server_hosts: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.uri({
      scheme: ['http', 'https']
    }), {
      validate: value => {
        if (value.length && (0, _services.isDiffPathProtocol)(value)) {
          return 'Protocol and path must be the same for each URL';
        }
      }
    })),
    has_seen_add_data_notice: _configSchema.schema.maybe(_configSchema.schema.boolean()),
    additional_yaml_config: _configSchema.schema.maybe(_configSchema.schema.string()),
    // Deprecated not used
    kibana_urls: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.uri({
      scheme: ['http', 'https']
    }), {
      validate: value => {
        if ((0, _services.isDiffPathProtocol)(value)) {
          return 'Protocol and path must be the same for each URL';
        }
      }
    })),
    kibana_ca_sha256: _configSchema.schema.maybe(_configSchema.schema.string()),
    prerelease_integrations_enabled: _configSchema.schema.maybe(_configSchema.schema.boolean())
  })
};
exports.PutSettingsRequestSchema = PutSettingsRequestSchema;