"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCommonDefaultAsyncGetParams = getCommonDefaultAsyncGetParams;
exports.getCommonDefaultAsyncSubmitParams = getCommonDefaultAsyncSubmitParams;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 @internal
 */
function getCommonDefaultAsyncSubmitParams(config, options,
/**
 * Allows to override some of internal logic (e.g. eql / sql searches don't fully support search sessions yet)
 */
overrides) {
  const useSearchSessions = config.sessions.enabled && !!options.sessionId && !(overrides !== null && overrides !== void 0 && overrides.disableSearchSessions);
  const keepAlive = useSearchSessions && options.isStored ? `${config.sessions.defaultExpiration.asMilliseconds()}ms` : `${config.asyncSearch.keepAlive.asMilliseconds()}ms`;
  return {
    // Wait up to the timeout for the response to return
    wait_for_completion_timeout: `${config.asyncSearch.waitForCompletion.asMilliseconds()}ms`,
    // If search sessions are used, store and get an async ID even for short running requests.
    keep_on_completion: useSearchSessions,
    // The initial keepalive is as defined in defaultExpiration if search sessions are used or 1m otherwise.
    keep_alive: keepAlive
  };
}

/**
 @internal
 */
function getCommonDefaultAsyncGetParams(config, options,
/**
 * Allows to override some of internal logic (e.g. eql / sql searches don't fully support search sessions yet)
 */
overrides) {
  const useSearchSessions = config.sessions.enabled && !!options.sessionId && !(overrides !== null && overrides !== void 0 && overrides.disableSearchSessions);
  return {
    // Wait up to the timeout for the response to return
    wait_for_completion_timeout: `${config.asyncSearch.waitForCompletion.asMilliseconds()}ms`,
    ...(useSearchSessions && options.isStored ?
    // Use session's keep_alive if search belongs to a stored session
    options.isSearchStored || options.isRestore // if search was already stored and extended, then no need to extend keepAlive
    ? {} : {
      keep_alive: `${config.sessions.defaultExpiration.asMilliseconds()}ms`
    } : {
      // We still need to do polling for searches not within the context of a search session or when search session disabled
      keep_alive: `${config.asyncSearch.keepAlive.asMilliseconds()}ms`
    })
  };
}