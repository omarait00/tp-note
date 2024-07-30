"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.UseFieldFieldTypes = exports.UseFieldChangeListeners = void 0;
var _react = _interopRequireDefault(require("react"));
var _addonActions = require("@storybook/addon-actions");
var _eui = require("@elastic/eui");
var _constants = require("../constants");
var _use_form = require("../hooks/use_form");
var _form = require("./form");
var _use_field = require("./use_field");
var _stories__ = require("./__stories__");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const {
  UseFieldFieldTypes,
  UseFieldChangeListeners
} = _stories__.useFieldStories;

/**
 * Validate the form and return its data.
 *
 * @param form The FormHook instance
 */
exports.UseFieldChangeListeners = UseFieldChangeListeners;
exports.UseFieldFieldTypes = UseFieldFieldTypes;
const submitForm = async form => {
  const {
    isValid,
    data
  } = await form.submit();
  (0, _addonActions.action)('Send form')({
    isValid,
    data: JSON.stringify(data)
  });
};
var _default = {
  component: _use_field.UseField,
  title: `${_constants.STORYBOOK_SECTION}/UseField`,
  decorators: [Story => {
    const {
      form
    } = (0, _use_form.useForm)();
    return /*#__PURE__*/_react.default.createElement("div", {
      style: {
        maxWidth: '600px'
      }
    }, /*#__PURE__*/_react.default.createElement(_form.Form, {
      form: form
    }, /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(Story, null), /*#__PURE__*/_react.default.createElement(_eui.EuiSpacer, null), /*#__PURE__*/_react.default.createElement(_eui.EuiButton, {
      onClick: () => submitForm(form)
    }, "Send"))));
  }]
};
exports.default = _default;