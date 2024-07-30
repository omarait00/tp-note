"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withEndpointAuthz = void 0;
var _errors = require("../errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Wraps an API route handler and handles authorization checks for endpoint related
 * apis.
 * @param neededAuthz
 * @param routeHandler
 * @param logger
 */
const withEndpointAuthz = (neededAuthz, logger, routeHandler) => {
  var _neededAuthz$all, _neededAuthz$any;
  const needAll = (_neededAuthz$all = neededAuthz.all) !== null && _neededAuthz$all !== void 0 ? _neededAuthz$all : [];
  const needAny = (_neededAuthz$any = neededAuthz.any) !== null && _neededAuthz$any !== void 0 ? _neededAuthz$any : [];
  const validateAll = needAll.length > 0;
  const validateAny = needAny.length > 0;
  const enforceAuthz = validateAll || validateAny;
  if (!enforceAuthz) {
    var _Error$stack;
    logger.warn(`Authorization disabled for API route: ${(_Error$stack = new Error('').stack) !== null && _Error$stack !== void 0 ? _Error$stack : '?'}`);
  }
  const handlerWrapper = async (context, request, response) => {
    if (enforceAuthz) {
      const endpointAuthz = (await context.securitySolution).endpointAuthz;
      const permissionChecker = permission => endpointAuthz[permission];

      // has `all`?
      if (validateAll && !needAll.every(permissionChecker)) {
        return response.forbidden({
          body: new _errors.EndpointAuthorizationError({
            need_all: [...needAll]
          })
        });
      }

      // has `any`?
      if (validateAny && !needAny.some(permissionChecker)) {
        return response.forbidden({
          body: new _errors.EndpointAuthorizationError({
            need_any: [...needAny]
          })
        });
      }
    }

    // Authz is good call the route handler
    return routeHandler(context, request, response);
  };
  return handlerWrapper;
};
exports.withEndpointAuthz = withEndpointAuthz;