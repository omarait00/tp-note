"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSyntheticsRouteWithAuth = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createSyntheticsRouteWithAuth = (libs, routeCreator) => {
  const restRoute = routeCreator(libs);
  const {
    handler,
    method,
    path,
    options,
    ...rest
  } = restRoute;
  const licenseCheckHandler = async ({
    context,
    response,
    ...restProps
  }) => {
    const {
      statusCode,
      message
    } = libs.license((await context.licensing).license);
    if (statusCode === 200) {
      return handler({
        context,
        response,
        ...restProps
      });
    }
    switch (statusCode) {
      case 400:
        return response.badRequest({
          body: {
            message
          }
        });
      case 401:
        return response.unauthorized({
          body: {
            message
          }
        });
      case 403:
        return response.forbidden({
          body: {
            message
          }
        });
      default:
        throw new Error('Failed to validate the license');
    }
  };
  return {
    method,
    path,
    options,
    handler: licenseCheckHandler,
    ...rest
  };
};
exports.createSyntheticsRouteWithAuth = createSyntheticsRouteWithAuth;