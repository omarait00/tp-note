"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.infraPluginMock = void 0;
var _log_views_service = require("./services/log_views/log_views_service.mock");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createInfraSetupMock = () => {
  const infraSetupMock = {
    defineInternalSourceConfiguration: jest.fn(),
    logViews: (0, _log_views_service.createLogViewsServiceSetupMock)()
  };
  return infraSetupMock;
};
const createInfraStartMock = () => {
  const infraStartMock = {
    getMetricIndices: jest.fn(),
    logViews: (0, _log_views_service.createLogViewsServiceStartMock)()
  };
  return infraStartMock;
};
const infraPluginMock = {
  createSetupContract: createInfraSetupMock,
  createStartContract: createInfraStartMock
};
exports.infraPluginMock = infraPluginMock;