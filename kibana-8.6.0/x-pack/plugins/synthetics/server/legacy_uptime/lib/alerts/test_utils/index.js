"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRuleTypeMocks = exports.bootstrapDependencies = void 0;
var _mocks = require("../../../../../../rule_registry/server/mocks");
var _mocks2 = require("../../../../../../alerting/server/mocks");
var _test_helpers = require("../../requests/test_helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * The alert takes some dependencies as parameters; these are things like
 * kibana core services and plugins. This function helps reduce the amount of
 * boilerplate required.
 * @param customRequests client tests can use this paramter to provide their own request mocks,
 * so we don't have to mock them all for each test.
 */
const bootstrapDependencies = (customRequests, customPlugins = {
  observability: {
    getAlertDetailsConfig: () => ({
      uptime: true
    })
  }
}) => {
  const router = {};
  const basePath = {
    prepend: url => {
      return `/hfe${url}`;
    },
    publicBaseUrl: 'http://localhost:5601/hfe',
    serverBasePath: '/hfe'
  };
  // these server/libs parameters don't have any functionality, which is fine
  // because we aren't testing them here
  const server = {
    router,
    config: {},
    basePath
  };
  const plugins = customPlugins;
  const libs = {
    requests: {}
  };
  libs.requests = {
    ...libs.requests,
    ...customRequests
  };
  return {
    server,
    libs,
    plugins
  };
};
exports.bootstrapDependencies = bootstrapDependencies;
const createRuleTypeMocks = (recoveredAlerts = []) => {
  const loggerMock = {
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };
  const scheduleActions = jest.fn();
  const replaceState = jest.fn();
  const setContext = jest.fn();
  const services = {
    ...(0, _test_helpers.getUptimeESMockClient)(),
    ..._mocks2.alertsMock.createRuleExecutorServices(),
    alertFactory: {
      ..._mocks2.alertsMock.createRuleExecutorServices().alertFactory,
      done: () => ({
        getRecoveredAlerts: () => createRecoveredAlerts(recoveredAlerts, setContext)
      })
    },
    alertWithLifecycle: jest.fn().mockReturnValue({
      scheduleActions,
      replaceState
    }),
    getAlertStartedDate: jest.fn().mockReturnValue('2022-03-17T13:13:33.755Z'),
    getAlertUuid: jest.fn().mockReturnValue('mock-alert-uuid'),
    logger: loggerMock
  };
  return {
    dependencies: {
      logger: loggerMock,
      ruleDataClient: _mocks.ruleRegistryMocks.createRuleDataClient('.alerts-observability.uptime.alerts')
    },
    services,
    scheduleActions,
    replaceState,
    setContext
  };
};
exports.createRuleTypeMocks = createRuleTypeMocks;
const createRecoveredAlerts = (alerts, setContext) => {
  return alerts.map(alert => ({
    getId: () => 'mock-id',
    getState: () => alert,
    setContext,
    context: {}
  }));
};