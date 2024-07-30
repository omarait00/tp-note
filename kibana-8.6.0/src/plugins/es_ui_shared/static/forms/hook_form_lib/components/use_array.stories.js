"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.UseArrayReorder = exports.UseArrayDynamicData = exports.UseArrayComplex = exports.UseArrayBasic = void 0;
var _react = _interopRequireDefault(require("react"));
var _constants = require("../constants");
var _use_array = require("./use_array");
var _stories__ = require("./__stories__");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const {
  UseArrayBasic,
  UseArrayReorder,
  UseArrayComplex,
  UseArrayDynamicData
} = _stories__.useArrayStories;
exports.UseArrayDynamicData = UseArrayDynamicData;
exports.UseArrayComplex = UseArrayComplex;
exports.UseArrayReorder = UseArrayReorder;
exports.UseArrayBasic = UseArrayBasic;
var _default = {
  component: _use_array.UseArray,
  title: `${_constants.STORYBOOK_SECTION}/UseArray`,
  decorators: [Story => {
    return /*#__PURE__*/_react.default.createElement("div", {
      style: {
        maxWidth: '600px'
      }
    }, /*#__PURE__*/_react.default.createElement(Story, null));
  }]
};
exports.default = _default;