"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LensServerPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _common = require("../../../../src/plugins/data_views/common");
var _saved_objects = require("./saved_objects");
var _expressions = require("./expressions");
var _make_lens_embeddable_factory = require("./embeddable/make_lens_embeddable_factory");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class LensServerPlugin {
  constructor() {
    (0, _defineProperty2.default)(this, "customVisualizationMigrations", {});
  }
  setup(core, plugins) {
    const getFilterMigrations = plugins.data.query.filterManager.getAllMigrations.bind(plugins.data.query.filterManager);
    (0, _saved_objects.setupSavedObjects)(core, getFilterMigrations, this.customVisualizationMigrations);
    (0, _expressions.setupExpressions)(core, plugins.expressions);
    const lensEmbeddableFactory = (0, _make_lens_embeddable_factory.makeLensEmbeddableFactory)(getFilterMigrations, _common.DataViewPersistableStateService.getAllMigrations.bind(_common.DataViewPersistableStateService), this.customVisualizationMigrations);
    plugins.embeddable.registerEmbeddableFactory(lensEmbeddableFactory());
    return {
      lensEmbeddableFactory,
      registerVisualizationMigration: (id, migrationsGetter) => {
        if (this.customVisualizationMigrations[id]) {
          throw new Error(`Migrations object for visualization ${id} registered already`);
        }
        this.customVisualizationMigrations[id] = migrationsGetter;
      }
    };
  }
  start(core, plugins) {
    return {};
  }
  stop() {}
}
exports.LensServerPlugin = LensServerPlugin;