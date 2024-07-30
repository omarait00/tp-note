"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateActionRoute = exports.bodySchema = void 0;
var _configSchema = require("@kbn/config-schema");
var _lib = require("../lib");
var _common = require("../../common");
var _verify_access_and_context = require("./verify_access_and_context");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const paramSchema = _configSchema.schema.object({
  id: _configSchema.schema.string()
});
const bodySchema = _configSchema.schema.object({
  name: _configSchema.schema.string({
    validate: _lib.validateEmptyStrings
  }),
  config: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any({
    validate: _lib.validateEmptyStrings
  }), {
    defaultValue: {}
  }),
  secrets: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any({
    validate: _lib.validateEmptyStrings
  }), {
    defaultValue: {}
  })
});
exports.bodySchema = bodySchema;
const rewriteBodyRes = ({
  actionTypeId,
  isPreconfigured,
  isMissingSecrets,
  isDeprecated,
  ...res
}) => ({
  ...res,
  connector_type_id: actionTypeId,
  is_preconfigured: isPreconfigured,
  is_deprecated: isDeprecated,
  is_missing_secrets: isMissingSecrets
});
const updateActionRoute = (router, licenseState) => {
  router.put({
    path: `${_common.BASE_ACTION_API_PATH}/connector/{id}`,
    validate: {
      body: bodySchema,
      params: paramSchema
    }
  }, router.handleLegacyErrors((0, _verify_access_and_context.verifyAccessAndContext)(licenseState, async function (context, req, res) {
    const actionsClient = (await context.actions).getActionsClient();
    const {
      id
    } = req.params;
    const {
      name,
      config,
      secrets
    } = req.body;
    return res.ok({
      body: rewriteBodyRes(await actionsClient.update({
        id,
        action: {
          name,
          config,
          secrets
        }
      }))
    });
  })));
};
exports.updateActionRoute = updateActionRoute;