"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCreateTagRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _tags = require("../../services/tags");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const registerCreateTagRoute = router => {
  router.post({
    path: '/api/saved_objects_tagging/tags/create',
    validate: {
      body: _configSchema.schema.object({
        name: _configSchema.schema.string(),
        description: _configSchema.schema.string(),
        color: _configSchema.schema.string()
      })
    }
  }, router.handleLegacyErrors(async (ctx, req, res) => {
    try {
      const {
        tagsClient
      } = await ctx.tags;
      const tag = await tagsClient.create(req.body);
      return res.ok({
        body: {
          tag
        }
      });
    } catch (e) {
      if (e instanceof _tags.TagValidationError) {
        return res.badRequest({
          body: {
            message: e.message,
            attributes: e.validation
          }
        });
      }
      throw e;
    }
  }));
};
exports.registerCreateTagRoute = registerCreateTagRoute;