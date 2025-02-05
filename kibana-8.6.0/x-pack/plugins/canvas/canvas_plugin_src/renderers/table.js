"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tableFactory = exports.getTableRenderer = void 0;
var _reactDom = _interopRequireDefault(require("react-dom"));
var _react = _interopRequireDefault(require("react"));
var _public = require("../../../../../src/plugins/kibana_react/public");
var _lib = require("../../../../../src/plugins/presentation_util/common/lib");
var _datatable = require("../../public/components/datatable");
var _i18n = require("../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const {
  dropdownFilter: strings
} = _i18n.RendererStrings;
const getTableRenderer = (theme$ = _lib.defaultTheme$) => () => ({
  name: 'table',
  displayName: strings.getDisplayName(),
  help: strings.getHelpDescription(),
  reuseDomNode: true,
  render(domNode, config, handlers) {
    const {
      datatable,
      paginate,
      perPage,
      font = {
        spec: {}
      },
      showHeader
    } = config;
    _reactDom.default.render( /*#__PURE__*/_react.default.createElement(_public.KibanaThemeProvider, {
      theme$: theme$
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        ...font.spec,
        height: '100%'
      }
    }, /*#__PURE__*/_react.default.createElement(_datatable.Datatable, {
      datatable: datatable,
      perPage: perPage,
      paginate: paginate,
      showHeader: showHeader
    }))), domNode, () => handlers.done());
    handlers.onDestroy(() => _reactDom.default.unmountComponentAtNode(domNode));
  }
});
exports.getTableRenderer = getTableRenderer;
const tableFactory = (core, plugins) => getTableRenderer(core.theme.theme$);
exports.tableFactory = tableFactory;