"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSearchStatus = getSearchStatus;
var _i18n = require("@kbn/i18n");
var _types = require("./types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

async function getSearchStatus(internalClient, asyncId) {
  // TODO: Handle strategies other than the default one
  // https://github.com/elastic/kibana/issues/127880
  try {
    // @ts-expect-error start_time_in_millis: EpochMillis is string | number
    const apiResponse = await internalClient.asyncSearch.status({
      id: asyncId
    }, {
      meta: true
    });
    const response = apiResponse.body;
    if (response.is_partial && !response.is_running || response.completion_status >= 400) {
      return {
        status: _types.SearchStatus.ERROR,
        error: _i18n.i18n.translate('data.search.statusError', {
          defaultMessage: `Search {searchId} completed with a {errorCode} status`,
          values: {
            searchId: asyncId,
            errorCode: response.completion_status
          }
        })
      };
    } else if (!response.is_partial && !response.is_running) {
      return {
        status: _types.SearchStatus.COMPLETE,
        error: undefined
      };
    } else {
      return {
        status: _types.SearchStatus.IN_PROGRESS,
        error: undefined
      };
    }
  } catch (e) {
    return {
      status: _types.SearchStatus.ERROR,
      error: _i18n.i18n.translate('data.search.statusThrow', {
        defaultMessage: `Search status for search with id {searchId} threw an error {message} (statusCode: {errorCode})`,
        values: {
          message: e.message,
          errorCode: e.statusCode || 500,
          searchId: asyncId
        }
      })
    };
  }
}