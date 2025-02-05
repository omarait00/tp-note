"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateIntegrationConfig = void 0;
var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const throwError = message => {
  const error = new Error(message);
  error.statusCode = 403;
  throw error;
};
const validateEndpointIntegrationConfig = (config, logger) => {
  var _config$endpointConfi;
  if (!(config !== null && config !== void 0 && (_config$endpointConfi = config.endpointConfig) !== null && _config$endpointConfi !== void 0 && _config$endpointConfi.preset)) {
    logger.warn('missing endpointConfig preset');
    throwError('invalid endpointConfig preset');
  }
  if (![_constants.ENDPOINT_CONFIG_PRESET_NGAV, _constants.ENDPOINT_CONFIG_PRESET_EDR_COMPLETE, _constants.ENDPOINT_CONFIG_PRESET_EDR_ESSENTIAL].includes(config.endpointConfig.preset)) {
    logger.warn(`invalid endpointConfig preset: ${config.endpointConfig.preset}`);
    throwError('invalid endpointConfig preset');
  }
};
const validateCloudIntegrationConfig = (config, logger) => {
  var _config$eventFilters;
  if (!(config !== null && config !== void 0 && config.eventFilters)) {
    logger.warn(`eventFilters is required for cloud integration: {eventFilters : nonInteractiveSession: true / false}`);
    throwError('eventFilters is required for cloud integration');
  }
  if (typeof ((_config$eventFilters = config.eventFilters) === null || _config$eventFilters === void 0 ? void 0 : _config$eventFilters.nonInteractiveSession) !== 'boolean') {
    var _config$eventFilters2;
    logger.warn(`missing or invalid value for eventFilters nonInteractiveSession: ${(_config$eventFilters2 = config.eventFilters) === null || _config$eventFilters2 === void 0 ? void 0 : _config$eventFilters2.nonInteractiveSession}`);
    throwError('invalid value for eventFilters nonInteractiveSession');
  }
};
const validateIntegrationConfig = (config, logger) => {
  if (config.type === 'endpoint') {
    validateEndpointIntegrationConfig(config, logger);
  } else if (config.type === 'cloud') {
    validateCloudIntegrationConfig(config, logger);
  } else {
    logger.warn(`Invalid integration config type ${config}`);
    throwError('Invalid integration config type');
  }
};
exports.validateIntegrationConfig = validateIntegrationConfig;