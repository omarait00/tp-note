"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableFleetServerIfNecessary = void 0;
var _common = require("../../../../fleet/common");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Will ensure that at least one fleet server is present in the `.fleet-servers` index. This will
 * enable the `Agent` section of kibana Fleet to be displayed
 *
 * @param esClient
 * @param version
 */
const enableFleetServerIfNecessary = async (esClient, version = '8.0.0') => {
  const res = await esClient.search({
    index: _common.FLEET_SERVER_SERVERS_INDEX,
    ignore_unavailable: true,
    rest_total_hits_as_int: true
  });
  if (res.hits.total) {
    return;
  }

  // Create a Fake fleet-server in this kibana instance
  await esClient.index({
    index: _common.FLEET_SERVER_SERVERS_INDEX,
    refresh: 'wait_for',
    body: {
      agent: {
        id: '12988155-475c-430d-ac89-84dc84b67cd1',
        version
      },
      host: {
        architecture: 'linux',
        id: 'c3e5f4f690b4a3ff23e54900701a9513',
        ip: ['127.0.0.1', '::1', '10.201.0.213', 'fe80::4001:aff:fec9:d5'],
        name: 'endpoint-data-generator'
      },
      server: {
        id: '12988155-475c-430d-ac89-84dc84b67cd1',
        version
      },
      '@timestamp': '2021-05-12T18:42:52.009482058Z'
    }
  }).catch(_utils.wrapErrorAndRejectPromise);
};
exports.enableFleetServerIfNecessary = enableFleetServerIfNecessary;