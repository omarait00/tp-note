"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExceptionsPreExportHandler = void 0;
var _validators = require("../validators");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getExceptionsPreExportHandler = endpointAppContextService => {
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
    const {
      listId: maybeListId,
      id
    } = data;
    let listId = maybeListId;
    if (!listId && id) {
      var _await$exceptionListC, _await$exceptionListC2;
      listId = (_await$exceptionListC = (_await$exceptionListC2 = await exceptionListClient.getExceptionList(data)) === null || _await$exceptionListC2 === void 0 ? void 0 : _await$exceptionListC2.list_id) !== null && _await$exceptionListC !== void 0 ? _await$exceptionListC : null;
    }
    if (!listId) {
      return data;
    }

    // Validate Trusted Applications
    if (_validators.TrustedAppValidator.isTrustedApp({
      listId
    })) {
      await new _validators.TrustedAppValidator(endpointAppContextService, request).validatePreExport();
      return data;
    }

    // Host Isolation Exceptions validations
    if (_validators.HostIsolationExceptionsValidator.isHostIsolationException({
      listId
    })) {
      await new _validators.HostIsolationExceptionsValidator(endpointAppContextService, request).validatePreExport();
      return data;
    }

    // Event Filter validations
    if (_validators.EventFilterValidator.isEventFilter({
      listId
    })) {
      await new _validators.EventFilterValidator(endpointAppContextService, request).validatePreExport();
      return data;
    }

    // Validate Blocklists
    if (_validators.BlocklistValidator.isBlocklist({
      listId
    })) {
      await new _validators.BlocklistValidator(endpointAppContextService, request).validatePreExport();
      return data;
    }
    return data;
  };
};
exports.getExceptionsPreExportHandler = getExceptionsPreExportHandler;