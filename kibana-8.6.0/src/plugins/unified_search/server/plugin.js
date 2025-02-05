"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UnifiedSearchServerPlugin = exports.Plugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _autocomplete = require("./autocomplete");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

class UnifiedSearchServerPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "autocompleteService", void 0);
    this.autocompleteService = new _autocomplete.AutocompleteService(initializerContext);
  }
  setup(core, {}) {
    return {
      autocomplete: this.autocompleteService.setup(core)
    };
  }
  start(core, {}) {
    return {};
  }
  stop() {}
}
exports.Plugin = exports.UnifiedSearchServerPlugin = UnifiedSearchServerPlugin;