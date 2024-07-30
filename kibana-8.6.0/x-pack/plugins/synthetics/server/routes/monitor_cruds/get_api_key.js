"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAPIKeySyntheticsRoute = void 0;
var _get_api_key = require("../../synthetics_service/get_api_key");
var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getAPIKeySyntheticsRoute = libs => ({
  method: 'GET',
  path: _constants.API_URLS.SYNTHETICS_APIKEY,
  validate: {},
  handler: async ({
    request,
    server
  }) => {
    const apiKey = await (0, _get_api_key.generateAPIKey)({
      request,
      server,
      uptimePrivileges: true
    });
    return {
      apiKey
    };
  }
});
exports.getAPIKeySyntheticsRoute = getAPIKeySyntheticsRoute;