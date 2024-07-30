"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createInternalESClient = createInternalESClient;
var _server = require("../../../../../../observability/server");
var _call_async_with_debug = require("../call_async_with_debug");
var _cancel_es_request_on_abort = require("../cancel_es_request_on_abort");
var _get_apm_indices = require("../../../../routes/settings/apm_indices/get_apm_indices");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function createInternalESClient({
  context,
  debug,
  request,
  config
}) {
  const coreContext = await context.core;
  const {
    asInternalUser
  } = coreContext.elasticsearch.client;
  const savedObjectsClient = coreContext.savedObjects.client;
  function callEs(operationName, {
    cb,
    requestType,
    params
  }) {
    return (0, _call_async_with_debug.callAsyncWithDebug)({
      cb: () => {
        const controller = new AbortController();
        return (0, _server.unwrapEsResponse)((0, _cancel_es_request_on_abort.cancelEsRequestOnAbort)(cb(controller.signal), request, controller));
      },
      getDebugMessage: () => ({
        title: (0, _call_async_with_debug.getDebugTitle)(request),
        body: (0, _call_async_with_debug.getDebugBody)({
          params,
          requestType,
          operationName
        })
      }),
      debug,
      isCalledWithInternalUser: true,
      request,
      requestType,
      requestParams: params,
      operationName
    });
  }
  return {
    apmIndices: await (0, _get_apm_indices.getApmIndices)({
      savedObjectsClient,
      config
    }),
    search: async (operationName, params) => {
      return callEs(operationName, {
        requestType: 'search',
        cb: signal => asInternalUser.search(params, {
          signal,
          meta: true
        }),
        params
      });
    },
    index: (operationName, params) => {
      return callEs(operationName, {
        requestType: 'index',
        cb: signal => asInternalUser.index(params, {
          signal,
          meta: true
        }),
        params
      });
    },
    delete: (operationName, params) => {
      return callEs(operationName, {
        requestType: 'delete',
        cb: signal => asInternalUser.delete(params, {
          signal,
          meta: true
        }),
        params
      });
    },
    indicesCreate: (operationName, params) => {
      return callEs(operationName, {
        requestType: 'indices.create',
        cb: signal => asInternalUser.indices.create(params, {
          signal,
          meta: true
        }),
        params
      });
    }
  };
}