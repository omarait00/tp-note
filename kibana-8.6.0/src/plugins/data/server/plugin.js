"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Plugin = exports.DataServerPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _datatable_utilities = require("./datatable_utilities");
var _search_service = require("./search/search_service");
var _query_service = require("./query/query_service");
var _scripts = require("./scripts");
var _kql_telemetry = require("./kql_telemetry");
var _ui_settings = require("./ui_settings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

class DataServerPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "searchService", void 0);
    (0, _defineProperty2.default)(this, "scriptsService", void 0);
    (0, _defineProperty2.default)(this, "kqlTelemetryService", void 0);
    (0, _defineProperty2.default)(this, "queryService", new _query_service.QueryService());
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.logger = initializerContext.logger.get('data');
    this.searchService = new _search_service.SearchService(initializerContext, this.logger);
    this.scriptsService = new _scripts.ScriptsService();
    this.kqlTelemetryService = new _kql_telemetry.KqlTelemetryService(initializerContext);
  }
  setup(core, {
    bfetch,
    expressions,
    usageCollection,
    fieldFormats,
    taskManager,
    security
  }) {
    this.scriptsService.setup(core);
    const querySetup = this.queryService.setup(core);
    this.kqlTelemetryService.setup(core, {
      usageCollection
    });
    core.uiSettings.register((0, _ui_settings.getUiSettings)(core.docLinks));
    const searchSetup = this.searchService.setup(core, {
      bfetch,
      expressions,
      usageCollection,
      security,
      taskManager
    });
    return {
      search: searchSetup,
      query: querySetup,
      fieldFormats
    };
  }
  start(core, {
    fieldFormats,
    dataViews,
    taskManager
  }) {
    const search = this.searchService.start(core, {
      fieldFormats,
      indexPatterns: dataViews,
      taskManager
    });
    const datatableUtilities = new _datatable_utilities.DatatableUtilitiesService(search.aggs, dataViews, fieldFormats, core.uiSettings);
    return {
      datatableUtilities,
      search,
      fieldFormats,
      indexPatterns: dataViews
    };
  }
  stop() {
    this.searchService.stop();
  }
}
exports.Plugin = exports.DataServerPlugin = DataServerPlugin;