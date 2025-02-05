"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupEmbeddable = setupEmbeddable;
var _common = require("../../../../../src/plugins/kibana_utils/common");
var _constants = require("../../common/constants");
var _embeddable = require("../../common/embeddable");
var _embeddable_migrations = require("./embeddable_migrations");
var _saved_objects = require("../saved_objects");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function setupEmbeddable(embeddable, getFilterMigrations, getDataViewMigrations) {
  embeddable.registerEmbeddableFactory({
    id: _constants.MAP_SAVED_OBJECT_TYPE,
    migrations: () => {
      return (0, _common.mergeMigrationFunctionMaps)((0, _common.mergeMigrationFunctionMaps)(_embeddable_migrations.embeddableMigrations, (0, _saved_objects.getMapsFilterMigrations)(getFilterMigrations())), (0, _saved_objects.getMapsDataViewMigrations)(getDataViewMigrations()));
    },
    inject: _embeddable.inject,
    extract: _embeddable.extract
  });
}