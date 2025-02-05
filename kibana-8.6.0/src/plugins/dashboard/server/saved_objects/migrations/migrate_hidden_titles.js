"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrateExplicitlyHiddenTitles = void 0;
var _common = require("../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Before 7.10, hidden panel titles were stored as a blank string on the title attribute. In 7.10, this was replaced
 * with a usage of the existing hidePanelTitles key. Even though blank string titles still technically work
 * in versions > 7.10, they are less explicit than using the hidePanelTitles key. This migration transforms all
 * blank string titled panels to panels with the titles explicitly hidden.
 */
const migrateExplicitlyHiddenTitles = doc => {
  const {
    attributes
  } = doc;

  // Skip if panelsJSON is missing
  if (typeof (attributes === null || attributes === void 0 ? void 0 : attributes.panelsJSON) !== 'string') return doc;
  try {
    const panels = JSON.parse(attributes.panelsJSON);
    // Same here, prevent failing saved object import if ever panels aren't an array.
    if (!Array.isArray(panels)) return doc;
    const newPanels = [];
    panels.forEach(panel => {
      // Convert each panel into the dashboard panel state
      const originalPanelState = (0, _common.convertSavedDashboardPanelToPanelState)(panel);
      newPanels.push((0, _common.convertPanelStateToSavedDashboardPanel)({
        ...originalPanelState,
        explicitInput: {
          ...originalPanelState.explicitInput,
          ...(originalPanelState.explicitInput.title === '' && !originalPanelState.explicitInput.hidePanelTitles ? {
            hidePanelTitles: true
          } : {})
        }
      }, panel.version));
    });
    return {
      ...doc,
      attributes: {
        ...attributes,
        panelsJSON: JSON.stringify(newPanels)
      }
    };
  } catch {
    return doc;
  }
};
exports.migrateExplicitlyHiddenTitles = migrateExplicitlyHiddenTitles;