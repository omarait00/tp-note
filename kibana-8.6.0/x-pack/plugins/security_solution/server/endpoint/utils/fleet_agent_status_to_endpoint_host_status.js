"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fleetAgentStatusToEndpointHostStatus = exports.DEFAULT_ENDPOINT_HOST_STATUS = void 0;
var _types = require("../../../common/endpoint/types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// For an understanding of how fleet agent status is calculated:
// @see `x-pack/plugins/fleet/common/services/agent_status.ts`
const STATUS_MAPPING = new Map([['online', _types.HostStatus.HEALTHY], ['offline', _types.HostStatus.OFFLINE], ['inactive', _types.HostStatus.INACTIVE], ['unenrolling', _types.HostStatus.UPDATING], ['enrolling', _types.HostStatus.UPDATING], ['updating', _types.HostStatus.UPDATING], ['warning', _types.HostStatus.UNHEALTHY], ['error', _types.HostStatus.UNHEALTHY], ['degraded', _types.HostStatus.UNHEALTHY]]);
const DEFAULT_ENDPOINT_HOST_STATUS = _types.HostStatus.UNHEALTHY;

/**
 * A Map of Fleet Agent Status to Endpoint Host Status.
 * Default status is `HostStatus.UNHEALTHY`
 */
exports.DEFAULT_ENDPOINT_HOST_STATUS = DEFAULT_ENDPOINT_HOST_STATUS;
const fleetAgentStatusToEndpointHostStatus = status => {
  return STATUS_MAPPING.get(status) || DEFAULT_ENDPOINT_HOST_STATUS;
};
exports.fleetAgentStatusToEndpointHostStatus = fleetAgentStatusToEndpointHostStatus;