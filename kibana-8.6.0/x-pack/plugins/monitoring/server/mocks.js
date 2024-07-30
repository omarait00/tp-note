"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.monitoringPluginMock = void 0;
var _rxjs = require("rxjs");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createLicenseServiceMock = () => ({
  refresh: jest.fn(),
  license$: new _rxjs.Subject(),
  getMessage: jest.fn(),
  getWatcherFeature: jest.fn(),
  getMonitoringFeature: jest.fn(),
  getSecurityFeature: jest.fn(),
  stop: jest.fn()
});

// this might be incomplete and is added to as needed
const monitoringPluginMock = {
  createLicenseServiceMock
};
exports.monitoringPluginMock = monitoringPluginMock;