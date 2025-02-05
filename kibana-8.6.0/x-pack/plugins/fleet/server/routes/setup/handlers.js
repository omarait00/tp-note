"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFleetStatusHandler = exports.fleetSetupHandler = void 0;
var _services = require("../../services");
var _setup = require("../../services/setup");
var _fleet_server = require("../../services/fleet_server");
var _errors = require("../../errors");
var _package_verification = require("../../services/epm/packages/package_verification");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getFleetStatusHandler = async (context, request, response) => {
  try {
    var _appContextService$ge;
    const isApiKeysEnabled = await _services.appContextService.getSecurity().authc.apiKeys.areAPIKeysEnabled();
    const coreContext = await context.core;
    const isFleetServerSetup = await (0, _fleet_server.hasFleetServers)(coreContext.elasticsearch.client.asInternalUser);
    const missingRequirements = [];
    const missingOptionalFeatures = [];
    if (!isApiKeysEnabled) {
      missingRequirements.push('api_keys');
    }
    if (!isFleetServerSetup) {
      missingRequirements.push('fleet_server');
    }
    if (!((_appContextService$ge = _services.appContextService.getEncryptedSavedObjectsSetup()) !== null && _appContextService$ge !== void 0 && _appContextService$ge.canEncrypt)) {
      missingOptionalFeatures.push('encrypted_saved_object_encryption_key_required');
    }
    const body = {
      isReady: missingRequirements.length === 0,
      missing_requirements: missingRequirements,
      missing_optional_features: missingOptionalFeatures
    };
    const packageVerificationKeyId = await (0, _package_verification.getGpgKeyIdOrUndefined)();
    if (packageVerificationKeyId) {
      body.package_verification_key_id = packageVerificationKeyId;
    }
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultFleetErrorHandler)({
      error,
      response
    });
  }
};
exports.getFleetStatusHandler = getFleetStatusHandler;
const fleetSetupHandler = async (context, request, response) => {
  try {
    const soClient = (await context.fleet).epm.internalSoClient;
    const esClient = (await context.core).elasticsearch.client.asInternalUser;
    const setupStatus = await (0, _setup.setupFleet)(soClient, esClient);
    const body = {
      ...setupStatus,
      nonFatalErrors: (0, _setup.formatNonFatalErrors)(setupStatus.nonFatalErrors)
    };
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultFleetErrorHandler)({
      error,
      response
    });
  }
};
exports.fleetSetupHandler = fleetSetupHandler;