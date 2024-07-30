"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.APMEventClient = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _server = require("../../../../../../observability/server");
var _lodash = require("lodash");
var _common = require("../../../../../../observability/common");
var _with_apm_span = require("../../../../utils/with_apm_span");
var _call_async_with_debug = require("../call_async_with_debug");
var _cancel_es_request_on_abort = require("../cancel_es_request_on_abort");
var _unpack_processor_events = require("./unpack_processor_events");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class APMEventClient {
  constructor(config) {
    (0, _defineProperty2.default)(this, "esClient", void 0);
    (0, _defineProperty2.default)(this, "debug", void 0);
    (0, _defineProperty2.default)(this, "request", void 0);
    (0, _defineProperty2.default)(this, "indices", void 0);
    (0, _defineProperty2.default)(this, "includeFrozen", void 0);
    (0, _defineProperty2.default)(this, "forceSyntheticSource", void 0);
    this.esClient = config.esClient;
    this.debug = config.debug;
    this.request = config.request;
    this.indices = config.indices;
    this.includeFrozen = config.options.includeFrozen;
    this.forceSyntheticSource = config.options.forceSyntheticSource;
  }
  callAsyncWithDebug({
    requestType,
    params,
    cb,
    operationName
  }) {
    return (0, _call_async_with_debug.callAsyncWithDebug)({
      getDebugMessage: () => ({
        body: (0, _call_async_with_debug.getDebugBody)({
          params,
          requestType,
          operationName
        }),
        title: (0, _call_async_with_debug.getDebugTitle)(this.request)
      }),
      isCalledWithInternalUser: false,
      debug: this.debug,
      request: this.request,
      requestType,
      operationName,
      requestParams: params,
      cb: () => {
        const controller = new AbortController();
        const promise = (0, _with_apm_span.withApmSpan)(operationName, () => {
          return (0, _cancel_es_request_on_abort.cancelEsRequestOnAbort)(cb({
            signal: controller.signal,
            meta: true
          }), this.request, controller);
        });
        return (0, _server.unwrapEsResponse)(promise);
      }
    });
  }
  async search(operationName, params) {
    const withProcessorEventFilter = (0, _unpack_processor_events.unpackProcessorEvents)(params, this.indices);
    const forceSyntheticSourceForThisRequest = this.forceSyntheticSource && params.apm.events.includes(_common.ProcessorEvent.metric);
    const searchParams = {
      ...withProcessorEventFilter,
      ...(this.includeFrozen ? {
        ignore_throttled: false
      } : {}),
      ignore_unavailable: true,
      preference: 'any',
      ...(forceSyntheticSourceForThisRequest ? {
        force_synthetic_source: true
      } : {})
    };
    return this.callAsyncWithDebug({
      cb: opts => this.esClient.search(searchParams, opts),
      operationName,
      params: searchParams,
      requestType: 'search'
    });
  }
  async eqlSearch(operationName, params) {
    const index = (0, _unpack_processor_events.processorEventsToIndex)(params.apm.events, this.indices);
    const requestParams = {
      index,
      ...(0, _lodash.omit)(params, 'apm')
    };
    return this.callAsyncWithDebug({
      operationName,
      requestType: 'eql_search',
      params: requestParams,
      cb: opts => this.esClient.eql.search(requestParams, opts)
    });
  }
  async fieldCaps(operationName, params) {
    const index = (0, _unpack_processor_events.processorEventsToIndex)(params.apm.events, this.indices);
    const requestParams = {
      index,
      ...(0, _lodash.omit)(params, 'apm')
    };
    return this.callAsyncWithDebug({
      operationName,
      requestType: 'field_caps',
      params: requestParams,
      cb: opts => this.esClient.fieldCaps(requestParams, opts)
    });
  }
  async termsEnum(operationName, params) {
    const index = (0, _unpack_processor_events.processorEventsToIndex)(params.apm.events, this.indices);
    const requestParams = {
      index: Array.isArray(index) ? index.join(',') : index,
      ...(0, _lodash.omit)(params, 'apm')
    };
    return this.callAsyncWithDebug({
      operationName,
      requestType: 'terms_enum',
      params: requestParams,
      cb: opts => this.esClient.termsEnum(requestParams, opts)
    });
  }
}
exports.APMEventClient = APMEventClient;