"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCasesClientMockArgs = exports.createCasesClientMock = exports.createCasesClientFactory = void 0;
var _mocks = require("../../../../../src/core/server/mocks");
var _mocks2 = require("../../../security/server/mocks");
var _actions_client = require("../../../actions/server/actions_client.mock");
var _make_lens_embeddable_factory = require("../../../lens/server/embeddable/make_lens_embeddable_factory");
var _mock = require("../authorization/mock");
var _mocks3 = require("../services/mocks");
var _mocks4 = require("../attachment_framework/mocks");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createCasesSubClientMock = () => {
  return {
    create: jest.fn(),
    find: jest.fn(),
    resolve: jest.fn(),
    get: jest.fn(),
    push: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getTags: jest.fn(),
    getReporters: jest.fn(),
    getCasesByAlertID: jest.fn()
  };
};
const createMetricsSubClientMock = () => {
  return {
    getCaseMetrics: jest.fn(),
    getCasesMetrics: jest.fn(),
    getStatusTotalsByType: jest.fn()
  };
};
const createAttachmentsSubClientMock = () => {
  return {
    add: jest.fn(),
    bulkCreate: jest.fn(),
    deleteAll: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
    getAll: jest.fn(),
    get: jest.fn(),
    update: jest.fn(),
    getAllAlertsAttachToCase: jest.fn()
  };
};
const createUserActionsSubClientMock = () => {
  return {
    getAll: jest.fn()
  };
};
const createConfigureSubClientMock = () => {
  return {
    get: jest.fn(),
    getConnectors: jest.fn(),
    update: jest.fn(),
    create: jest.fn()
  };
};
const createCasesClientMock = () => {
  const client = {
    cases: createCasesSubClientMock(),
    attachments: createAttachmentsSubClientMock(),
    userActions: createUserActionsSubClientMock(),
    configure: createConfigureSubClientMock(),
    metrics: createMetricsSubClientMock()
  };
  return client;
};
exports.createCasesClientMock = createCasesClientMock;
const createCasesClientFactory = () => {
  const factory = {
    initialize: jest.fn(),
    create: jest.fn()
  };
  return factory;
};
exports.createCasesClientFactory = createCasesClientFactory;
const createCasesClientMockArgs = () => {
  return {
    services: {
      alertsService: (0, _mocks3.createAlertServiceMock)(),
      attachmentService: (0, _mocks3.createAttachmentServiceMock)(),
      caseService: (0, _mocks3.createCaseServiceMock)(),
      caseConfigureService: (0, _mocks3.createConfigureServiceMock)(),
      connectorMappingsService: (0, _mocks3.connectorMappingsServiceMock)(),
      userActionService: (0, _mocks3.createUserActionServiceMock)(),
      licensingService: (0, _mocks3.createLicensingServiceMock)(),
      notificationService: (0, _mocks3.createNotificationServiceMock)()
    },
    authorization: (0, _mock.createAuthorizationMock)(),
    logger: _mocks.loggingSystemMock.createLogger(),
    unsecuredSavedObjectsClient: _mocks.savedObjectsClientMock.create(),
    actionsClient: _actions_client.actionsClientMock.create(),
    user: {
      username: 'damaged_raccoon',
      email: 'damaged_raccoon@elastic.co',
      full_name: 'Damaged Raccoon',
      profile_uid: 'u_J41Oh6L9ki-Vo2tOogS8WRTENzhHurGtRc87NgEAlkc_0'
    },
    spaceId: 'default',
    externalReferenceAttachmentTypeRegistry: (0, _mocks4.createExternalReferenceAttachmentTypeRegistryMock)(),
    persistableStateAttachmentTypeRegistry: (0, _mocks4.createPersistableStateAttachmentTypeRegistryMock)(),
    securityStartPlugin: _mocks2.securityMock.createStart(),
    lensEmbeddableFactory: jest.fn().mockReturnValue((0, _make_lens_embeddable_factory.makeLensEmbeddableFactory)(() => ({}), () => ({}), {}))
  };
};
exports.createCasesClientMockArgs = createCasesClientMockArgs;