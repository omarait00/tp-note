"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inspectSearchParams = inspectSearchParams;
exports.mockNow = mockNow;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function inspectSearchParams(fn, options = {}) {
  var _spy$mock$calls$;
  const spy = jest.fn().mockImplementation(async request => {
    return options.mockResponse ? options.mockResponse(request) : {
      hits: {
        hits: {
          total: {
            value: 0
          }
        }
      }
    };
  });
  let response;
  let error;
  const mockApmEventClient = {
    search: spy
  };
  const indices = {
    sourcemap: 'myIndex',
    error: 'myIndex',
    onboarding: 'myIndex',
    span: 'myIndex',
    transaction: 'myIndex',
    metric: 'myIndex'
  };
  const mockConfig = new Proxy({}, {
    get: (_, key) => {
      const {
        config
      } = options;
      if (config !== null && config !== void 0 && config[key]) {
        return config === null || config === void 0 ? void 0 : config[key];
      }
      switch (key) {
        default:
          return 'myIndex';
        case 'indices':
          return indices;
        case 'ui':
          return {
            enabled: true,
            transactionGroupBucketSize: 1000,
            maxTraceItems: 1000
          };
        case 'metricsInterval':
          return 30;
      }
    }
  });
  const mockInternalESClient = {
    search: spy
  };
  const mockIndices = {
    ...indices,
    apmAgentConfigurationIndex: 'myIndex',
    apmCustomLinkIndex: 'myIndex'
  };
  try {
    response = await fn({
      mockIndices,
      mockApmEventClient,
      mockConfig,
      mockInternalESClient
    });
  } catch (err) {
    error = err;
    // we're only extracting the search params
  }

  return {
    params: (_spy$mock$calls$ = spy.mock.calls[0]) === null || _spy$mock$calls$ === void 0 ? void 0 : _spy$mock$calls$[1],
    response,
    error,
    spy,
    teardown: () => spy.mockClear()
  };
}
function mockNow(date) {
  const fakeNow = new Date(date).getTime();
  return jest.spyOn(Date, 'now').mockReturnValue(fakeNow);
}