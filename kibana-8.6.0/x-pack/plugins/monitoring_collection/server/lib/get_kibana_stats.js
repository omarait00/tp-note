"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKibanaStats = getKibanaStats;
var _i18n = require("@kbn/i18n");
var _server = require("../../../../../src/core/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const SNAPSHOT_REGEX = /-snapshot/i;
const ServiceStatusToLegacyState = {
  [_server.ServiceStatusLevels.critical.toString()]: 'red',
  [_server.ServiceStatusLevels.unavailable.toString()]: 'red',
  [_server.ServiceStatusLevels.degraded.toString()]: 'yellow',
  [_server.ServiceStatusLevels.available.toString()]: 'green'
};
function getKibanaStats({
  config,
  getStatus
}) {
  const status = getStatus();
  return {
    uuid: config.uuid,
    name: config.server.name,
    index: config.kibanaIndex,
    host: config.server.hostname,
    locale: _i18n.i18n.getLocale(),
    transport_address: `${config.server.hostname}:${config.server.port}`,
    version: config.kibanaVersion.replace(SNAPSHOT_REGEX, ''),
    snapshot: SNAPSHOT_REGEX.test(config.kibanaVersion),
    status: status ? ServiceStatusToLegacyState[status.level.toString()] : 'unknown' // If not status, not available yet
  };
}