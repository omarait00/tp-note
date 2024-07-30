"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHasZipUrlMonitorRoute = void 0;
var _constants = require("../../../common/constants");
var _runtime_types = require("../../../common/runtime_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getHasZipUrlMonitorRoute = () => ({
  method: 'GET',
  path: _constants.API_URLS.SYNTHETICS_HAS_ZIP_URL_MONITORS,
  validate: {},
  handler: async ({
    savedObjectsClient,
    server
  }) => {
    const monitors = await server.fleet.packagePolicyService.list(savedObjectsClient, {
      kuery: 'ingest-package-policies.package.name:synthetics'
    });
    const hasZipUrlMonitors = monitors.items.some(item => {
      var _streams$find, _streams$find$compile;
      const browserInput = item.inputs.find(input => input.type === 'synthetics/browser');
      const streams = (browserInput === null || browserInput === void 0 ? void 0 : browserInput.streams) || [];
      return (_streams$find = streams.find(stream => stream.data_stream.dataset === 'browser')) === null || _streams$find === void 0 ? void 0 : (_streams$find$compile = _streams$find.compiled_stream) === null || _streams$find$compile === void 0 ? void 0 : _streams$find$compile[_runtime_types.ConfigKey.SOURCE_ZIP_URL];
    });
    return {
      hasZipUrlMonitors,
      monitors: []
    };
  }
});
exports.getHasZipUrlMonitorRoute = getHasZipUrlMonitorRoute;