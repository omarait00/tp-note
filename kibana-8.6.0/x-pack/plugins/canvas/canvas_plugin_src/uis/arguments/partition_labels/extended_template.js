"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExtendedTemplate = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _eui = require("@elastic/eui");
var _lodash = require("lodash");
var _default_expression = require("./default_expression");
var _utils = require("./utils");
var _i18n = require("../../../../i18n");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const {
  PartitionLabels: strings
} = _i18n.ArgumentStrings;
const SHOW_FIELD = 'show';
const POSITION_FIELD = 'position';
const VALUES_FIELD = 'values';
const VALUES_FORMAT_FIELD = 'valuesFormat';
const PERCENT_DECIMALS_FIELD = 'percentDecimals';
const ExtendedTemplate = ({
  onValueChange,
  argValue
}) => {
  const showLabels = (0, _utils.getFieldValue)(argValue, SHOW_FIELD);
  const showValues = (0, _utils.getFieldValue)(argValue, VALUES_FIELD);
  const valueFormat = (0, _utils.getFieldValue)(argValue, VALUES_FORMAT_FIELD);
  const percentDecimals = (0, _utils.getFieldValue)(argValue, PERCENT_DECIMALS_FIELD);
  const positions = [{
    text: strings.getPositionDefaultLabel(),
    value: 'default'
  }, {
    text: strings.getPositionInsideLabel(),
    value: 'inside'
  }];
  const valuesFormats = [{
    text: strings.getValuesFormatValueLabel(),
    value: 'value'
  }, {
    text: strings.getValuesFormatPercentLabel(),
    value: 'percent'
  }];
  (0, _react.useEffect)(() => {
    if (!argValue) {
      onValueChange((0, _default_expression.defaultExpression)());
    }
  }, [argValue, onValueChange]);
  const onChangeField = (0, _react.useCallback)((field, value) => {
    const path = (0, _utils.getFieldPath)(field);
    const oldArgValue = argValue !== null && argValue !== void 0 ? argValue : (0, _default_expression.defaultExpression)();
    const newArgValue = (0, _lodash.set)(oldArgValue, path, value);
    onValueChange(newArgValue);
  }, [argValue, onValueChange]);
  const onToggleFieldChange = (0, _react.useCallback)(field => event => {
    onChangeField(field, event.target.checked);
  }, [onChangeField]);
  const onCommonFieldChange = (0, _react.useCallback)(field => event => {
    onChangeField(field, event.currentTarget.value);
  }, [onChangeField]);
  if (!showLabels) {
    return /*#__PURE__*/_react.default.createElement(_eui.EuiText, {
      color: "subdued",
      size: "xs"
    }, /*#__PURE__*/_react.default.createElement("p", null, strings.getSwitchedOffShowLabelsLabel()));
  }
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_eui.EuiFormRow, {
    label: strings.getPositionLabel(),
    display: "columnCompressed"
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiSelect, {
    compressed: true,
    value: (0, _utils.getFieldValue)(argValue, POSITION_FIELD),
    options: positions,
    onChange: onCommonFieldChange(POSITION_FIELD)
  })), /*#__PURE__*/_react.default.createElement(_eui.EuiSpacer, {
    size: "s"
  }), /*#__PURE__*/_react.default.createElement(_eui.EuiFormRow, {
    label: strings.getValuesLabel(),
    display: "columnCompressedSwitch"
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiSwitch, {
    compressed: true,
    checked: showValues,
    onChange: onToggleFieldChange(VALUES_FIELD),
    label: strings.getValuesToggle()
  })), showValues && /*#__PURE__*/_react.default.createElement(_eui.EuiFormRow, {
    label: strings.getValuesFormatLabel(),
    display: "columnCompressed"
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiSelect, {
    compressed: true,
    value: valueFormat,
    options: valuesFormats,
    onChange: onCommonFieldChange(VALUES_FORMAT_FIELD)
  })), showValues && valueFormat === 'percent' && /*#__PURE__*/_react.default.createElement(_eui.EuiFormRow, {
    label: strings.getPercentDecimalsLabel(),
    display: "columnCompressed"
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiRange, {
    compressed: true,
    min: 0,
    max: 10,
    step: 1,
    showLabels: true,
    showInput: true,
    value: percentDecimals,
    onChange: (e, isValid) => {
      if (isValid) {
        onCommonFieldChange(PERCENT_DECIMALS_FIELD)(e);
      }
    }
  })));
};
exports.ExtendedTemplate = ExtendedTemplate;
ExtendedTemplate.propTypes = {
  onValueChange: _propTypes.default.func.isRequired,
  argValue: _propTypes.default.oneOfType([_propTypes.default.bool, _propTypes.default.object]).isRequired
};
ExtendedTemplate.displayName = 'PartitionLabelsExtendedArg';