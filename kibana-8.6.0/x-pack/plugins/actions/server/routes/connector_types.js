"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connectorTypesRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _common = require("../../common");
var _verify_access_and_context = require("./verify_access_and_context");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const querySchema = _configSchema.schema.object({
  feature_id: _configSchema.schema.maybe(_configSchema.schema.string())
});
const rewriteBodyRes = results => {
  return results.map(({
    enabledInConfig,
    enabledInLicense,
    minimumLicenseRequired,
    supportedFeatureIds,
    ...res
  }) => ({
    ...res,
    enabled_in_config: enabledInConfig,
    enabled_in_license: enabledInLicense,
    minimum_license_required: minimumLicenseRequired,
    supported_feature_ids: supportedFeatureIds
  }));
};
const connectorTypesRoute = (router, licenseState) => {
  router.get({
    path: `${_common.BASE_ACTION_API_PATH}/connector_types`,
    validate: {
      query: querySchema
    }
  }, router.handleLegacyErrors((0, _verify_access_and_context.verifyAccessAndContext)(licenseState, async function (context, req, res) {
    var _req$query;
    const actionsClient = (await context.actions).getActionsClient();
    return res.ok({
      body: rewriteBodyRes(await actionsClient.listTypes((_req$query = req.query) === null || _req$query === void 0 ? void 0 : _req$query.feature_id))
    });
  })));
};
exports.connectorTypesRoute = connectorTypesRoute;