"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = exports.getHealthCheckHandler = void 0;
var _constants = require("../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const registerRoutes = router => {
  router.get({
    path: _constants.APP_API_ROUTES.HEALTH_CHECK_PATTERN,
    validate: {},
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, getHealthCheckHandler);
};
exports.registerRoutes = registerRoutes;
const getHealthCheckHandler = async (context, request, response) => {
  return response.ok({
    body: 'Fleet Health Check Report:\nFleet Server: HEALTHY',
    headers: {
      'content-type': 'text/plain'
    }
  });
};
exports.getHealthCheckHandler = getHealthCheckHandler;