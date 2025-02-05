"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExceptionsPreGetOneHandler = void 0;
var _validators = require("../validators");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getExceptionsPreGetOneHandler = endpointAppContextService => {
  return async function ({
    data,
    context: {
      request,
      exceptionListClient
    }
  }) {
    if (data.namespaceType !== 'agnostic') {
      return data;
    }
    const exceptionItem = await exceptionListClient.getExceptionListItem({
      id: data.id,
      itemId: data.itemId,
      namespaceType: data.namespaceType
    });
    if (!exceptionItem) {
      return data;
    }
    const listId = exceptionItem.list_id;

    // Validate Trusted Applications
    if (_validators.TrustedAppValidator.isTrustedApp({
      listId
    })) {
      await new _validators.TrustedAppValidator(endpointAppContextService, request).validatePreGetOneItem();
      return data;
    }

    // validate Host Isolation Exception
    if (_validators.HostIsolationExceptionsValidator.isHostIsolationException({
      listId
    })) {
      await new _validators.HostIsolationExceptionsValidator(endpointAppContextService, request).validatePreGetOneItem();
      return data;
    }

    // Event Filters Exception
    if (_validators.EventFilterValidator.isEventFilter({
      listId
    })) {
      await new _validators.EventFilterValidator(endpointAppContextService, request).validatePreGetOneItem();
      return data;
    }

    // Validate Blocklists
    if (_validators.BlocklistValidator.isBlocklist({
      listId
    })) {
      await new _validators.BlocklistValidator(endpointAppContextService, request).validatePreGetOneItem();
      return data;
    }
    return data;
  };
};
exports.getExceptionsPreGetOneHandler = getExceptionsPreGetOneHandler;