"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerCreateRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _error = require("../../error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const registerCreateRoute = (router, url) => {
  router.post({
    path: '/api/short_url',
    validate: {
      body: _configSchema.schema.object({
        locatorId: _configSchema.schema.string({
          minLength: 1,
          maxLength: 255
        }),
        slug: _configSchema.schema.string({
          defaultValue: '',
          minLength: 3,
          maxLength: 255
        }),
        /**
         * @deprecated
         *
         * This field is deprecated as the API does not support automatic
         * human-readable slug generation.
         *
         * @todo This field will be removed in a future version. It is left
         * here for backwards compatibility.
         */
        humanReadableSlug: _configSchema.schema.boolean({
          defaultValue: false
        }),
        params: _configSchema.schema.object({}, {
          unknowns: 'allow'
        })
      })
    }
  }, router.handleLegacyErrors(async (ctx, req, res) => {
    const savedObjects = (await ctx.core).savedObjects.client;
    const shortUrls = url.shortUrls.get({
      savedObjects
    });
    const {
      locatorId,
      params,
      slug
    } = req.body;
    const locator = url.locators.get(locatorId);
    if (!locator) {
      return res.customError({
        statusCode: 409,
        body: 'Locator not found.'
      });
    }
    try {
      const shortUrl = await shortUrls.create({
        locator,
        params,
        slug
      });
      return res.ok({
        headers: {
          'content-type': 'application/json'
        },
        body: shortUrl.data
      });
    } catch (error) {
      if (error instanceof _error.UrlServiceError) {
        if (error.code === 'SLUG_EXISTS') {
          return res.customError({
            statusCode: 409,
            body: error.message
          });
        }
      }
      throw error;
    }
  }));
};
exports.registerCreateRoute = registerCreateRoute;