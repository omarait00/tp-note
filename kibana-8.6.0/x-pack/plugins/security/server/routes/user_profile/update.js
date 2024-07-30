"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineUpdateUserProfileDataRoute = defineUpdateUserProfileDataRoute;
var _configSchema = require("@kbn/config-schema");
var _errors = require("../../errors");
var _session_management = require("../../session_management");
var _licensed_route_handler = require("../licensed_route_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function defineUpdateUserProfileDataRoute({
  router,
  getSession,
  getUserProfileService,
  logger,
  getAuthenticationService
}) {
  router.post({
    path: '/internal/security/user_profile/_data',
    validate: {
      body: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any())
    }
  }, (0, _licensed_route_handler.createLicensedRouteHandler)(async (context, request, response) => {
    const session = await getSession().get(request);
    if (session.error) {
      logger.warn('User profile requested without valid session.');
      return response.notFound();
    }
    if (!session.value.userProfileId) {
      logger.warn(`User profile missing from current session. (sid: ${(0, _session_management.getPrintableSessionId)(session.value.sid)})`);
      return response.notFound();
    }
    const currentUser = getAuthenticationService().getCurrentUser(request);
    if (currentUser !== null && currentUser !== void 0 && currentUser.elastic_cloud_user) {
      logger.warn(`Elastic Cloud SSO users aren't allowed to update profiles in Kibana. (sid: ${(0, _session_management.getPrintableSessionId)(session.value.sid)})`);
      return response.forbidden();
    }
    const userProfileService = getUserProfileService();
    try {
      await userProfileService.update(session.value.userProfileId, request.body);
      return response.ok();
    } catch (error) {
      return response.customError((0, _errors.wrapIntoCustomErrorResponse)(error));
    }
  }));
}