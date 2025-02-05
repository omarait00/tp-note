"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = void 0;
var _aggregate = require("./aggregate");
var _count = require("./count");
var _multi_terms_aggregate = require("./multi_terms_aggregate");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const registerRoutes = (router, ruleRegistry) => {
  (0, _aggregate.registerAggregateRoute)(router);
  (0, _count.registerCountRoute)(router);
  (0, _multi_terms_aggregate.registerMultiTermsAggregateRoute)(router);
};
exports.registerRoutes = registerRoutes;