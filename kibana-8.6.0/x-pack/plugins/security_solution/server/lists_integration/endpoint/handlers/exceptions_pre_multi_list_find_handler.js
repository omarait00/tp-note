"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExceptionsPreMultiListFindHandler = void 0;
var _validators = require("../validators");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getExceptionsPreMultiListFindHandler = endpointAppContextService => {
  return async function ({
    data,
    context: {
      request
    }
  }) {
    if (!data.namespaceType.includes('agnostic')) {
      return data;
    }

    // validate Trusted application
    if (data.listId.some(id => _validators.TrustedAppValidator.isTrustedApp({
      listId: id
    }))) {
      await new _validators.TrustedAppValidator(endpointAppContextService, request).validatePreMultiListFind();
      return data;
    }

    // Validate Host Isolation Exceptions
    if (data.listId.some(listId => _validators.HostIsolationExceptionsValidator.isHostIsolationException({
      listId
    }))) {
      await new _validators.HostIsolationExceptionsValidator(endpointAppContextService, request).validatePreMultiListFind();
      return data;
    }

    // Event Filters Exceptions
    if (data.listId.some(listId => _validators.EventFilterValidator.isEventFilter({
      listId
    }))) {
      await new _validators.EventFilterValidator(endpointAppContextService, request).validatePreMultiListFind();
      return data;
    }

    // validate Blocklist
    if (data.listId.some(id => _validators.BlocklistValidator.isBlocklist({
      listId: id
    }))) {
      await new _validators.BlocklistValidator(endpointAppContextService, request).validatePreMultiListFind();
      return data;
    }
    return data;
  };
};
exports.getExceptionsPreMultiListFindHandler = getExceptionsPreMultiListFindHandler;