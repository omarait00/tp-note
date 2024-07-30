"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PromptPage = PromptPage;
var _eui = require("@elastic/eui");
var _alert = require("@elastic/eui/lib/components/icon/assets/alert");
var _icon = require("@elastic/eui/lib/components/icon/icon");
var _cache = _interopRequireDefault(require("@emotion/cache"));
var _createInstance = _interopRequireDefault(require("@emotion/server/create-instance"));
var _react = _interopRequireDefault(require("react"));
var _server = require("react-dom/server");
var _coreRenderingServerInternal = require("@kbn/core-rendering-server-internal");
var _i18n = require("@kbn/i18n");
var _i18nReact = require("@kbn/i18n-react");
var _uiSharedDepsNpm = _interopRequireDefault(require("@kbn/ui-shared-deps-npm"));
var UiSharedDepsSrc = _interopRequireWildcard(require("@kbn/ui-shared-deps-src"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// @ts-expect-error no definitions in component folder

// @ts-expect-error no definitions in component folder

// Preload the alert icon used by `EuiEmptyPrompt` to ensure that it's loaded
// in advance the first time this page is rendered server-side. If not, the
// icon svg wouldn't contain any paths the first time the page was rendered.
(0, _icon.appendIconComponentCache)({
  alert: _alert.icon
});
const emotionCache = (0, _cache.default)({
  key: 'eui'
});
function PromptPage({
  basePath,
  buildNumber,
  scriptPaths = [],
  title,
  body,
  actions
}) {
  const content = /*#__PURE__*/_react.default.createElement(_i18nReact.I18nProvider, null, /*#__PURE__*/_react.default.createElement(_eui.EuiProvider, {
    colorMode: "light",
    cache: emotionCache
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiPage, {
    paddingSize: "none",
    style: {
      minHeight: '100vh'
    },
    "data-test-subj": "promptPage"
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiPageBody, null, /*#__PURE__*/_react.default.createElement(_eui.EuiPageContent_Deprecated, {
    verticalPosition: "center",
    horizontalPosition: "center"
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiEmptyPrompt, {
    iconType: "alert",
    iconColor: "danger",
    title: /*#__PURE__*/_react.default.createElement("h2", null, title),
    body: body,
    actions: actions
  }))))));
  const {
    extractCriticalToChunks,
    constructStyleTagsFromChunks
  } = (0, _createInstance.default)(emotionCache);
  const chunks = extractCriticalToChunks((0, _server.renderToString)(content));
  const emotionStyles = constructStyleTagsFromChunks(chunks);
  const uiPublicURL = `${basePath.serverBasePath}/ui`;
  const regularBundlePath = `${basePath.serverBasePath}/${buildNumber}/bundles`;
  const styleSheetPaths = [`${regularBundlePath}/kbn-ui-shared-deps-src/${UiSharedDepsSrc.cssDistFilename}`, `${regularBundlePath}/kbn-ui-shared-deps-npm/${_uiSharedDepsNpm.default.lightCssDistFilename('v8')}`, `${basePath.serverBasePath}/node_modules/@kbn/ui-framework/dist/kui_light.css`, `${basePath.serverBasePath}/ui/legacy_light_theme.css`];
  return /*#__PURE__*/_react.default.createElement("html", {
    lang: _i18n.i18n.getLocale()
  }, /*#__PURE__*/_react.default.createElement("head", null, /*#__PURE__*/_react.default.createElement("title", null, "Elastic"), /*#__PURE__*/_react.default.createElement("style", {
    dangerouslySetInnerHTML: {
      __html: `</style>${emotionStyles}`
    }
  }), styleSheetPaths.map(path => /*#__PURE__*/_react.default.createElement("link", {
    href: path,
    rel: "stylesheet",
    key: path
  })), /*#__PURE__*/_react.default.createElement(_coreRenderingServerInternal.Fonts, {
    url: uiPublicURL
  }), /*#__PURE__*/_react.default.createElement("link", {
    rel: "alternate icon",
    type: "image/png",
    href: `${uiPublicURL}/favicons/favicon.png`
  }), /*#__PURE__*/_react.default.createElement("link", {
    rel: "icon",
    type: "image/svg+xml",
    href: `${uiPublicURL}/favicons/favicon.svg`
  }), scriptPaths.map(path => /*#__PURE__*/_react.default.createElement("script", {
    src: basePath.prepend(path),
    key: path
  })), /*#__PURE__*/_react.default.createElement("meta", {
    name: "theme-color",
    content: "#ffffff"
  }), /*#__PURE__*/_react.default.createElement("meta", {
    name: "color-scheme",
    content: "light dark"
  })), /*#__PURE__*/_react.default.createElement("body", null, content));
}