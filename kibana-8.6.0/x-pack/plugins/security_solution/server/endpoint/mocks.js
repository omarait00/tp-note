"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMockMetadataRequestContext = exports.createMockEndpointAppContextServiceStartContract = exports.createMockEndpointAppContextServiceSetupContract = exports.createMockEndpointAppContextService = exports.createMockEndpointAppContext = exports.createHttpApiTestSetupMock = exports.createFleetAuthzServiceMock = void 0;
exports.createRouteHandlerContext = createRouteHandlerContext;
var _mocks = require("../../../../../src/core/server/mocks");
var _mocks2 = require("../../../lists/server/mocks");
var _mocks3 = require("../../../security/server/mocks");
var _mocks4 = require("../../../alerting/server/mocks");
var _mocks5 = require("../../../fleet/server/mocks");
var _mocks6 = require("../../../cases/server/client/mocks");
var _common = require("../../../fleet/common");
var _fixtures = require("../fixtures");
var _mocks__ = require("../lib/detection_engine/routes/__mocks__");
var _manifest_manager = require("./services/artifacts/manifest_manager/manifest_manager.mock");
var _experimental_features = require("../../common/experimental_features");
var _request_context_factory = require("../request_context_factory.mock");
var _metadata = require("./services/metadata");
var _request_context = require("../lib/detection_engine/routes/__mocks__/request_context");
var _mocks7 = require("./services/metadata/mocks");
var _fleet = require("./services/fleet");
var _mocks8 = require("../../common/license/mocks");
var _mocks9 = require("./services/feature_usage/mocks");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

// A TS error (TS2403) is thrown when attempting to export the mock function below from Cases
// plugin server `index.ts`. Its unclear what is actually causing the error. Since this is a Mock
// file and not bundled with the application, adding a eslint disable below and using import from
// a restricted path.

/**
 * Creates a mocked EndpointAppContext.
 */
const createMockEndpointAppContext = mockManifestManager => {
  return {
    logFactory: _mocks.loggingSystemMock.create(),
    config: () => Promise.resolve((0, _mocks__.createMockConfig)()),
    service: createMockEndpointAppContextService(mockManifestManager),
    experimentalFeatures: (0, _experimental_features.parseExperimentalConfigValue)((0, _mocks__.createMockConfig)().enableExperimental)
  };
};

/**
 * Creates a mocked EndpointAppContextService
 */
exports.createMockEndpointAppContext = createMockEndpointAppContext;
const createMockEndpointAppContextService = mockManifestManager => {
  const mockEndpointMetadataContext = (0, _mocks7.createEndpointMetadataServiceTestContextMock)();
  return {
    start: jest.fn(),
    stop: jest.fn(),
    getExperimentalFeatures: jest.fn(),
    getAgentService: jest.fn(),
    getAgentPolicyService: jest.fn(),
    getManifestManager: jest.fn().mockReturnValue(mockManifestManager !== null && mockManifestManager !== void 0 ? mockManifestManager : jest.fn()),
    getEndpointMetadataService: jest.fn(() => mockEndpointMetadataContext.endpointMetadataService),
    getInternalFleetServices: jest.fn(() => mockEndpointMetadataContext.fleetServices)
  };
};

/**
 * Creates a mocked input contract for the `EndpointAppContextService#setup()` method
 */
exports.createMockEndpointAppContextService = createMockEndpointAppContextService;
const createMockEndpointAppContextServiceSetupContract = () => {
  return {
    securitySolutionRequestContextFactory: _request_context_factory.requestContextFactoryMock.create()
  };
};

/**
 * Creates a mocked input contract for the `EndpointAppContextService#start()` method
 */
exports.createMockEndpointAppContextServiceSetupContract = createMockEndpointAppContextServiceSetupContract;
const createMockEndpointAppContextServiceStartContract = () => {
  const config = (0, _mocks__.createMockConfig)();
  const logger = _mocks.loggingSystemMock.create().get('mock_endpoint_app_context');
  const casesClientMock = (0, _mocks6.createCasesClientMock)();
  const savedObjectsStart = _mocks.savedObjectsServiceMock.createStartContract();
  const security = _mocks3.securityMock.createStart();
  const agentService = (0, _mocks5.createMockAgentService)();
  const agentPolicyService = (0, _mocks5.createMockAgentPolicyService)();
  const packagePolicyService = (0, _mocks5.createPackagePolicyServiceMock)();
  const packageService = (0, _mocks5.createMockPackageService)();
  const endpointMetadataService = new _metadata.EndpointMetadataService(savedObjectsStart, agentPolicyService, packagePolicyService, logger);
  const endpointFleetServicesFactory = new _fleet.EndpointFleetServicesFactory({
    packageService,
    packagePolicyService,
    agentPolicyService,
    agentService
  }, savedObjectsStart);
  packagePolicyService.list.mockImplementation(async (_, options) => {
    var _options$page, _options$perPage;
    return {
      items: [],
      total: 0,
      page: (_options$page = options.page) !== null && _options$page !== void 0 ? _options$page : 1,
      perPage: (_options$perPage = options.perPage) !== null && _options$perPage !== void 0 ? _options$perPage : 10
    };
  });

  // Make current user have `superuser` role by default
  security.authc.getCurrentUser.mockReturnValue(_mocks3.securityMock.createMockAuthenticatedUser({
    roles: ['superuser']
  }));
  security.authz.checkPrivilegesDynamicallyWithRequest.mockReturnValue(jest.fn(() => ({
    privileges: {
      kibana: []
    }
  })));
  return {
    agentService,
    agentPolicyService,
    endpointMetadataService,
    endpointFleetServicesFactory,
    packagePolicyService,
    logger,
    packageService,
    fleetAuthzService: createFleetAuthzServiceMock(),
    manifestManager: (0, _manifest_manager.getManifestManagerMock)(),
    security,
    alerting: _mocks4.alertsMock.createStart(),
    config,
    licenseService: (0, _mocks8.createLicenseServiceMock)(),
    registerIngestCallback: jest.fn(),
    exceptionListsClient: _mocks2.listMock.getExceptionListClient(),
    cases: {
      getCasesClientWithRequest: jest.fn(async () => casesClientMock)
    },
    featureUsageService: (0, _mocks9.createFeatureUsageServiceMock)(),
    experimentalFeatures: (0, _mocks__.createMockConfig)().experimentalFeatures
  };
};
exports.createMockEndpointAppContextServiceStartContract = createMockEndpointAppContextServiceStartContract;
const createFleetAuthzServiceMock = () => {
  return {
    fromRequest: jest.fn(async _ => (0, _common.createFleetAuthzMock)())
  };
};
exports.createFleetAuthzServiceMock = createFleetAuthzServiceMock;
const createMockMetadataRequestContext = () => {
  return {
    endpointAppContextService: createMockEndpointAppContextService(),
    logger: _mocks.loggingSystemMock.create().get('mock_endpoint_app_context'),
    requestHandlerContext: _fixtures.xpackMocks.createRequestHandlerContext()
  };
};
exports.createMockMetadataRequestContext = createMockMetadataRequestContext;
function createRouteHandlerContext(dataClient, savedObjectsClient, overrides = {}) {
  const context = _mocks__.requestContextMock.create((0, _request_context.createMockClients)(), overrides);
  context.core.elasticsearch.client = dataClient;
  context.core.savedObjects.client = savedObjectsClient;
  return context;
}
/**
 * Returns all of the setup needed to test an HTTP api handler
 */
const createHttpApiTestSetupMock = () => {
  const routerMock = _mocks.httpServiceMock.createRouter();
  const endpointAppContextMock = createMockEndpointAppContext();
  const scopedEsClusterClientMock = _mocks.elasticsearchServiceMock.createScopedClusterClient();
  const savedObjectClientMock = _mocks.savedObjectsClientMock.create();
  const httpHandlerContextMock = _mocks__.requestContextMock.convertContext(createRouteHandlerContext(scopedEsClusterClientMock, savedObjectClientMock));
  const httpResponseMock = _mocks.httpServerMock.createResponseFactory();
  const getRegisteredRouteHandler = (method, path) => {
    const methodCalls = routerMock[method].mock.calls;
    const handler = methodCalls.find(([routeConfig]) => routeConfig.path.startsWith(path));
    if (!handler) {
      throw new Error(`Handler for [${method}][${path}] not found`);
    }
    return handler[1];
  };
  return {
    routerMock,
    endpointAppContextMock,
    scopedEsClusterClientMock,
    savedObjectClientMock,
    httpHandlerContextMock,
    httpResponseMock,
    createRequestMock: (options = {}) => {
      return _mocks.httpServerMock.createKibanaRequest(options);
    },
    getEsClientMock: (type = 'internalUser') => {
      return type === 'currentUser' ? scopedEsClusterClientMock.asCurrentUser : scopedEsClusterClientMock.asInternalUser;
    },
    getRegisteredRouteHandler
  };
};
exports.createHttpApiTestSetupMock = createHttpApiTestSetupMock;