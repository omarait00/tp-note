"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useCanvasShareableState = exports.initialCanvasShareableState = exports.CanvasShareableStateProvider = exports.CanvasShareableContext = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reducer = require("./reducer");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * The initial state for the Canvas Shareable Runtime.
 */
const initialCanvasShareableState = {
  renderers: {},
  workpad: null,
  stage: {
    page: 0,
    height: 400,
    width: 600
  },
  footer: {
    isScrubberVisible: false
  },
  settings: {
    autoplay: {
      isEnabled: false,
      interval: '5s'
    },
    toolbar: {
      isAutohide: false
    }
  },
  refs: {
    stage: /*#__PURE__*/_react.default.createRef()
  }
};
exports.initialCanvasShareableState = initialCanvasShareableState;
const CanvasShareableContext = /*#__PURE__*/(0, _react.createContext)([initialCanvasShareableState, () => {}]);
exports.CanvasShareableContext = CanvasShareableContext;
const CanvasShareableStateProvider = ({
  initialState,
  children
}) => /*#__PURE__*/_react.default.createElement(CanvasShareableContext.Provider, {
  value: (0, _react.useReducer)(_reducer.reducer, initialState)
}, children);
exports.CanvasShareableStateProvider = CanvasShareableStateProvider;
const useCanvasShareableState = () => (0, _react.useContext)(CanvasShareableContext);
exports.useCanvasShareableState = useCanvasShareableState;