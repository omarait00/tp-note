"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllLocations = getAllLocations;
var _get_private_locations = require("./get_private_locations");
var _get_service_locations = require("./get_service_locations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getAllLocations(server, syntheticsMonitorClient, savedObjectsClient) {
  try {
    const [privateLocations, {
      locations: publicLocations,
      throttling
    }] = await Promise.all([(0, _get_private_locations.getPrivateLocations)(syntheticsMonitorClient, savedObjectsClient), getServicePublicLocations(server, syntheticsMonitorClient)]);
    return {
      publicLocations,
      privateLocations,
      throttling
    };
  } catch (e) {
    server.logger.error(e);
    return {
      publicLocations: [],
      privateLocations: []
    };
  }
}
const getServicePublicLocations = async (server, syntheticsMonitorClient) => {
  if (syntheticsMonitorClient.syntheticsService.locations.length === 0) {
    return await (0, _get_service_locations.getServiceLocations)(server);
  }
  return {
    locations: syntheticsMonitorClient.syntheticsService.locations,
    throttling: syntheticsMonitorClient.syntheticsService.throttling
  };
};