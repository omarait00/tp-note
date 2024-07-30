"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UpdateOutputSchema = exports.OutputSchema = exports.NewOutputSchema = void 0;
exports.validateLogstashHost = validateLogstashHost;
var _configSchema = require("@kbn/config-schema");
var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function validateLogstashHost(val) {
  if (val.match(/^http([s]){0,1}:\/\//)) {
    return 'Host address must begin with a domain name or IP address';
  }
  try {
    const url = new URL(`http://${val}`);
    if (url.host !== val) {
      return 'Invalid host';
    }
  } catch (err) {
    return 'Invalid Logstash host';
  }
}
const OutputBaseSchema = {
  id: _configSchema.schema.maybe(_configSchema.schema.string()),
  name: _configSchema.schema.string(),
  type: _configSchema.schema.oneOf([_configSchema.schema.literal(_constants.outputType.Elasticsearch), _configSchema.schema.literal(_constants.outputType.Logstash)]),
  hosts: _configSchema.schema.conditional(_configSchema.schema.siblingRef('type'), _configSchema.schema.literal(_constants.outputType.Elasticsearch), _configSchema.schema.arrayOf(_configSchema.schema.uri({
    scheme: ['http', 'https']
  }), {
    minSize: 1
  }), _configSchema.schema.arrayOf(_configSchema.schema.string({
    validate: validateLogstashHost
  }), {
    minSize: 1
  })),
  is_default: _configSchema.schema.boolean({
    defaultValue: false
  }),
  is_default_monitoring: _configSchema.schema.boolean({
    defaultValue: false
  }),
  ca_sha256: _configSchema.schema.maybe(_configSchema.schema.string()),
  ca_trusted_fingerprint: _configSchema.schema.maybe(_configSchema.schema.string()),
  config_yaml: _configSchema.schema.maybe(_configSchema.schema.string()),
  ssl: _configSchema.schema.maybe(_configSchema.schema.object({
    certificate_authorities: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
    certificate: _configSchema.schema.maybe(_configSchema.schema.string()),
    key: _configSchema.schema.maybe(_configSchema.schema.string())
  }))
};
const NewOutputSchema = _configSchema.schema.object({
  ...OutputBaseSchema
});
exports.NewOutputSchema = NewOutputSchema;
const UpdateOutputSchema = _configSchema.schema.object({
  name: _configSchema.schema.maybe(_configSchema.schema.string()),
  type: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal(_constants.outputType.Elasticsearch), _configSchema.schema.literal(_constants.outputType.Logstash)])),
  hosts: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.arrayOf(_configSchema.schema.uri({
    scheme: ['http', 'https']
  })), _configSchema.schema.arrayOf(_configSchema.schema.string({
    validate: validateLogstashHost
  }))])),
  is_default: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  is_default_monitoring: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  ca_sha256: _configSchema.schema.maybe(_configSchema.schema.string()),
  ca_trusted_fingerprint: _configSchema.schema.maybe(_configSchema.schema.string()),
  config_yaml: _configSchema.schema.maybe(_configSchema.schema.string()),
  ssl: _configSchema.schema.maybe(_configSchema.schema.object({
    certificate_authorities: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
    certificate: _configSchema.schema.maybe(_configSchema.schema.string()),
    key: _configSchema.schema.maybe(_configSchema.schema.string())
  }))
});
exports.UpdateOutputSchema = UpdateOutputSchema;
const OutputSchema = _configSchema.schema.object({
  ...OutputBaseSchema,
  id: _configSchema.schema.string()
});
exports.OutputSchema = OutputSchema;