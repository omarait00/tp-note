"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrateByValueDashboardPanels = void 0;
var _common = require("../../../../controls/common");
var _common2 = require("../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

// Runs the embeddable migrations on each panel
const migrateByValueDashboardPanels = (migrate, version) => doc => {
  const {
    attributes
  } = doc;
  if (attributes !== null && attributes !== void 0 && attributes.controlGroupInput) {
    const controlGroupInput = (0, _common.rawControlGroupAttributesToSerializable)(attributes.controlGroupInput);
    const migratedControlGroupInput = migrate({
      ...controlGroupInput,
      type: _common.CONTROL_GROUP_TYPE
    });
    attributes.controlGroupInput = (0, _common.serializableToRawControlGroupAttributes)(migratedControlGroupInput);
  }

  // Skip if panelsJSON is missing otherwise this will cause saved object import to fail when
  // importing objects without panelsJSON. At development time of this, there is no guarantee each saved
  // object has panelsJSON in all previous versions of kibana.
  if (typeof (attributes === null || attributes === void 0 ? void 0 : attributes.panelsJSON) !== 'string') {
    return doc;
  }
  const panels = JSON.parse(attributes.panelsJSON);
  // Same here, prevent failing saved object import if ever panels aren't an array.
  if (!Array.isArray(panels)) {
    return doc;
  }
  const newPanels = [];
  panels.forEach(panel => {
    // Convert each panel into a state that can be passed to EmbeddablesSetup.migrate
    const originalPanelState = (0, _common2.convertSavedDashboardPanelToPanelState)(panel);

    // saved vis is used to store by value input for Visualize. This should eventually be renamed to `attributes` to align with Lens and Maps
    if (originalPanelState.explicitInput.attributes || originalPanelState.explicitInput.savedVis) {
      // If this panel is by value, migrate the state using embeddable migrations
      const migratedInput = migrate({
        ...originalPanelState.explicitInput,
        type: originalPanelState.type
      });
      // Convert the embeddable state back into the panel shape
      newPanels.push((0, _common2.convertPanelStateToSavedDashboardPanel)({
        ...originalPanelState,
        explicitInput: {
          ...migratedInput,
          id: migratedInput.id
        }
      }, version));
    } else {
      newPanels.push(panel);
    }
  });
  return {
    ...doc,
    attributes: {
      ...attributes,
      panelsJSON: JSON.stringify(newPanels)
    }
  };
};
exports.migrateByValueDashboardPanels = migrateByValueDashboardPanels;