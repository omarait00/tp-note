"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExceptionsPreCreateItemHandler = void 0;
var _validators = require("../validators");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getExceptionsPreCreateItemHandler = endpointAppContext => {
  return async function ({
    data,
    context: {
      request
    }
  }) {
    if (data.namespaceType !== 'agnostic') {
      return data;
    }

    // Validate trusted apps
    if (_validators.TrustedAppValidator.isTrustedApp(data)) {
      const trustedAppValidator = new _validators.TrustedAppValidator(endpointAppContext, request);
      const validatedItem = await trustedAppValidator.validatePreCreateItem(data);
      trustedAppValidator.notifyFeatureUsage(data, 'TRUSTED_APP_BY_POLICY');
      return validatedItem;
    }

    // Validate event filter
    if (_validators.EventFilterValidator.isEventFilter(data)) {
      const eventFilterValidator = new _validators.EventFilterValidator(endpointAppContext, request);
      const validatedItem = await eventFilterValidator.validatePreCreateItem(data);
      eventFilterValidator.notifyFeatureUsage(data, 'EVENT_FILTERS_BY_POLICY');
      return validatedItem;
    }

    // Validate host isolation
    if (_validators.HostIsolationExceptionsValidator.isHostIsolationException(data)) {
      const hostIsolationExceptionsValidator = new _validators.HostIsolationExceptionsValidator(endpointAppContext, request);
      const validatedItem = await hostIsolationExceptionsValidator.validatePreCreateItem(data);
      hostIsolationExceptionsValidator.notifyFeatureUsage(data, 'HOST_ISOLATION_EXCEPTION_BY_POLICY');
      hostIsolationExceptionsValidator.notifyFeatureUsage(data, 'HOST_ISOLATION_EXCEPTION');
      return validatedItem;
    }

    // Validate blocklists
    if (_validators.BlocklistValidator.isBlocklist(data)) {
      const blocklistValidator = new _validators.BlocklistValidator(endpointAppContext, request);
      const validatedItem = await blocklistValidator.validatePreCreateItem(data);
      blocklistValidator.notifyFeatureUsage(data, 'BLOCKLIST_BY_POLICY');
      return validatedItem;
    }
    return data;
  };
};
exports.getExceptionsPreCreateItemHandler = getExceptionsPreCreateItemHandler;