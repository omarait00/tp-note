"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UI_SETTINGS = void 0;
Object.defineProperty(exports, "convertPanelMapToSavedPanels", {
  enumerable: true,
  get: function () {
    return _dashboard_panel_converters.convertPanelMapToSavedPanels;
  }
});
Object.defineProperty(exports, "convertPanelStateToSavedDashboardPanel", {
  enumerable: true,
  get: function () {
    return _dashboard_panel_converters.convertPanelStateToSavedDashboardPanel;
  }
});
Object.defineProperty(exports, "convertSavedDashboardPanelToPanelState", {
  enumerable: true,
  get: function () {
    return _dashboard_panel_converters.convertSavedDashboardPanelToPanelState;
  }
});
Object.defineProperty(exports, "convertSavedPanelsToPanelMap", {
  enumerable: true,
  get: function () {
    return _dashboard_panel_converters.convertSavedPanelsToPanelMap;
  }
});
Object.defineProperty(exports, "createExtract", {
  enumerable: true,
  get: function () {
    return _dashboard_container_references.createExtract;
  }
});
Object.defineProperty(exports, "createInject", {
  enumerable: true,
  get: function () {
    return _dashboard_container_references.createInject;
  }
});
Object.defineProperty(exports, "extractReferences", {
  enumerable: true,
  get: function () {
    return _dashboard_saved_object_references.extractReferences;
  }
});
Object.defineProperty(exports, "injectReferences", {
  enumerable: true,
  get: function () {
    return _dashboard_saved_object_references.injectReferences;
  }
});
var _dashboard_saved_object_references = require("./persistable_state/dashboard_saved_object_references");
var _dashboard_container_references = require("./persistable_state/dashboard_container_references");
var _dashboard_panel_converters = require("./lib/dashboard_panel_converters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const UI_SETTINGS = {
  ENABLE_LABS_UI: 'labs:dashboard:enable_ui'
};
exports.UI_SETTINGS = UI_SETTINGS;