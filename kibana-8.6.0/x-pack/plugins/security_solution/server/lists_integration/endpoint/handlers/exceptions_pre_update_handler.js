"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExceptionsPreUpdateItemHandler = void 0;
var _validators = require("../validators");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getExceptionsPreUpdateItemHandler = endpointAppContextService => {
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
    const currentSavedItem = await exceptionListClient.getExceptionListItem({
      id: data.id,
      itemId: data.itemId,
      namespaceType: data.namespaceType
    });

    // We don't want to `throw` here because we don't know for sure that the item is one we care about.
    // So we just return the data and the Lists plugin will likely error out because it can't find the item
    if (!currentSavedItem) {
      return data;
    }
    const listId = currentSavedItem.list_id;

    // Validate Trusted Applications
    if (_validators.TrustedAppValidator.isTrustedApp({
      listId
    })) {
      const trustedAppValidator = new _validators.TrustedAppValidator(endpointAppContextService, request);
      const validatedItem = await trustedAppValidator.validatePreUpdateItem(data, currentSavedItem);
      trustedAppValidator.notifyFeatureUsage(data, 'TRUSTED_APP_BY_POLICY');
      return validatedItem;
    }

    // Validate Event Filters
    if (_validators.EventFilterValidator.isEventFilter({
      listId
    })) {
      const eventFilterValidator = new _validators.EventFilterValidator(endpointAppContextService, request);
      const validatedItem = await eventFilterValidator.validatePreUpdateItem(data, currentSavedItem);
      eventFilterValidator.notifyFeatureUsage(data, 'EVENT_FILTERS_BY_POLICY');
      return validatedItem;
    }

    // Validate host isolation
    if (_validators.HostIsolationExceptionsValidator.isHostIsolationException({
      listId
    })) {
      const hostIsolationExceptionValidator = new _validators.HostIsolationExceptionsValidator(endpointAppContextService, request);
      const validatedItem = await hostIsolationExceptionValidator.validatePreUpdateItem(data);
      hostIsolationExceptionValidator.notifyFeatureUsage(data, 'HOST_ISOLATION_EXCEPTION_BY_POLICY');
      hostIsolationExceptionValidator.notifyFeatureUsage(data, 'HOST_ISOLATION_EXCEPTION');
      return validatedItem;
    }

    // Validate Blocklists
    if (_validators.BlocklistValidator.isBlocklist({
      listId
    })) {
      const blocklistValidator = new _validators.BlocklistValidator(endpointAppContextService, request);
      const validatedItem = await blocklistValidator.validatePreUpdateItem(data, currentSavedItem);
      blocklistValidator.notifyFeatureUsage(data, 'BLOCKLIST_BY_POLICY');
      return validatedItem;
    }
    return data;
  };
};
exports.getExceptionsPreUpdateItemHandler = getExceptionsPreUpdateItemHandler;