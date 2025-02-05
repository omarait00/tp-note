"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFakeKibanaRequest = getFakeKibanaRequest;
var _server = require("../../../../../../src/core/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getFakeKibanaRequest(apiKey) {
  const requestHeaders = {};
  requestHeaders.authorization = `ApiKey ${Buffer.from(`${apiKey.id}:${apiKey.api_key}`).toString('base64')}`;
  return _server.CoreKibanaRequest.from({
    headers: requestHeaders,
    path: '/',
    route: {
      settings: {}
    },
    url: {
      href: '/'
    },
    raw: {
      req: {
        url: '/'
      }
    }
  });
}