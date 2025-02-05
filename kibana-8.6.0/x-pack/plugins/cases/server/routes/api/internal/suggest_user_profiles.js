"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.suggestUserProfilesRoute = void 0;
var _constants = require("../../../../common/constants");
var _error = require("../../../common/error");
var _create_cases_route = require("../create_cases_route");
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const suggestUserProfilesRoute = userProfileService => (0, _create_cases_route.createCasesRoute)({
  method: 'post',
  path: _constants.INTERNAL_SUGGEST_USER_PROFILES_URL,
  routerOptions: {
    tags: ['access:casesSuggestUserProfiles']
  },
  params: {
    body: _utils.escapeHatch
  },
  handler: async ({
    request,
    response
  }) => {
    try {
      return response.ok({
        body: await userProfileService.suggest(request)
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to find user profiles: ${error}`,
        error
      });
    }
  }
});
exports.suggestUserProfilesRoute = suggestUserProfilesRoute;