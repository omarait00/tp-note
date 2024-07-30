"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ruleMonitoringServiceMock = exports.alertsMock = void 0;
Object.defineProperty(exports, "rulesClientMock", {
  enumerable: true,
  get: function () {
    return _rules_client.rulesClientMock;
  }
});
var _mocks = require("../../../../src/core/server/mocks");
var _mocks2 = require("../../../../src/plugins/data/common/search/search_source/mocks");
var _rules_client = require("./rules_client.mock");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createSetupMock = () => {
  const mock = {
    registerType: jest.fn(),
    getSecurityHealth: jest.fn(),
    getConfig: jest.fn()
  };
  return mock;
};
const createStartMock = () => {
  const mock = {
    listTypes: jest.fn(),
    getAllTypes: jest.fn(),
    getAlertingAuthorizationWithRequest: jest.fn(),
    getRulesClientWithRequest: jest.fn().mockResolvedValue(_rules_client.rulesClientMock.create()),
    getFrameworkHealth: jest.fn()
  };
  return mock;
};
const createAlertFactoryMock = {
  create: () => {
    const mock = {
      hasScheduledActions: jest.fn(),
      isThrottled: jest.fn(),
      getScheduledActionOptions: jest.fn(),
      unscheduleActions: jest.fn(),
      getState: jest.fn(),
      scheduleActions: jest.fn(),
      replaceState: jest.fn(),
      updateLastScheduledActions: jest.fn(),
      toJSON: jest.fn(),
      toRaw: jest.fn()
    };

    // support chaining
    mock.replaceState.mockReturnValue(mock);
    mock.unscheduleActions.mockReturnValue(mock);
    mock.scheduleActions.mockReturnValue(mock);
    return mock;
  },
  done: () => {
    const mock = {
      getRecoveredAlerts: jest.fn().mockReturnValue([])
    };
    return mock;
  }
};
const createAbortableSearchClientMock = () => {
  const mock = {
    search: jest.fn()
  };
  return mock;
};
const createAbortableSearchServiceMock = () => {
  return {
    asInternalUser: createAbortableSearchClientMock(),
    asCurrentUser: createAbortableSearchClientMock()
  };
};
const createRuleMonitoringServiceMock = () => {
  const mock = {
    setLastRunMetricsTotalSearchDurationMs: jest.fn(),
    setLastRunMetricsTotalIndexingDurationMs: jest.fn(),
    setLastRunMetricsTotalAlertsDetected: jest.fn(),
    setLastRunMetricsTotalAlertsCreated: jest.fn(),
    setLastRunMetricsGapDurationS: jest.fn()
  };
  return mock;
};
const createRuleExecutorServicesMock = () => {
  const alertFactoryMockCreate = createAlertFactoryMock.create();
  const alertFactoryMockDone = createAlertFactoryMock.done();
  return {
    alertFactory: {
      create: jest.fn().mockReturnValue(alertFactoryMockCreate),
      alertLimit: {
        getValue: jest.fn().mockReturnValue(1000),
        setLimitReached: jest.fn()
      },
      done: jest.fn().mockReturnValue(alertFactoryMockDone)
    },
    savedObjectsClient: _mocks.savedObjectsClientMock.create(),
    uiSettingsClient: _mocks.uiSettingsServiceMock.createClient(),
    scopedClusterClient: _mocks.elasticsearchServiceMock.createScopedClusterClient(),
    shouldWriteAlerts: () => true,
    shouldStopExecution: () => true,
    search: createAbortableSearchServiceMock(),
    searchSourceClient: _mocks2.searchSourceCommonMock,
    ruleMonitoringService: createRuleMonitoringServiceMock()
  };
};
const alertsMock = {
  createAlertFactory: createAlertFactoryMock,
  createSetup: createSetupMock,
  createStart: createStartMock,
  createRuleExecutorServices: createRuleExecutorServicesMock
};
exports.alertsMock = alertsMock;
const ruleMonitoringServiceMock = {
  create: createRuleMonitoringServiceMock
};
exports.ruleMonitoringServiceMock = ruleMonitoringServiceMock;