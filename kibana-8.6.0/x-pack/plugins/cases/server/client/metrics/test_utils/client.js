"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMockClient = createMockClient;
exports.createMockClientArgs = createMockClientArgs;
var _mocks = require("../../../../../../../src/core/server/mocks");
var _mock = require("../../../authorization/mock");
var _mocks2 = require("../../../services/mocks");
var _mocks3 = require("../../mocks");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createMockClient() {
  const client = (0, _mocks3.createCasesClientMock)();
  return client;
}
function createMockClientArgs() {
  const authorization = (0, _mock.createAuthorizationMock)();
  authorization.getAuthorizationFilter.mockImplementation(async () => {
    return {
      filter: undefined,
      ensureSavedObjectsAreAuthorized: () => {}
    };
  });
  const soClient = _mocks.savedObjectsClientMock.create();
  const caseService = (0, _mocks2.createCaseServiceMock)();
  const logger = _mocks.loggingSystemMock.createLogger();
  const clientArgs = {
    authorization,
    unsecuredSavedObjectsClient: soClient,
    services: {
      caseService
    },
    logger
  };
  return {
    mockServices: clientArgs,
    clientArgs: clientArgs
  };
}