"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postXmatters = postXmatters;
var _axios = _interopRequireDefault(require("axios"));
var _axios_utils = require("../../../../../actions/server/lib/axios_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// trigger a flow in xmatters
async function postXmatters(options, logger, configurationUtilities) {
  const {
    url,
    data,
    basicAuth
  } = options;
  const axiosInstance = _axios.default.create();
  return await (0, _axios_utils.request)({
    axios: axiosInstance,
    method: 'post',
    url,
    logger,
    ...basicAuth,
    data,
    configurationUtilities,
    validateStatus: () => true
  });
}