"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLivesNodes = getLivesNodes;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getLivesNodes(req) {
  const params = {
    path: '/_nodes',
    method: 'GET'
  };
  const {
    callWithRequest
  } = req.server.plugins.elasticsearch.getCluster('data');
  const {
    nodes
  } = await callWithRequest(req, 'transport.request', params);
  return Object.keys(nodes).map(nodeId => ({
    ...nodes[nodeId],
    id: nodeId,
    resolver: nodeId // Maintain parity for UI
  }));
}