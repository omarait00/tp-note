"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDashboardSavedObjectTypeMigrations = void 0;
var _lodash = require("lodash");
var _common = require("../../../../kibana_utils/common");
var _migrate_to_ = require("./migrate_to_730");
var _migrate_match_all_query = require("./migrate_match_all_query");
var _migrate_hidden_titles = require("./migrate_hidden_titles");
var _migrate_index_pattern_reference = require("./migrate_index_pattern_reference");
var _migrate_by_value_dashboard_panels = require("./migrate_by_value_dashboard_panels");
var _migrate_extract_panel_references = require("./migrate_extract_panel_references");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const createDashboardSavedObjectTypeMigrations = deps => {
  const embeddableMigrations = (0, _lodash.mapValues)(deps.embeddable.getAllMigrations(), _migrate_by_value_dashboard_panels.migrateByValueDashboardPanels);
  const dashboardMigrations = {
    '6.7.2': (0, _lodash.flow)(_migrate_match_all_query.migrateMatchAllQuery),
    '7.0.0': (0, _lodash.flow)(_migrate_to_.migrations700),
    '7.3.0': (0, _lodash.flow)(_migrate_to_.migrations730),
    '7.9.3': (0, _lodash.flow)(_migrate_match_all_query.migrateMatchAllQuery),
    '7.11.0': (0, _lodash.flow)((0, _migrate_extract_panel_references.createExtractPanelReferencesMigration)(deps)),
    '7.14.0': (0, _lodash.flow)(_migrate_index_pattern_reference.replaceIndexPatternReference),
    '7.17.3': (0, _lodash.flow)(_migrate_hidden_titles.migrateExplicitlyHiddenTitles)
  };
  return (0, _common.mergeMigrationFunctionMaps)(dashboardMigrations, embeddableMigrations);
};
exports.createDashboardSavedObjectTypeMigrations = createDashboardSavedObjectTypeMigrations;