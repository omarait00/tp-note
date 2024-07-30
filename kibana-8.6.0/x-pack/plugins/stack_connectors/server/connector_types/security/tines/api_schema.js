"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TinesWebhooksApiResponseSchema = exports.TinesStoriesApiResponseSchema = exports.TinesRunApiResponseSchema = exports.TinesBaseApiResponseSchema = void 0;
var _configSchema = require("@kbn/config-schema");
var _schema = require("../../../../common/connector_types/security/tines/schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// Tines response base schema
const TinesBaseApiResponseSchema = _configSchema.schema.object({
  meta: _configSchema.schema.object({
    pages: _configSchema.schema.number()
  }, {
    unknowns: 'ignore'
  })
}, {
  unknowns: 'ignore'
});

// Stories action schema
exports.TinesBaseApiResponseSchema = TinesBaseApiResponseSchema;
const TinesStoriesApiResponseSchema = TinesBaseApiResponseSchema.extends({
  stories: _configSchema.schema.arrayOf(_schema.TinesStoryObjectSchema.extends({}, {
    unknowns: 'ignore'
  }))
}, {
  unknowns: 'ignore'
});

// Webhooks action schema
exports.TinesStoriesApiResponseSchema = TinesStoriesApiResponseSchema;
const TinesWebhooksApiResponseSchema = TinesBaseApiResponseSchema.extends({
  agents: _configSchema.schema.arrayOf(_configSchema.schema.object({
    id: _configSchema.schema.number(),
    name: _configSchema.schema.string(),
    type: _configSchema.schema.string(),
    story_id: _configSchema.schema.number(),
    options: _configSchema.schema.object({
      path: _configSchema.schema.maybe(_configSchema.schema.string()),
      secret: _configSchema.schema.maybe(_configSchema.schema.string())
    }, {
      unknowns: 'ignore'
    })
  }, {
    unknowns: 'ignore'
  }))
}, {
  unknowns: 'ignore'
});
exports.TinesWebhooksApiResponseSchema = TinesWebhooksApiResponseSchema;
const TinesRunApiResponseSchema = _configSchema.schema.object({}, {
  unknowns: 'ignore'
});
exports.TinesRunApiResponseSchema = TinesRunApiResponseSchema;