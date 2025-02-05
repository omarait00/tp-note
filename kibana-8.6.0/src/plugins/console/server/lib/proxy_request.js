"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.proxyRequest = void 0;
var _http = _interopRequireDefault(require("http"));
var _https = _interopRequireDefault(require("https"));
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

// We use a modified version of Hapi's Wreck because Hapi, Axios, and Superagent don't support GET requests
// with bodies, but ES APIs do. Similarly with DELETE requests with bodies. Another library, `request`
// diverged too much from current behaviour.
const proxyRequest = ({
  method,
  headers,
  agent,
  uri,
  timeout,
  payload,
  rejectUnauthorized
}) => {
  const {
    hostname,
    port,
    protocol,
    search,
    pathname
  } = uri;
  const client = uri.protocol === 'https:' ? _https.default : _http.default;
  let resolved = false;
  let resolve;
  let reject;
  const reqPromise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  const finalUserHeaders = {
    ...headers
  };
  const hasHostHeader = Object.keys(finalUserHeaders).some(key => key.toLowerCase() === 'host');
  if (!hasHostHeader) {
    finalUserHeaders.host = hostname;
  }
  const req = client.request({
    method: method.toUpperCase(),
    // We support overriding this on a per request basis to support legacy proxy config. See ./proxy_config.
    rejectUnauthorized: typeof rejectUnauthorized === 'boolean' ? rejectUnauthorized : undefined,
    host: (0, _utils.sanitizeHostname)(hostname),
    port: port === '' ? undefined : parseInt(port, 10),
    protocol,
    path: `${pathname}${search || ''}`,
    headers: {
      ...finalUserHeaders,
      'content-type': 'application/json',
      'transfer-encoding': 'chunked'
    },
    agent
  });
  req.once('response', res => {
    resolved = true;
    resolve(res);
  });
  req.once('socket', socket => {
    if (!socket.connecting) {
      payload.pipe(req);
    } else {
      socket.once('connect', () => {
        payload.pipe(req);
      });
    }
  });
  const onError = e => reject(e);
  req.once('error', onError);
  const timeoutPromise = new Promise((timeoutResolve, timeoutReject) => {
    setTimeout(() => {
      // Destroy the stream on timeout and close the connection.
      if (!req.destroyed) {
        req.destroy();
      }
      if (!resolved) {
        timeoutReject(_boom.default.gatewayTimeout('Client request timeout'));
      } else {
        timeoutResolve(undefined);
      }
    }, timeout);
  });
  return Promise.race([reqPromise, timeoutPromise]);
};
exports.proxyRequest = proxyRequest;