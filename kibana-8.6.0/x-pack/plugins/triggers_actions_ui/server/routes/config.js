"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createConfigRoute = createConfigRoute;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createConfigRoute(logger, router, baseRoute,
// config is a function because "isUsingSecurity" is pulled from the license
// state which gets populated after plugin setup().
config) {
  const path = `${baseRoute}/_config`;
  logger.debug(`registering triggers_actions_ui config route GET ${path}`);
  router.get({
    path,
    validate: false
  }, handler);
  async function handler(ctx, req, res) {
    return res.ok({
      body: config()
    });
  }
}