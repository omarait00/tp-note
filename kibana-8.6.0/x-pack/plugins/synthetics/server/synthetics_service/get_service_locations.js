"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDevLocation = void 0;
exports.getServiceLocations = getServiceLocations;
var _axios = _interopRequireDefault(require("axios"));
var _lodash = require("lodash");
var _runtime_types = require("../../common/runtime_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getDevLocation = devUrl => ({
  id: 'localhost',
  label: 'Local Synthetics Service',
  geo: {
    lat: 0,
    lon: 0
  },
  url: devUrl,
  isServiceManaged: true,
  status: _runtime_types.LocationStatus.EXPERIMENTAL,
  isInvalid: false
});
exports.getDevLocation = getDevLocation;
async function getServiceLocations(server) {
  var _server$config$servic, _server$config$servic2;
  let locations = [];
  if ((_server$config$servic = server.config.service) !== null && _server$config$servic !== void 0 && _server$config$servic.devUrl) {
    locations = [getDevLocation(server.config.service.devUrl)];
  }
  if (!((_server$config$servic2 = server.config.service) !== null && _server$config$servic2 !== void 0 && _server$config$servic2.manifestUrl)) {
    return {
      locations
    };
  }
  try {
    var _server$config$servic3;
    const {
      data
    } = await _axios.default.get(server.config.service.manifestUrl);
    const availableLocations = server.isDev || (_server$config$servic3 = server.config.service) !== null && _server$config$servic3 !== void 0 && _server$config$servic3.showExperimentalLocations ? Object.entries(data.locations) : Object.entries(data.locations).filter(([_, location]) => {
      return location.status === _runtime_types.LocationStatus.GA;
    });
    availableLocations.forEach(([locationId, location]) => {
      locations.push({
        id: locationId,
        label: location.geo.name,
        geo: location.geo.location,
        url: location.url,
        isServiceManaged: true,
        status: location.status,
        isInvalid: false
      });
    });
    const throttling = (0, _lodash.pick)(data.throttling, _runtime_types.BandwidthLimitKey.DOWNLOAD, _runtime_types.BandwidthLimitKey.UPLOAD);
    return {
      throttling,
      locations
    };
  } catch (e) {
    server.logger.error(e);
    return {
      locations: []
    };
  }
}