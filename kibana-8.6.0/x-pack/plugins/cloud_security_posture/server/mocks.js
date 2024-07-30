"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCspRequestHandlerContextMock = void 0;
var _coreLoggingServerMocks = require("@kbn/core-logging-server-mocks");
var _mocks = require("../../../../src/core/server/mocks");
var _mocks2 = require("../../fleet/server/mocks");
var _authenticated_user = require("../../security/common/model/authenticated_user.mock");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createCspRequestHandlerContextMock = () => {
  const coreMockRequestContext = _mocks.coreMock.createRequestHandlerContext();
  return {
    core: coreMockRequestContext,
    fleet: (0, _mocks2.createFleetRequestHandlerContextMock)(),
    csp: {
      user: (0, _authenticated_user.mockAuthenticatedUser)(),
      logger: _coreLoggingServerMocks.loggingSystemMock.createLogger(),
      esClient: coreMockRequestContext.elasticsearch.client,
      soClient: coreMockRequestContext.savedObjects.client,
      agentPolicyService: (0, _mocks2.createMockAgentPolicyService)(),
      agentService: (0, _mocks2.createMockAgentService)(),
      packagePolicyService: (0, _mocks2.createPackagePolicyServiceMock)(),
      packageService: (0, _mocks2.createMockPackageService)()
    }
  };
};
exports.createCspRequestHandlerContextMock = createCspRequestHandlerContextMock;