"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createInternalReadonlySoClient = exports.InternalReadonlySoClientMethodNotAllowedError = void 0;
var _errors = require("../../../common/endpoint/errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const RESTRICTED_METHODS = ['bulkCreate', 'bulkUpdate', 'create', 'createPointInTimeFinder', 'delete', 'removeReferencesTo', 'openPointInTimeForType', 'closePointInTime', 'update', 'updateObjectsSpaces'];
class InternalReadonlySoClientMethodNotAllowedError extends _errors.EndpointError {}

/**
 * Creates an internal (system user) Saved Objects client (permissions turned off) that can only perform READ
 * operations.
 */
exports.InternalReadonlySoClientMethodNotAllowedError = InternalReadonlySoClientMethodNotAllowedError;
const createInternalReadonlySoClient = savedObjectsServiceStart => {
  const fakeRequest = {
    headers: {},
    getBasePath: () => '',
    path: '/',
    route: {
      settings: {}
    },
    url: {
      href: {}
    },
    raw: {
      req: {
        url: '/'
      }
    }
  };
  const internalSoClient = savedObjectsServiceStart.getScopedClient(fakeRequest, {
    excludedWrappers: ['security']
  });
  return new Proxy(internalSoClient, {
    get(target, methodName, receiver) {
      if (RESTRICTED_METHODS.includes(methodName)) {
        throw new InternalReadonlySoClientMethodNotAllowedError(`Method [${methodName}] not allowed on internal readonly SO Client`);
      }
      return Reflect.get(target, methodName, receiver);
    }
  });
};
exports.createInternalReadonlySoClient = createInternalReadonlySoClient;