"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerFieldPreviewRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _constants = require("../../common/constants");
var _shared_imports = require("../shared_imports");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const bodySchema = _configSchema.schema.object({
  index: _configSchema.schema.string(),
  script: _configSchema.schema.object({
    source: _configSchema.schema.string()
  }),
  context: _configSchema.schema.oneOf([_configSchema.schema.literal('boolean_field'), _configSchema.schema.literal('date_field'), _configSchema.schema.literal('double_field'), _configSchema.schema.literal('geo_point_field'), _configSchema.schema.literal('ip_field'), _configSchema.schema.literal('keyword_field'), _configSchema.schema.literal('long_field'), _configSchema.schema.literal('composite_field')]),
  document: _configSchema.schema.object({}, {
    unknowns: 'allow'
  })
});
const registerFieldPreviewRoute = ({
  router
}) => {
  router.post({
    path: `${_constants.API_BASE_PATH}/field_preview`,
    validate: {
      body: bodySchema
    }
  }, async (ctx, req, res) => {
    const {
      client
    } = (await ctx.core).elasticsearch;
    const body = {
      script: req.body.script,
      context: req.body.context,
      context_setup: {
        document: req.body.document,
        index: req.body.index
      }
    };
    try {
      // client types need to be update to support this request format
      // @ts-expect-error
      const {
        result
      } = await client.asCurrentUser.scriptsPainlessExecute(body);
      const fieldValue = result;
      return res.ok({
        body: {
          values: fieldValue
        }
      });
    } catch (error) {
      // Assume invalid painless script was submitted
      // Return 200 with error object
      const handleCustomError = () => {
        return res.ok({
          body: {
            values: [],
            ...error.body
          }
        });
      };
      return (0, _shared_imports.handleEsError)({
        error,
        response: res,
        handleCustomError
      });
    }
  });
};
exports.registerFieldPreviewRoute = registerFieldPreviewRoute;