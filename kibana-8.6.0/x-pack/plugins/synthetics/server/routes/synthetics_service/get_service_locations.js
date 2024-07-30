"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceLocationsRoute = void 0;
var _get_all_locations = require("../../synthetics_service/get_all_locations");
var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getServiceLocationsRoute = () => ({
  method: 'GET',
  path: _constants.API_URLS.SERVICE_LOCATIONS,
  validate: {},
  handler: async ({
    server,
    savedObjectsClient,
    syntheticsMonitorClient
  }) => {
    const {
      publicLocations,
      privateLocations,
      throttling
    } = await (0, _get_all_locations.getAllLocations)(server, syntheticsMonitorClient, savedObjectsClient);
    return {
      locations: [...publicLocations, ...privateLocations],
      throttling
    };
  }
});
exports.getServiceLocationsRoute = getServiceLocationsRoute;