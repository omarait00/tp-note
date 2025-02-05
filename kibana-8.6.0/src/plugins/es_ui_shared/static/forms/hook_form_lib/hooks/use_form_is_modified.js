"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useFormIsModified = void 0;
var _react = require("react");
var _lodash = require("lodash");
var _form_context = require("../form_context");
var _use_form_data = require("./use_form_data");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Hook to detect if any of the form fields have been modified by the user.
 * If a field is modified and then the value is changed back to the initial value
 * the form **won't be marked as modified**.
 * This is useful to detect if a form has changed and we need to display a confirm modal
 * to the user before they navigate away and lose their changes.
 *
 * @param options - Optional options object
 * @returns flag to indicate if the form has been modified
 */
const useFormIsModified = ({
  form: formFromOptions,
  discard: fieldPathsToDiscard = []
} = {}) => {
  const [isFormModified, setIsFormModified] = (0, _react.useState)(false);

  // Hook calls can not be conditional we first try to access the form through context
  let form = (0, _form_context.useFormContext)({
    throwIfNotFound: false
  });
  if (formFromOptions) {
    form = formFromOptions;
  }
  if (!form) {
    throw new Error(`useFormIsModified() used outside the form context and no form was provided in the options.`);
  }
  const {
    getFields,
    __getFieldsRemoved,
    __getFormDefaultValue
  } = form;
  const discardArrayToString = JSON.stringify(fieldPathsToDiscard);

  // Create a map of the fields to discard to optimize look up
  const fieldsToDiscard = (0, _react.useMemo)(() => {
    if (fieldPathsToDiscard.length === 0) {
      return;
    }
    return fieldPathsToDiscard.reduce((acc, path) => ({
      ...acc,
      [path]: true
    }), {});

    // discardArrayToString === discard, we don't want to add it to the dependencies so
    // the consumer does not need to memoize the "discard" array they provide.
  }, [discardArrayToString]); // eslint-disable-line react-hooks/exhaustive-deps

  // We listen to all the form data change to trigger a re-render
  // and update our derived "isModified" state
  (0, _use_form_data.useFormData)({
    form
  });
  const isFieldIncluded = fieldsToDiscard ? ([path]) => fieldsToDiscard[path] !== true : () => true;

  // Calculate next state value
  // 1. Check if any field has been modified
  let nextIsModified = Object.entries(getFields()).filter(isFieldIncluded).some(([_, field]) => field.isModified);
  if (!nextIsModified) {
    // 2. Check if any field has been removed.
    // If somme field has been removed **and** they were originaly present on the
    // form "defaultValue" then the form has been modified.
    const formDefaultValue = __getFormDefaultValue();
    const fieldOnFormDefaultValue = path => Boolean((0, _lodash.get)(formDefaultValue, path));
    const fieldsRemovedFromDOM = fieldsToDiscard ? Object.keys(__getFieldsRemoved()).filter(path => fieldsToDiscard[path] !== true).filter(fieldOnFormDefaultValue) : Object.keys(__getFieldsRemoved()).filter(fieldOnFormDefaultValue);
    nextIsModified = fieldsRemovedFromDOM.length > 0;
  }

  // Update the state **only** if it has changed to avoid creating an infinite re-render
  if (nextIsModified && !isFormModified) {
    setIsFormModified(true);
  } else if (!nextIsModified && isFormModified) {
    setIsFormModified(false);
  }
  return isFormModified;
};
exports.useFormIsModified = useFormIsModified;