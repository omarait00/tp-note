"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AutocompleteService = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _moment = _interopRequireDefault(require("moment"));
var _routes = require("./routes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

class AutocompleteService {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "valueSuggestionsEnabled", true);
    (0, _defineProperty2.default)(this, "autocompleteSettings", void 0);
    this.initializerContext = initializerContext;
    initializerContext.config.create().subscribe(configUpdate => {
      this.valueSuggestionsEnabled = configUpdate.autocomplete.valueSuggestions.enabled;
      this.autocompleteSettings = configUpdate.autocomplete.valueSuggestions;
    });
    this.autocompleteSettings = this.initializerContext.config.get().autocomplete.valueSuggestions;
  }
  setup(core) {
    if (this.valueSuggestionsEnabled) (0, _routes.registerRoutes)(core, this.initializerContext.config.create());
    const {
      terminateAfter,
      timeout
    } = this.autocompleteSettings;
    return {
      getAutocompleteSettings: () => ({
        terminateAfter: _moment.default.duration(terminateAfter).asMilliseconds(),
        timeout: _moment.default.duration(timeout).asMilliseconds()
      })
    };
  }
  start() {}
}

/** @public **/
exports.AutocompleteService = AutocompleteService;