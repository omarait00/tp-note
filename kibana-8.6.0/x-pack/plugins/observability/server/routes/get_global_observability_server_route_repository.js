"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGlobalObservabilityServerRouteRepository = getGlobalObservabilityServerRouteRepository;
var _route = require("./rules/route");
var _route2 = require("./slo/route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getGlobalObservabilityServerRouteRepository(config) {
  const isSloFeatureEnabled = config.unsafe.slo.enabled;
  const repository = {
    ..._route.rulesRouteRepository,
    ...(isSloFeatureEnabled ? _route2.slosRouteRepository : {})
  };
  return repository;
}