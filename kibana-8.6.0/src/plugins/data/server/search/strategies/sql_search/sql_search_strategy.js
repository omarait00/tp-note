"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sqlSearchStrategyProvider = void 0;
var _operators = require("rxjs/operators");
var _server = require("../../../../../kibana_utils/server");
var _common = require("../../../../common");
var _request_utils = require("./request_utils");
var _response_utils = require("./response_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const sqlSearchStrategyProvider = (searchConfig, logger, useInternalUser = false) => {
  async function cancelAsyncSearch(id, esClient) {
    try {
      const client = useInternalUser ? esClient.asInternalUser : esClient.asCurrentUser;
      await client.sql.deleteAsync({
        id
      });
    } catch (e) {
      throw (0, _server.getKbnServerError)(e);
    }
  }
  function asyncSearch({
    id,
    ...request
  }, options, {
    esClient
  }) {
    const client = useInternalUser ? esClient.asInternalUser : esClient.asCurrentUser;
    const startTime = Date.now();
    const search = async () => {
      var _request$params, _headers;
      const {
        keep_cursor: keepCursor,
        ...params
      } = (_request$params = request.params) !== null && _request$params !== void 0 ? _request$params : {};
      let body;
      let headers;
      if (id) {
        var _params$format;
        ({
          body,
          headers
        } = await client.sql.getAsync({
          format: (_params$format = params === null || params === void 0 ? void 0 : params.format) !== null && _params$format !== void 0 ? _params$format : 'json',
          ...(0, _request_utils.getDefaultAsyncGetParams)(searchConfig, options),
          id
        }, {
          ...options.transport,
          signal: options.abortSignal,
          meta: true
        }));
      } else {
        var _params$format2;
        ({
          headers,
          body
        } = await client.sql.query({
          format: (_params$format2 = params.format) !== null && _params$format2 !== void 0 ? _params$format2 : 'json',
          ...(0, _request_utils.getDefaultAsyncSubmitParams)(searchConfig, options),
          ...params
        }, {
          ...options.transport,
          signal: options.abortSignal,
          meta: true
        }));
      }
      if (!body.is_partial && !body.is_running && body.cursor && !keepCursor) {
        try {
          await client.sql.clearCursor({
            cursor: body.cursor
          });
        } catch (error) {
          logger.warn(`sql search: failed to clear cursor=${body.cursor} for async_search_id=${id}: ${error.message}`);
        }
      }
      return (0, _response_utils.toAsyncKibanaSearchResponse)(body, startTime, (_headers = headers) === null || _headers === void 0 ? void 0 : _headers.warning);
    };
    const cancel = async () => {
      if (id) {
        await cancelAsyncSearch(id, esClient);
      }
    };
    return (0, _common.pollSearch)(search, cancel, {
      pollInterval: searchConfig.asyncSearch.pollInterval,
      ...options
    }).pipe((0, _operators.tap)(response => id = response.id), (0, _operators.catchError)(e => {
      throw (0, _server.getKbnServerError)(e);
    }));
  }
  return {
    /**
     * @param request
     * @param options
     * @param deps `SearchStrategyDependencies`
     * @returns `Observable<IEsSearchResponse<any>>`
     * @throws `KbnServerError`
     */
    search: (request, options, deps) => {
      logger.debug(`sql search: search request=${JSON.stringify(request)}`);
      return asyncSearch(request, options, deps);
    },
    /**
     * @param id async search ID to cancel, as returned from _async_search API
     * @param options
     * @param deps `SearchStrategyDependencies`
     * @returns `Promise<void>`
     * @throws `KbnServerError`
     */
    cancel: async (id, options, {
      esClient
    }) => {
      logger.debug(`sql search: cancel async_search_id=${id}`);
      await cancelAsyncSearch(id, esClient);
    },
    /**
     *
     * @param id async search ID to extend, as returned from _async_search API
     * @param keepAlive
     * @param options
     * @param deps `SearchStrategyDependencies`
     * @returns `Promise<void>`
     * @throws `KbnServerError`
     */
    extend: async (id, keepAlive, options, {
      esClient
    }) => {
      logger.debug(`sql search: extend async_search_id=${id}  keep_alive=${keepAlive}`);
      try {
        const client = useInternalUser ? esClient.asInternalUser : esClient.asCurrentUser;
        await client.sql.getAsync({
          id,
          keep_alive: keepAlive
        });
      } catch (e) {
        throw (0, _server.getKbnServerError)(e);
      }
    }
  };
};
exports.sqlSearchStrategyProvider = sqlSearchStrategyProvider;