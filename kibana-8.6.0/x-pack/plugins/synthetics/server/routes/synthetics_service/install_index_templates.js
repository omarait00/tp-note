"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installIndexTemplatesRoute = void 0;
exports.installSyntheticsIndexTemplates = installSyntheticsIndexTemplates;
var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const installIndexTemplatesRoute = () => ({
  method: 'GET',
  path: _constants.API_URLS.INDEX_TEMPLATES,
  validate: {},
  handler: async ({
    server
  }) => {
    return installSyntheticsIndexTemplates(server);
  }
});
exports.installIndexTemplatesRoute = installIndexTemplatesRoute;
async function installSyntheticsIndexTemplates(server) {
  // no need to add error handling here since fleetSetupCompleted is already wrapped in try/catch and will log
  // warning if setup fails to complete
  await server.fleet.fleetSetupCompleted();
  const installation = await server.fleet.packageService.asInternalUser.ensureInstalledPackage({
    pkgName: 'synthetics'
  });
  if (!installation) {
    return Promise.reject('No package installation found.');
  }
  return installation;
}