"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRuleManagementRoutes = void 0;
var _route = require("./rules/bulk_actions/route");
var _route2 = require("./rules/bulk_create_rules/route");
var _route3 = require("./rules/bulk_delete_rules/route");
var _route4 = require("./rules/bulk_patch_rules/route");
var _route5 = require("./rules/bulk_update_rules/route");
var _route6 = require("./rules/create_rule/route");
var _route7 = require("./rules/delete_rule/route");
var _route8 = require("./rules/export_rules/route");
var _route9 = require("./rules/find_rules/route");
var _route10 = require("./rules/import_rules/route");
var _route11 = require("./rules/patch_rule/route");
var _route12 = require("./rules/read_rule/route");
var _route13 = require("./rules/update_rule/route");
var _route14 = require("./tags/read_tags/route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const registerRuleManagementRoutes = (router, config, ml, logger) => {
  // Rules CRUD
  (0, _route6.createRuleRoute)(router, ml);
  (0, _route12.readRuleRoute)(router, logger);
  (0, _route13.updateRuleRoute)(router, ml);
  (0, _route11.patchRuleRoute)(router, ml);
  (0, _route7.deleteRuleRoute)(router);

  // Rules bulk CRUD
  (0, _route2.bulkCreateRulesRoute)(router, ml, logger);
  (0, _route5.bulkUpdateRulesRoute)(router, ml, logger);
  (0, _route4.bulkPatchRulesRoute)(router, ml, logger);
  (0, _route3.bulkDeleteRulesRoute)(router, logger);

  // Rules bulk actions
  (0, _route.performBulkActionRoute)(router, ml, logger);

  // Rules export/import
  (0, _route8.exportRulesRoute)(router, config, logger);
  (0, _route10.importRulesRoute)(router, config, ml);

  // Rules search
  (0, _route9.findRulesRoute)(router, logger);

  // Rule tags
  (0, _route14.readTagsRoute)(router);
};
exports.registerRuleManagementRoutes = registerRuleManagementRoutes;