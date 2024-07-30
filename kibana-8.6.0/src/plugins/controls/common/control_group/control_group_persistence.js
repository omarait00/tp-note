"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serializableToRawControlGroupAttributes = exports.rawControlGroupAttributesToSerializable = exports.rawControlGroupAttributesToControlGroupInput = exports.persistableControlGroupInputIsEqual = exports.getDefaultControlGroupInput = exports.controlGroupInputToRawControlGroupAttributes = void 0;
var _fastDeepEqual = _interopRequireDefault(require("fast-deep-equal"));
var _lodash = require("lodash");
var _control_group_constants = require("./control_group_constants");
var _control_group_panel_diff_system = require("./control_group_panel_diff_system");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const safeJSONParse = jsonString => {
  if (!jsonString && typeof jsonString !== 'string') return;
  try {
    return JSON.parse(jsonString);
  } catch {
    return;
  }
};
const getDefaultControlGroupInput = () => ({
  panels: {},
  defaultControlWidth: _control_group_constants.DEFAULT_CONTROL_WIDTH,
  defaultControlGrow: _control_group_constants.DEFAULT_CONTROL_GROW,
  controlStyle: _control_group_constants.DEFAULT_CONTROL_STYLE,
  chainingSystem: 'HIERARCHICAL',
  ignoreParentSettings: {
    ignoreFilters: false,
    ignoreQuery: false,
    ignoreTimerange: false,
    ignoreValidations: false
  }
});
exports.getDefaultControlGroupInput = getDefaultControlGroupInput;
const persistableControlGroupInputIsEqual = (a, b) => {
  const defaultInput = getDefaultControlGroupInput();
  const inputA = {
    ...defaultInput,
    ...(0, _lodash.pick)(a, ['panels', 'chainingSystem', 'controlStyle', 'ignoreParentSettings'])
  };
  const inputB = {
    ...defaultInput,
    ...(0, _lodash.pick)(b, ['panels', 'chainingSystem', 'controlStyle', 'ignoreParentSettings'])
  };
  if (getPanelsAreEqual(inputA.panels, inputB.panels) && (0, _fastDeepEqual.default)((0, _lodash.omit)(inputA, 'panels'), (0, _lodash.omit)(inputB, 'panels'))) return true;
  return false;
};
exports.persistableControlGroupInputIsEqual = persistableControlGroupInputIsEqual;
const getPanelsAreEqual = (originalPanels, newPanels) => {
  const originalPanelIds = Object.keys(originalPanels);
  const newPanelIds = Object.keys(newPanels);
  const panelIdDiff = (0, _lodash.xor)(originalPanelIds, newPanelIds);
  if (panelIdDiff.length > 0) {
    return false;
  }
  for (const panelId of newPanelIds) {
    const newPanelType = newPanels[panelId].type;
    const panelIsEqual = _control_group_panel_diff_system.ControlPanelDiffSystems[newPanelType] ? _control_group_panel_diff_system.ControlPanelDiffSystems[newPanelType].getPanelIsEqual(originalPanels[panelId], newPanels[panelId]) : _control_group_panel_diff_system.genericControlPanelDiffSystem.getPanelIsEqual(originalPanels[panelId], newPanels[panelId]);
    if (!panelIsEqual) return false;
  }
  return true;
};
const controlGroupInputToRawControlGroupAttributes = controlGroupInput => {
  return {
    controlStyle: controlGroupInput.controlStyle,
    chainingSystem: controlGroupInput.chainingSystem,
    panelsJSON: JSON.stringify(controlGroupInput.panels),
    ignoreParentSettingsJSON: JSON.stringify(controlGroupInput.ignoreParentSettings)
  };
};
exports.controlGroupInputToRawControlGroupAttributes = controlGroupInputToRawControlGroupAttributes;
const rawControlGroupAttributesToControlGroupInput = rawControlGroupAttributes => {
  const defaultControlGroupInput = getDefaultControlGroupInput();
  const {
    chainingSystem,
    controlStyle,
    ignoreParentSettingsJSON,
    panelsJSON
  } = rawControlGroupAttributes;
  const panels = safeJSONParse(panelsJSON);
  const ignoreParentSettings = safeJSONParse(ignoreParentSettingsJSON);
  return {
    ...defaultControlGroupInput,
    ...(chainingSystem ? {
      chainingSystem
    } : {}),
    ...(controlStyle ? {
      controlStyle
    } : {}),
    ...(ignoreParentSettings ? {
      ignoreParentSettings
    } : {}),
    ...(panels ? {
      panels
    } : {})
  };
};
exports.rawControlGroupAttributesToControlGroupInput = rawControlGroupAttributesToControlGroupInput;
const rawControlGroupAttributesToSerializable = rawControlGroupAttributes => {
  var _rawControlGroupAttri, _safeJSONParse, _safeJSONParse2;
  const defaultControlGroupInput = getDefaultControlGroupInput();
  return {
    chainingSystem: rawControlGroupAttributes === null || rawControlGroupAttributes === void 0 ? void 0 : rawControlGroupAttributes.chainingSystem,
    controlStyle: (_rawControlGroupAttri = rawControlGroupAttributes === null || rawControlGroupAttributes === void 0 ? void 0 : rawControlGroupAttributes.controlStyle) !== null && _rawControlGroupAttri !== void 0 ? _rawControlGroupAttri : defaultControlGroupInput.controlStyle,
    ignoreParentSettings: (_safeJSONParse = safeJSONParse(rawControlGroupAttributes === null || rawControlGroupAttributes === void 0 ? void 0 : rawControlGroupAttributes.ignoreParentSettingsJSON)) !== null && _safeJSONParse !== void 0 ? _safeJSONParse : {},
    panels: (_safeJSONParse2 = safeJSONParse(rawControlGroupAttributes === null || rawControlGroupAttributes === void 0 ? void 0 : rawControlGroupAttributes.panelsJSON)) !== null && _safeJSONParse2 !== void 0 ? _safeJSONParse2 : {}
  };
};
exports.rawControlGroupAttributesToSerializable = rawControlGroupAttributesToSerializable;
const serializableToRawControlGroupAttributes = serializable => {
  return {
    controlStyle: serializable.controlStyle,
    chainingSystem: serializable.chainingSystem,
    ignoreParentSettingsJSON: JSON.stringify(serializable.ignoreParentSettings),
    panelsJSON: JSON.stringify(serializable.panels)
  };
};
exports.serializableToRawControlGroupAttributes = serializableToRawControlGroupAttributes;