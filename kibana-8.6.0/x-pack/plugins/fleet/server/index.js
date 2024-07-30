"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "AgentNotFoundError", {
  enumerable: true,
  get: function () {
    return _errors.AgentNotFoundError;
  }
});
Object.defineProperty(exports, "FleetUnauthorizedError", {
  enumerable: true,
  get: function () {
    return _errors.FleetUnauthorizedError;
  }
});
Object.defineProperty(exports, "config", {
  enumerable: true,
  get: function () {
    return _config.config;
  }
});
Object.defineProperty(exports, "getRegistryUrl", {
  enumerable: true,
  get: function () {
    return _services.getRegistryUrl;
  }
});
exports.plugin = void 0;
Object.defineProperty(exports, "relativeDownloadUrlFromArtifact", {
  enumerable: true,
  get: function () {
    return _mappings.relativeDownloadUrlFromArtifact;
  }
});
var _plugin = require("./plugin");
var _services = require("./services");
var _errors = require("./errors");
var _config = require("./config");
var _mappings = require("./services/artifacts/mappings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const plugin = initializerContext => {
  return new _plugin.FleetPlugin(initializerContext);
};
exports.plugin = plugin;