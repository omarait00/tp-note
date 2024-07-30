"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.launchDarklyClientMocks = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createLaunchDarklyClientMock() {
  const launchDarklyClientMock = {
    updateUserMetadata: jest.fn(),
    getVariation: jest.fn(),
    getAllFlags: jest.fn(),
    reportMetric: jest.fn(),
    stop: jest.fn()
  };
  return launchDarklyClientMock;
}
const launchDarklyClientMocks = {
  launchDarklyClientMock: createLaunchDarklyClientMock(),
  createLaunchDarklyClient: createLaunchDarklyClientMock
};
exports.launchDarklyClientMocks = launchDarklyClientMocks;