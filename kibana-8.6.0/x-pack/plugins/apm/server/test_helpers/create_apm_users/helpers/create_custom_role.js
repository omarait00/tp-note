"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCustomRole = createCustomRole;
exports.getEsClient = getEsClient;
var _elasticsearch = require("@elastic/elasticsearch");
var _lodash = require("lodash");
var _call_kibana = require("./call_kibana");
var _authentication = require("../authentication");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function createCustomRole({
  elasticsearch,
  kibana,
  roleName
}) {
  const role = _authentication.customRoles[roleName];

  // Add application privileges with es client as they are not supported by
  // the security API. They are preserved when updating the role below
  if ('applications' in role) {
    const esClient = getEsClient(elasticsearch);
    await esClient.security.putRole({
      name: roleName,
      body: role
    });
  }
  await (0, _call_kibana.callKibana)({
    elasticsearch,
    kibana,
    options: {
      method: 'PUT',
      url: `/api/security/role/${roleName}`,
      data: {
        ...(0, _lodash.omit)(role, 'applications')
      }
    }
  });
}
function getEsClient(elasticsearch) {
  const {
    node,
    username,
    password
  } = elasticsearch;
  const client = new _elasticsearch.Client({
    node,
    tls: {
      rejectUnauthorized: false
    },
    requestTimeout: 120000,
    auth: {
      username,
      password
    }
  });
  return client;
}