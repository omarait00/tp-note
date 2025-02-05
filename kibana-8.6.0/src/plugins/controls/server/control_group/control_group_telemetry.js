"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeControlGroupTelemetry = exports.controlGroupTelemetry = void 0;
var _lodash = require("lodash");
var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const initializeControlGroupTelemetry = statsSoFar => {
  var _ref, _ref2, _ref3, _ref4, _ref5;
  return {
    total: (_ref = statsSoFar === null || statsSoFar === void 0 ? void 0 : statsSoFar.total) !== null && _ref !== void 0 ? _ref : 0,
    chaining_system: (_ref2 = statsSoFar === null || statsSoFar === void 0 ? void 0 : statsSoFar.chaining_system) !== null && _ref2 !== void 0 ? _ref2 : {},
    ignore_settings: (_ref3 = statsSoFar === null || statsSoFar === void 0 ? void 0 : statsSoFar.ignore_settings) !== null && _ref3 !== void 0 ? _ref3 : {},
    label_position: (_ref4 = statsSoFar === null || statsSoFar === void 0 ? void 0 : statsSoFar.label_position) !== null && _ref4 !== void 0 ? _ref4 : {},
    by_type: (_ref5 = statsSoFar === null || statsSoFar === void 0 ? void 0 : statsSoFar.by_type) !== null && _ref5 !== void 0 ? _ref5 : {}
  };
};
exports.initializeControlGroupTelemetry = initializeControlGroupTelemetry;
const reportChainingSystemInUse = (chainingSystemsStats, chainingSystem) => {
  if (!chainingSystem) return chainingSystemsStats;
  if (Boolean(chainingSystemsStats[chainingSystem])) {
    chainingSystemsStats[chainingSystem]++;
  } else {
    chainingSystemsStats[chainingSystem] = 1;
  }
  return chainingSystemsStats;
};
const reportLabelPositionsInUse = (labelPositionStats, labelPosition) => {
  if (!labelPosition) return labelPositionStats;
  if (Boolean(labelPositionStats[labelPosition])) {
    labelPositionStats[labelPosition]++;
  } else {
    labelPositionStats[labelPosition] = 1;
  }
  return labelPositionStats;
};
const reportIgnoreSettingsInUse = (settingsStats, settings) => {
  if (!settings) return settingsStats;
  for (const [settingKey, settingValue] of Object.entries(settings)) {
    if (settingValue) {
      var _settingsStats$settin;
      // only report ignore settings which are turned ON
      const currentValueForSetting = (_settingsStats$settin = settingsStats[settingKey]) !== null && _settingsStats$settin !== void 0 ? _settingsStats$settin : 0;
      (0, _lodash.set)(settingsStats, settingKey, currentValueForSetting + 1);
    }
  }
  return settingsStats;
};
const reportControlTypes = (controlTypeStats, panels) => {
  for (const {
    type
  } of Object.values(panels)) {
    var _controlTypeStats$typ, _controlTypeStats$typ2, _controlTypeStats$typ3, _controlTypeStats$typ4;
    const currentTypeCount = (_controlTypeStats$typ = (_controlTypeStats$typ2 = controlTypeStats[type]) === null || _controlTypeStats$typ2 === void 0 ? void 0 : _controlTypeStats$typ2.total) !== null && _controlTypeStats$typ !== void 0 ? _controlTypeStats$typ : 0;
    const currentTypeDetails = (_controlTypeStats$typ3 = (_controlTypeStats$typ4 = controlTypeStats[type]) === null || _controlTypeStats$typ4 === void 0 ? void 0 : _controlTypeStats$typ4.details) !== null && _controlTypeStats$typ3 !== void 0 ? _controlTypeStats$typ3 : {};

    // here if we need to start tracking details on specific control types, we can call embeddableService.telemetry

    (0, _lodash.set)(controlTypeStats, `${type}.total`, currentTypeCount + 1);
    (0, _lodash.set)(controlTypeStats, `${type}.details`, currentTypeDetails);
  }
  return controlTypeStats;
};
const controlGroupTelemetry = (state, stats) => {
  var _controlGroupInput$pa;
  const controlGroupStats = initializeControlGroupTelemetry(stats);
  const controlGroupInput = (0, _common.rawControlGroupAttributesToControlGroupInput)(state);
  if (!controlGroupInput) return controlGroupStats;
  controlGroupStats.total += Object.keys((_controlGroupInput$pa = controlGroupInput === null || controlGroupInput === void 0 ? void 0 : controlGroupInput.panels) !== null && _controlGroupInput$pa !== void 0 ? _controlGroupInput$pa : {}).length;
  controlGroupStats.chaining_system = reportChainingSystemInUse(controlGroupStats.chaining_system, controlGroupInput.chainingSystem);
  controlGroupStats.label_position = reportLabelPositionsInUse(controlGroupStats.label_position, controlGroupInput.controlStyle);
  controlGroupStats.ignore_settings = reportIgnoreSettingsInUse(controlGroupStats.ignore_settings, controlGroupInput.ignoreParentSettings);
  controlGroupStats.by_type = reportControlTypes(controlGroupStats.by_type, controlGroupInput.panels);
  return controlGroupStats;
};
exports.controlGroupTelemetry = controlGroupTelemetry;