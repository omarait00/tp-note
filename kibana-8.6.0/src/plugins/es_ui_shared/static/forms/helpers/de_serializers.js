"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.multiSelectComponent = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const multiSelectComponent = {
  // This deSerializer takes the previously selected options and map them
  // against the default select options values.
  selectedValueToOptions(selectOptions) {
    return defaultFormValue => {
      // If there are no default form value, it means that no previous value has been selected.
      if (!defaultFormValue) {
        return selectOptions;
      }
      return selectOptions.map(option => ({
        ...option,
        checked: defaultFormValue.includes(option.label) ? 'on' : undefined
      }));
    };
  }
};
exports.multiSelectComponent = multiSelectComponent;