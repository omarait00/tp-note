"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEndpointMetadataServiceTestContextMock = void 0;
var _mocks = require("../../../../../../../src/core/server/mocks");
var _mocks2 = require("../../../../../fleet/server/mocks");
var _endpoint_metadata_service = require("./endpoint_metadata_service");
var _endpoint_fleet_services_factory = require("../fleet/endpoint_fleet_services_factory");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createCustomizedPackagePolicyService = () => {
  const service = (0, _mocks2.createPackagePolicyServiceMock)();
  service.list.mockImplementation(async (_, options) => {
    var _options$page, _options$perPage;
    return {
      items: [],
      total: 0,
      page: (_options$page = options.page) !== null && _options$page !== void 0 ? _options$page : 1,
      perPage: (_options$perPage = options.perPage) !== null && _options$perPage !== void 0 ? _options$perPage : 10
    };
  });
  return service;
};

/**
 * Endpoint Metadata Service test context. Includes an instance of `EndpointMetadataService` along with the
 * dependencies that were used to initialize that instance.
 */

const createEndpointMetadataServiceTestContextMock = (savedObjectsStart = _mocks.savedObjectsServiceMock.createStartContract(), agentService = (0, _mocks2.createMockAgentService)(), agentPolicyService = (0, _mocks2.createMockAgentPolicyService)(), packagePolicyService = createCustomizedPackagePolicyService(), packageService = (0, _mocks2.createMockPackageService)(), logger = _mocks.loggingSystemMock.create().get()) => {
  const fleetServices = new _endpoint_fleet_services_factory.EndpointFleetServicesFactory({
    agentService,
    packageService,
    packagePolicyService,
    agentPolicyService
  }, savedObjectsStart).asInternalUser();
  const endpointMetadataService = new _endpoint_metadata_service.EndpointMetadataService(savedObjectsStart, agentPolicyService, packagePolicyService, logger);
  return {
    savedObjectsStart,
    agentService,
    agentPolicyService,
    packagePolicyService,
    endpointMetadataService,
    fleetServices,
    logger
  };
};
exports.createEndpointMetadataServiceTestContextMock = createEndpointMetadataServiceTestContextMock;