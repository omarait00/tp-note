"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.securityMock = void 0;
var _index = require("../common/licensing/index.mock");
var _authenticated_user = require("../common/model/authenticated_user.mock");
var _mocks = require("./audit/mocks");
var _authentication_service = require("./authentication/authentication_service.mock");
var _index2 = require("./authorization/index.mock");
var _user_profile_service = require("./user_profile/user_profile_service.mock");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createSetupMock() {
  const mockAuthz = _index2.authorizationMock.create();
  return {
    audit: _mocks.auditServiceMock.create(),
    authc: {
      getCurrentUser: jest.fn()
    },
    authz: {
      actions: mockAuthz.actions,
      checkPrivilegesWithRequest: mockAuthz.checkPrivilegesWithRequest,
      checkPrivilegesDynamicallyWithRequest: mockAuthz.checkPrivilegesDynamicallyWithRequest,
      checkSavedObjectsPrivilegesWithRequest: mockAuthz.checkSavedObjectsPrivilegesWithRequest,
      mode: mockAuthz.mode
    },
    registerSpacesService: jest.fn(),
    license: _index.licenseMock.create(),
    privilegeDeprecationsService: {
      getKibanaRolesByFeatureId: jest.fn()
    },
    setIsElasticCloudDeployment: jest.fn()
  };
}
function createStartMock() {
  const mockAuthz = _index2.authorizationMock.create();
  const mockAuthc = _authentication_service.authenticationServiceMock.createStart();
  const mockUserProfiles = _user_profile_service.userProfileServiceMock.createStart();
  return {
    authc: {
      apiKeys: mockAuthc.apiKeys,
      getCurrentUser: mockAuthc.getCurrentUser
    },
    authz: {
      actions: mockAuthz.actions,
      checkPrivilegesWithRequest: mockAuthz.checkPrivilegesWithRequest,
      checkPrivilegesDynamicallyWithRequest: mockAuthz.checkPrivilegesDynamicallyWithRequest,
      checkSavedObjectsPrivilegesWithRequest: mockAuthz.checkSavedObjectsPrivilegesWithRequest,
      mode: mockAuthz.mode
    },
    userProfiles: {
      getCurrent: mockUserProfiles.getCurrent,
      suggest: mockUserProfiles.suggest,
      bulkGet: mockUserProfiles.bulkGet
    }
  };
}
function createApiResponseMock(apiResponse) {
  return {
    // @ts-expect-error null is not supported
    statusCode: null,
    // @ts-expect-error null is not supported
    headers: null,
    warnings: null,
    meta: {},
    ...apiResponse
  };
}
const securityMock = {
  createSetup: createSetupMock,
  createStart: createStartMock,
  createApiResponse: createApiResponseMock,
  createMockAuthenticatedUser: (props = {}) => (0, _authenticated_user.mockAuthenticatedUser)(props)
};
exports.securityMock = securityMock;