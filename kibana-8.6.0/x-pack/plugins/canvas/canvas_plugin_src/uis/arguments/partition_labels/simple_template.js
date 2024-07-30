"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimpleTemplate = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _eui = require("@elastic/eui");
var _lodash = require("lodash");
var _default_expression = require("./default_expression");
var _utils = require("./utils");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const SHOW_FIELD = 'show';
const SimpleTemplate = ({
  onValueChange,
  argValue
}) => {
  const showValuePath = (0, _utils.getFieldPath)(SHOW_FIELD);
  (0, _react.useEffect)(() => {
    if (!argValue) {
      onValueChange((0, _default_expression.defaultExpression)());
    }
  }, [argValue, onValueChange]);
  const onToggle = (0, _react.useCallback)(event => {
    const oldArgValue = argValue !== null && argValue !== void 0 ? argValue : (0, _default_expression.defaultExpression)();
    const newArgValue = (0, _lodash.set)(oldArgValue, showValuePath, event.target.checked);
    onValueChange(newArgValue);
  }, [argValue, onValueChange, showValuePath]);
  const showLabels = (0, _utils.getFieldValue)(argValue, SHOW_FIELD, false);
  return /*#__PURE__*/_react.default.createElement(_eui.EuiSwitch, {
    compressed: true,
    checked: showLabels,
    onChange: onToggle,
    showLabel: false,
    label: ""
  });
};
exports.SimpleTemplate = SimpleTemplate;
SimpleTemplate.propTypes = {
  onValueChange: _propTypes.default.func.isRequired,
  argValue: _propTypes.default.oneOfType([_propTypes.default.bool, _propTypes.default.object]).isRequired
};
SimpleTemplate.displayName = 'PartitionLabelsSimpleArg';