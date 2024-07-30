"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultFleetErrorHandler = void 0;
exports.fleetErrorToResponseOptions = fleetErrorToResponseOptions;
var _boom = require("@hapi/boom");
var _services = require("../services");
var _ = require(".");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// unsure if this is correct. would prefer to use something "official"
// this type is based on BadRequest values observed while debugging https://github.com/elastic/kibana/issues/75862

const getHTTPResponseCode = error => {
  if (error instanceof _.RegistryResponseError) {
    // 4xx/5xx's from EPR
    return 500;
  }
  if (error instanceof _.RegistryConnectionError || error instanceof _.RegistryError) {
    // Connection errors (ie. RegistryConnectionError) / fallback  (RegistryError) from EPR
    return 502; // Bad Gateway
  }

  if (error instanceof _.PackageNotFoundError || error instanceof _.PackagePolicyNotFoundError) {
    return 404; // Not Found
  }

  if (error instanceof _.AgentPolicyNameExistsError) {
    return 409; // Conflict
  }

  if (error instanceof _.PackageUnsupportedMediaTypeError) {
    return 415; // Unsupported Media Type
  }

  if (error instanceof _.PackageFailedVerificationError) {
    return 400; // Bad Request
  }

  if (error instanceof _.ConcurrentInstallOperationError) {
    return 409; // Conflict
  }

  if (error instanceof _.AgentNotFoundError) {
    return 404;
  }
  if (error instanceof _.AgentActionNotFoundError) {
    return 404;
  }
  if (error instanceof _.FleetUnauthorizedError) {
    return 403; // Unauthorized
  }

  return 400; // Bad Request
};

function fleetErrorToResponseOptions(error) {
  const logger = _services.appContextService.getLogger();
  // our "expected" errors
  if (error instanceof _.FleetError) {
    // only log the message
    logger.error(error.message);
    return {
      statusCode: getHTTPResponseCode(error),
      body: {
        message: error.message,
        ...(error.attributes && {
          attributes: error.attributes
        })
      }
    };
  }

  // handle any older Boom-based errors or the few places our app uses them
  if ((0, _boom.isBoom)(error)) {
    // only log the message
    logger.error(error.output.payload.message);
    return {
      statusCode: error.output.statusCode,
      body: {
        message: error.output.payload.message
      }
    };
  }

  // not sure what type of error this is. log as much as possible
  logger.error(error);
  return {
    statusCode: 500,
    body: {
      message: error.message
    }
  };
}
const defaultFleetErrorHandler = async ({
  error,
  response
}) => {
  const options = fleetErrorToResponseOptions(error);
  return response.customError(options);
};
exports.defaultFleetErrorHandler = defaultFleetErrorHandler;