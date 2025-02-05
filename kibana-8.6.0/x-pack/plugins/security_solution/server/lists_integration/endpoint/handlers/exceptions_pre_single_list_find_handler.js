"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExceptionsPreSingleListFindHandler = void 0;
var _validators = require("../validators");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getExceptionsPreSingleListFindHandler = endpointAppContextService => {
  return async function ({
    data,
    context: {
      request
    }
  }) {
    if (data.namespaceType !== 'agnostic') {
      return data;
    }
    const {
      listId
    } = data;

    // Validate Trusted applications
    if (_validators.TrustedAppValidator.isTrustedApp({
      listId
    })) {
      await new _validators.TrustedAppValidator(endpointAppContextService, request).validatePreSingleListFind();
      return data;
    }

    // Host Isolation Exceptions
    if (_validators.HostIsolationExceptionsValidator.isHostIsolationException({
      listId
    })) {
      await new _validators.HostIsolationExceptionsValidator(endpointAppContextService, request).validatePreSingleListFind();
      return data;
    }

    // Event Filters Exceptions
    if (_validators.EventFilterValidator.isEventFilter({
      listId
    })) {
      await new _validators.EventFilterValidator(endpointAppContextService, request).validatePreSingleListFind();
      return data;
    }

    // Validate Blocklists
    if (_validators.BlocklistValidator.isBlocklist({
      listId
    })) {
      await new _validators.BlocklistValidator(endpointAppContextService, request).validatePreSingleListFind();
      return data;
    }
    return data;
  };
};
exports.getExceptionsPreSingleListFindHandler = getExceptionsPreSingleListFindHandler;