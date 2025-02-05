"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerResolverRoutes = void 0;
var _resolver = require("../../../common/endpoint/schema/resolver");
var _handler = require("./resolver/tree/handler");
var _handler2 = require("./resolver/entity/handler");
var _events = require("./resolver/events");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const registerResolverRoutes = async (router, startServices, config) => {
  const [, {
    ruleRegistry,
    licensing
  }] = await startServices();
  router.post({
    path: '/api/endpoint/resolver/tree',
    validate: _resolver.validateTree,
    options: {
      authRequired: true
    }
  }, (0, _handler.handleTree)(ruleRegistry, config, licensing));
  router.post({
    path: '/api/endpoint/resolver/events',
    validate: _resolver.validateEvents,
    options: {
      authRequired: true
    }
  }, (0, _events.handleEvents)(ruleRegistry));

  /**
   * Used to get details about an entity, aka process.
   */
  router.get({
    path: '/api/endpoint/resolver/entity',
    validate: _resolver.validateEntities,
    options: {
      authRequired: true
    }
  }, (0, _handler2.handleEntities)());
};
exports.registerResolverRoutes = registerResolverRoutes;