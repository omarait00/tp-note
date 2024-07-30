"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRuleTypeMocks = void 0;
var _rxjs = require("rxjs");
var _mocks = require("../../../../../../../src/core/server/mocks");
var _mocks2 = require("../../../../../rule_registry/server/mocks");
var _ = require("../../..");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createRuleTypeMocks = () => {
  let alertExecutor;
  const mockedConfig$ = (0, _rxjs.of)({
    indices: {
      error: 'apm-*',
      transaction: 'apm-*'
    }
  });
  const loggerMock = {
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };
  const alerting = {
    registerType: ({
      executor
    }) => {
      alertExecutor = executor;
    }
  };
  const scheduleActions = jest.fn();
  const services = {
    scopedClusterClient: _mocks.elasticsearchServiceMock.createScopedClusterClient(),
    savedObjectsClient: {
      get: () => ({
        attributes: {
          consumer: _.APM_SERVER_FEATURE_ID
        }
      })
    },
    alertFactory: {
      create: jest.fn(() => ({
        scheduleActions
      })),
      done: {}
    },
    alertWithLifecycle: jest.fn(),
    logger: loggerMock,
    shouldWriteAlerts: () => true
  };
  return {
    dependencies: {
      alerting,
      basePath: {
        prepend: path => `http://localhost:5601/eyr${path}`,
        publicBaseUrl: 'http://localhost:5601/eyr',
        serverBasePath: '/eyr'
      },
      config$: mockedConfig$,
      observability: {
        getAlertDetailsConfig: jest.fn().mockReturnValue({
          apm: true
        })
      },
      logger: loggerMock,
      ruleDataClient: _mocks2.ruleRegistryMocks.createRuleDataClient('.alerts-observability.apm.alerts')
    },
    services,
    scheduleActions,
    executor: async ({
      params
    }) => {
      return alertExecutor({
        services,
        params,
        rule: {
          consumer: _.APM_SERVER_FEATURE_ID,
          name: 'name',
          producer: 'producer',
          ruleTypeId: 'ruleTypeId',
          ruleTypeName: 'ruleTypeName'
        },
        startedAt: new Date()
      });
    }
  };
};
exports.createRuleTypeMocks = createRuleTypeMocks;