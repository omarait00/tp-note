"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineRoutes = defineRoutes;
var _analytics = require("./analytics");
var _anonymous_access = require("./anonymous_access");
var _api_keys = require("./api_keys");
var _authentication = require("./authentication");
var _authorization = require("./authorization");
var _deprecations = require("./deprecations");
var _indices = require("./indices");
var _role_mapping = require("./role_mapping");
var _security_checkup = require("./security_checkup");
var _session_management = require("./session_management");
var _user_profile = require("./user_profile");
var _users = require("./users");
var _views = require("./views");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function defineRoutes(params) {
  (0, _authentication.defineAuthenticationRoutes)(params);
  (0, _authorization.defineAuthorizationRoutes)(params);
  (0, _session_management.defineSessionManagementRoutes)(params);
  (0, _api_keys.defineApiKeysRoutes)(params);
  (0, _indices.defineIndicesRoutes)(params);
  (0, _users.defineUsersRoutes)(params);
  (0, _user_profile.defineUserProfileRoutes)(params);
  (0, _role_mapping.defineRoleMappingRoutes)(params);
  (0, _views.defineViewRoutes)(params);
  (0, _deprecations.defineDeprecationsRoutes)(params);
  (0, _anonymous_access.defineAnonymousAccessRoutes)(params);
  (0, _security_checkup.defineSecurityCheckupGetStateRoutes)(params);
  (0, _analytics.defineAnalyticsRoutes)(params);
}