"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkHasPrivileges = void 0;
var _fake_kibana_request = require("../utils/fake_kibana_request");
var _get_api_key = require("../get_api_key");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const checkHasPrivileges = async (server, apiKey) => {
  return await server.coreStart.elasticsearch.client.asScoped((0, _fake_kibana_request.getFakeKibanaRequest)({
    id: apiKey.id,
    api_key: apiKey.apiKey
  })).asCurrentUser.security.hasPrivileges({
    body: {
      index: _get_api_key.serviceApiKeyPrivileges.indices,
      cluster: _get_api_key.serviceApiKeyPrivileges.cluster
    }
  });
};
exports.checkHasPrivileges = checkHasPrivileges;