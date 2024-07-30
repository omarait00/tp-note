"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedSearchServerPlugin = void 0;
var _saved_objects = require("./saved_objects");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

class SavedSearchServerPlugin {
  setup(core, plugins) {
    const getSearchSourceMigrations = plugins.data.search.searchSource.getAllMigrations.bind(plugins.data.search.searchSource);
    core.savedObjects.registerType((0, _saved_objects.getSavedSearchObjectType)(getSearchSourceMigrations));
    return {};
  }
  start(core) {
    return {};
  }
  stop() {}
}
exports.SavedSearchServerPlugin = SavedSearchServerPlugin;