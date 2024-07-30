"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genericControlPanelDiffSystem = exports.ControlPanelDiffSystems = void 0;
var _fastDeepEqual = _interopRequireDefault(require("fast-deep-equal"));
var _lodash = require("lodash");
var _types = require("../options_list/types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const genericControlPanelDiffSystem = {
  getPanelIsEqual: (initialInput, newInput) => {
    return (0, _fastDeepEqual.default)(initialInput, newInput);
  }
};
exports.genericControlPanelDiffSystem = genericControlPanelDiffSystem;
const ControlPanelDiffSystems = {
  [_types.OPTIONS_LIST_CONTROL]: {
    getPanelIsEqual: (initialInput, newInput) => {
      if (!(0, _fastDeepEqual.default)((0, _lodash.omit)(initialInput, 'explicitInput'), (0, _lodash.omit)(newInput, 'explicitInput'))) {
        return false;
      }
      const {
        exclude: excludeA,
        hideExists: hideExistsA,
        hideExclude: hideExcludeA,
        selectedOptions: selectedA,
        singleSelect: singleSelectA,
        existsSelected: existsSelectedA,
        runPastTimeout: runPastTimeoutA,
        ...inputA
      } = initialInput.explicitInput;
      const {
        exclude: excludeB,
        hideExists: hideExistsB,
        hideExclude: hideExcludeB,
        selectedOptions: selectedB,
        singleSelect: singleSelectB,
        existsSelected: existsSelectedB,
        runPastTimeout: runPastTimeoutB,
        ...inputB
      } = newInput.explicitInput;
      return Boolean(excludeA) === Boolean(excludeB) && Boolean(hideExistsA) === Boolean(hideExistsB) && Boolean(hideExcludeA) === Boolean(hideExcludeB) && Boolean(singleSelectA) === Boolean(singleSelectB) && Boolean(existsSelectedA) === Boolean(existsSelectedB) && Boolean(runPastTimeoutA) === Boolean(runPastTimeoutB) && (0, _lodash.isEqual)(selectedA !== null && selectedA !== void 0 ? selectedA : [], selectedB !== null && selectedB !== void 0 ? selectedB : []) && (0, _fastDeepEqual.default)(inputA, inputB);
    }
  }
};
exports.ControlPanelDiffSystems = ControlPanelDiffSystems;