"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormDataContextProvider = void 0;
exports.useFormDataContext = useFormDataContext;
var _react = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Context required for the "useFormData()" hook in order to access the form data
 * observable and the getFormData() handler which serializes the form data
 */
const FormDataContext = /*#__PURE__*/(0, _react.createContext)(undefined);
/**
 * This provider wraps the whole form and is consumed by the <Form /> component
 */
const FormDataContextProvider = ({
  children,
  getFormData$,
  getFormData
}) => {
  const value = (0, _react.useMemo)(() => ({
    getFormData,
    getFormData$
  }), [getFormData, getFormData$]);
  return /*#__PURE__*/_react.default.createElement(FormDataContext.Provider, {
    value: value
  }, children);
};
exports.FormDataContextProvider = FormDataContextProvider;
function useFormDataContext() {
  return (0, _react.useContext)(FormDataContext);
}