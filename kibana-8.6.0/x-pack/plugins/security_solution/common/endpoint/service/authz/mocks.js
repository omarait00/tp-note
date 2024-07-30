"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEndpointAuthzInitialStateMock = void 0;
var _authz = require("./authz");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getEndpointAuthzInitialStateMock = (overrides = {}) => {
  const authz = {
    ...Object.entries((0, _authz.getEndpointAuthzInitialState)()).reduce((mockPrivileges, [key, value]) => {
      // Invert the initial values (from `false` to `true`) so that everything is authorized
      mockPrivileges[key] = !value;
      return mockPrivileges;
    }, {}),
    // this one is currently treated special in that everyone can un-isolate
    canUnIsolateHost: true,
    ...overrides
  };
  return authz;
};
exports.getEndpointAuthzInitialStateMock = getEndpointAuthzInitialStateMock;