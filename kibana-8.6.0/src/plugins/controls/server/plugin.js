"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ControlsPlugin = void 0;
var _options_list_suggestions_route = require("./options_list/options_list_suggestions_route");
var _control_group_container_factory = require("./control_group/control_group_container_factory");
var _options_list_embeddable_factory = require("./options_list/options_list_embeddable_factory");
var _range_slider_embeddable_factory = require("./range_slider/range_slider_embeddable_factory");
var _time_slider_embeddable_factory = require("./time_slider/time_slider_embeddable_factory");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

class ControlsPlugin {
  setup(core, {
    embeddable,
    unifiedSearch
  }) {
    embeddable.registerEmbeddableFactory((0, _control_group_container_factory.controlGroupContainerPersistableStateServiceFactory)(embeddable));
    embeddable.registerEmbeddableFactory((0, _options_list_embeddable_factory.optionsListPersistableStateServiceFactory)());
    embeddable.registerEmbeddableFactory((0, _range_slider_embeddable_factory.rangeSliderPersistableStateServiceFactory)());
    embeddable.registerEmbeddableFactory((0, _time_slider_embeddable_factory.timeSliderPersistableStateServiceFactory)());
    (0, _options_list_suggestions_route.setupOptionsListSuggestionsRoute)(core, unifiedSearch.autocomplete.getAutocompleteSettings);
    return {};
  }
  start() {
    return {};
  }
  stop() {}
}
exports.ControlsPlugin = ControlsPlugin;