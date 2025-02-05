"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRuleExceptionsRoutes = void 0;
var _route = require("./create_rule_exceptions/route");
var _route2 = require("./find_exception_references/route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const registerRuleExceptionsRoutes = router => {
  (0, _route.createRuleExceptionsRoute)(router);
  (0, _route2.findRuleExceptionReferencesRoute)(router);
};
exports.registerRuleExceptionsRoutes = registerRuleExceptionsRoutes;