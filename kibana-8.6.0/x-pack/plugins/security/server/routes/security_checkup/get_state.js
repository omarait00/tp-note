"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineSecurityCheckupGetStateRoutes = defineSecurityCheckupGetStateRoutes;
var _rxjs = require("rxjs");
var _security_checkup = require("../../security_checkup");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Defines route that returns the state of the security checkup feature.
 */
function defineSecurityCheckupGetStateRoutes({
  router,
  logger,
  config$,
  license
}) {
  let showInsecureClusterWarning = false;
  (0, _rxjs.combineLatest)([config$, license.features$]).subscribe(([config, {
    allowRbac
  }]) => {
    showInsecureClusterWarning = config.showInsecureClusterWarning && !allowRbac;
  });
  const doesClusterHaveUserData = (0, _security_checkup.createClusterDataCheck)();
  router.get({
    path: '/internal/security/security_checkup/state',
    validate: false
  }, async (context, _request, response) => {
    const esClient = (await context.core).elasticsearch.client;
    let displayAlert = false;
    if (showInsecureClusterWarning) {
      displayAlert = await doesClusterHaveUserData(esClient.asInternalUser, logger);
    }
    const state = {
      displayAlert
    };
    return response.ok({
      body: state
    });
  });
}