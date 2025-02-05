"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceAllowedRoute = void 0;
var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getServiceAllowedRoute = () => ({
  method: 'GET',
  path: _constants.API_URLS.SERVICE_ALLOWED,
  validate: {},
  handler: async ({
    syntheticsMonitorClient,
    server
  }) => {
    var _server$cloud, _server$config$servic;
    const isESS = Boolean((_server$cloud = server.cloud) === null || _server$cloud === void 0 ? void 0 : _server$cloud.isCloudEnabled) && ((_server$config$servic = server.config.service) === null || _server$config$servic === void 0 ? void 0 : _server$config$servic.manifestUrl);
    return {
      serviceAllowed: isESS ? syntheticsMonitorClient.syntheticsService.isAllowed : true,
      signupUrl: syntheticsMonitorClient.syntheticsService.signupUrl
    };
  }
});
exports.getServiceAllowedRoute = getServiceAllowedRoute;