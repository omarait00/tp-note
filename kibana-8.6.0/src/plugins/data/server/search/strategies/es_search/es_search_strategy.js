"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.esSearchStrategyProvider = void 0;
var _rxjs = require("rxjs");
var _operators = require("rxjs/operators");
var _server = require("../../../../../kibana_utils/server");
var _request_utils = require("./request_utils");
var _response_utils = require("./response_utils");
var _usage = require("../../collectors/search/usage");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const esSearchStrategyProvider = (config$, logger, usage) => ({
  /**
   * @param request
   * @param options
   * @param deps
   * @throws `KbnServerError`
   * @returns `Observable<IEsSearchResponse<any>>`
   */
  search: (request, {
    abortSignal,
    transport,
    ...options
  }, {
    esClient,
    uiSettingsClient
  }) => {
    var _request$params, _request$params$body;
    // Only default index pattern type is supported here.
    // See ese for other type support.
    if (request.indexType) {
      throw new _server.KbnServerError(`Unsupported index pattern type ${request.indexType}`, 400);
    }
    const isPit = ((_request$params = request.params) === null || _request$params === void 0 ? void 0 : (_request$params$body = _request$params.body) === null || _request$params$body === void 0 ? void 0 : _request$params$body.pit) != null;
    const search = async () => {
      try {
        var _request$params2;
        const config = await (0, _rxjs.firstValueFrom)(config$);
        // @ts-expect-error params fall back to any, but should be valid SearchRequest params
        const {
          terminateAfter,
          ...requestParams
        } = (_request$params2 = request.params) !== null && _request$params2 !== void 0 ? _request$params2 : {};
        const defaults = await (0, _request_utils.getDefaultSearchParams)(uiSettingsClient, {
          isPit
        });
        const params = {
          ...defaults,
          ...(0, _request_utils.getShardTimeout)(config),
          ...(terminateAfter ? {
            terminate_after: terminateAfter
          } : {}),
          ...requestParams
        };
        const body = await esClient.asCurrentUser.search(params, {
          signal: abortSignal,
          ...transport
        });
        const response = (0, _response_utils.shimHitsTotal)(body, options);
        return (0, _response_utils.toKibanaSearchResponse)(response);
      } catch (e) {
        throw (0, _server.getKbnServerError)(e);
      }
    };
    return (0, _rxjs.from)(search()).pipe((0, _operators.tap)((0, _usage.searchUsageObserver)(logger, usage, options)));
  }
});
exports.esSearchStrategyProvider = esSearchStrategyProvider;