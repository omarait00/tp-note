"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;
var _configSchema = require("@kbn/config-schema");
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const configSchema = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean({
    defaultValue: false
  }),
  org_id: _configSchema.schema.conditional(_configSchema.schema.siblingRef('enabled'), true, _configSchema.schema.string({
    minLength: 1
  }), _configSchema.schema.maybe(_configSchema.schema.string())),
  eventTypesAllowlist: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: ['Loaded Kibana']
  })
});
const config = {
  exposeToBrowser: {
    org_id: true,
    eventTypesAllowlist: true
  },
  schema: configSchema,
  deprecations: () => [
  // Silently move the chat configuration from `xpack.cloud` to `xpack.cloud_integrations.full_story`.
  // No need to emit a deprecation log because it's an internal restructure
  cfg => {
    return {
      set: [...copyIfExists({
        cfg,
        fromKey: 'xpack.cloud.full_story.enabled',
        toKey: 'xpack.cloud_integrations.full_story.enabled'
      }), ...copyIfExists({
        cfg,
        fromKey: 'xpack.cloud.full_story.org_id',
        toKey: 'xpack.cloud_integrations.full_story.org_id'
      }), ...copyIfExists({
        cfg,
        fromKey: 'xpack.cloud.full_story.eventTypesAllowlist',
        toKey: 'xpack.cloud_integrations.full_story.eventTypesAllowlist'
      })],
      unset: [{
        path: 'xpack.cloud.full_story.enabled'
      }, {
        path: 'xpack.cloud.full_story.org_id'
      }, {
        path: 'xpack.cloud.full_story.eventTypesAllowlist'
      }]
    };
  }]
};

/**
 * Defines the `set` action only if the key exists in the `fromKey` value.
 * This is to avoid overwriting actual values with undefined.
 * @param cfg The config object
 * @param fromKey The key to copy from.
 * @param toKey The key where the value should be copied to.
 */
exports.config = config;
function copyIfExists({
  cfg,
  fromKey,
  toKey
}) {
  return (0, _lodash.has)(cfg, fromKey) ? [{
    path: toKey,
    value: (0, _lodash.get)(cfg, fromKey)
  }] : [];
}