"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteActionRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _lib = require("../../lib");
var _common = require("../../../common");
var _track_legacy_route_usage = require("../../lib/track_legacy_route_usage");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const paramSchema = _configSchema.schema.object({
  id: _configSchema.schema.string()
});
const deleteActionRoute = (router, licenseState, usageCounter) => {
  router.delete({
    path: `${_common.BASE_ACTION_API_PATH}/action/{id}`,
    validate: {
      params: paramSchema
    }
  }, router.handleLegacyErrors(async function (context, req, res) {
    (0, _lib.verifyApiAccess)(licenseState);
    if (!context.actions) {
      return res.badRequest({
        body: 'RouteHandlerContext is not registered for actions'
      });
    }
    const actionsClient = (await context.actions).getActionsClient();
    const {
      id
    } = req.params;
    (0, _track_legacy_route_usage.trackLegacyRouteUsage)('delete', usageCounter);
    try {
      await actionsClient.delete({
        id
      });
      return res.noContent();
    } catch (e) {
      if ((0, _lib.isErrorThatHandlesItsOwnResponse)(e)) {
        return e.sendResponse(res);
      }
      throw e;
    }
  }));
};
exports.deleteActionRoute = deleteActionRoute;