"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTelemetryClient = getTelemetryClient;
var _server = require("../../../../observability/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getTelemetryClient({
  core
}) {
  const [{
    elasticsearch
  }] = await core.getStartServices();
  const esClient = elasticsearch.client;
  return {
    search: params => (0, _server.unwrapEsResponse)(esClient.asInternalUser.search(params, {
      meta: true
    })),
    indicesStats: params => (0, _server.unwrapEsResponse)(esClient.asInternalUser.indices.stats(params, {
      meta: true
    })),
    transportRequest: params => (0, _server.unwrapEsResponse)(esClient.asInternalUser.transport.request(params, {
      meta: true
    }))
  };
}