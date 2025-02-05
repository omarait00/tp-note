"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syncSchema = exports.sourceSchema = exports.settingsSchema = exports.retentionPolicySchema = exports.putTransformsRequestSchema = exports.postTransformsPreviewRequestSchema = exports.pivotSchema = exports.latestFunctionSchema = exports.getTransformsRequestSchema = exports.destSchema = exports._metaSchema = void 0;
var _configSchema = require("@kbn/config-schema");
var _common = require("./common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// GET transforms
const getTransformsRequestSchema = _configSchema.schema.arrayOf(_configSchema.schema.object({
  id: _configSchema.schema.string(),
  state: _common.transformStateSchema
}));
exports.getTransformsRequestSchema = getTransformsRequestSchema;
// schemas shared by parts of the preview, create and update endpoint
const destSchema = _configSchema.schema.object({
  index: _configSchema.schema.string(),
  pipeline: _configSchema.schema.maybe(_configSchema.schema.string())
});
exports.destSchema = destSchema;
const pivotSchema = _configSchema.schema.object({
  group_by: _configSchema.schema.any(),
  aggregations: _configSchema.schema.any(),
  max_page_search_size: _configSchema.schema.maybe(_configSchema.schema.number())
});
exports.pivotSchema = pivotSchema;
const latestFunctionSchema = _configSchema.schema.object({
  unique_key: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  sort: _configSchema.schema.string()
});
exports.latestFunctionSchema = latestFunctionSchema;
const retentionPolicySchema = _configSchema.schema.object({
  time: _configSchema.schema.object({
    field: _configSchema.schema.string(),
    max_age: _configSchema.schema.string()
  })
});
exports.retentionPolicySchema = retentionPolicySchema;
const settingsSchema = _configSchema.schema.object({
  // null can be used to reset to default value.
  max_page_search_size: _configSchema.schema.maybe(_configSchema.schema.nullable(_configSchema.schema.number())),
  // The default value is null, which disables throttling.
  docs_per_second: _configSchema.schema.maybe(_configSchema.schema.nullable(_configSchema.schema.number())),
  // Optional value that takes precedence over cluster's setting.
  num_failure_retries: _configSchema.schema.maybe(_configSchema.schema.nullable(_configSchema.schema.number()))
});
exports.settingsSchema = settingsSchema;
const sourceSchema = _configSchema.schema.object({
  runtime_mappings: _common.runtimeMappingsSchema,
  index: _configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())]),
  query: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any()))
});
exports.sourceSchema = sourceSchema;
const syncSchema = _configSchema.schema.object({
  time: _configSchema.schema.object({
    delay: _configSchema.schema.maybe(_configSchema.schema.string()),
    field: _configSchema.schema.string()
  })
});
exports.syncSchema = syncSchema;
function transformConfigPayloadValidator(value) {
  if (!value.pivot && !value.latest) {
    return 'pivot or latest is required for transform configuration';
  }
  if (value.pivot && value.latest) {
    return 'pivot and latest are not allowed together';
  }
}
const _metaSchema = _configSchema.schema.object({}, {
  unknowns: 'allow'
});

// PUT transforms/{transformId}
exports._metaSchema = _metaSchema;
const putTransformsRequestSchema = _configSchema.schema.object({
  description: _configSchema.schema.maybe(_configSchema.schema.string()),
  dest: destSchema,
  frequency: _configSchema.schema.maybe(_configSchema.schema.string()),
  /**
   * Pivot and latest are mutually exclusive, i.e. exactly one must be specified in the transform configuration
   */
  pivot: _configSchema.schema.maybe(pivotSchema),
  /**
   * Latest and pivot are mutually exclusive, i.e. exactly one must be specified in the transform configuration
   */
  latest: _configSchema.schema.maybe(latestFunctionSchema),
  retention_policy: _configSchema.schema.maybe(retentionPolicySchema),
  settings: _configSchema.schema.maybe(settingsSchema),
  source: sourceSchema,
  sync: _configSchema.schema.maybe(syncSchema),
  /**
   * This _meta field stores an arbitrary key-value map
   * where keys are strings and values are arbitrary objects (possibly also maps).
   */
  _meta: _configSchema.schema.maybe(_metaSchema)
}, {
  validate: transformConfigPayloadValidator
});
exports.putTransformsRequestSchema = putTransformsRequestSchema;
// POST transforms/_preview
const postTransformsPreviewRequestSchema = _configSchema.schema.object({
  pivot: _configSchema.schema.maybe(pivotSchema),
  latest: _configSchema.schema.maybe(latestFunctionSchema),
  source: sourceSchema
}, {
  validate: transformConfigPayloadValidator
});
exports.postTransformsPreviewRequestSchema = postTransformsPreviewRequestSchema;