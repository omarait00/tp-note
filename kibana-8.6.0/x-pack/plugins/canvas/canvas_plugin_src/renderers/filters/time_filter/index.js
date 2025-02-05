"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timeFilterFactory = void 0;
var _reactDom = _interopRequireDefault(require("react-dom"));
var _react = _interopRequireDefault(require("react"));
var _interpreter = require("@kbn/interpreter");
var _public = require("../../../../../../../src/plugins/data/public");
var _public2 = require("../../../../../../../src/plugins/kibana_react/public");
var _sync_filter_expression = require("../../../../public/lib/sync_filter_expression");
var _i18n = require("../../../../i18n");
var _components = require("./components");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const {
  timeFilter: strings
} = _i18n.RendererStrings;
const defaultTimeFilterExpression = 'timefilter column=@timestamp from=now-24h to=now';
const timeFilterFactory = (core, plugins) => {
  const {
    uiSettings,
    theme
  } = core;
  const customQuickRanges = (uiSettings.get(_public.UI_SETTINGS.TIMEPICKER_QUICK_RANGES) || []).map(({
    from,
    to,
    display
  }) => ({
    start: from,
    end: to,
    label: display
  }));
  const customDateFormat = uiSettings.get('dateFormat');
  return () => ({
    name: 'time_filter',
    displayName: strings.getDisplayName(),
    help: strings.getHelpDescription(),
    reuseDomNode: true,
    // must be true, otherwise popovers don't work
    render: async (domNode, config, handlers) => {
      let filterExpression = handlers.getFilter();
      if (filterExpression === undefined || filterExpression.indexOf('timefilter') !== 0) {
        filterExpression = defaultTimeFilterExpression;
        handlers.event({
          name: 'applyFilterAction',
          data: filterExpression
        });
      } else if (filterExpression !== '') {
        // NOTE: setFilter() will cause a data refresh, avoid calling unless required
        // compare expression and filter, update filter if needed
        const {
          changed,
          newAst
        } = (0, _sync_filter_expression.syncFilterExpression)(config, filterExpression, ['column', 'filterGroup']);
        if (changed) {
          handlers.event({
            name: 'applyFilterAction',
            data: (0, _interpreter.toExpression)(newAst)
          });
        }
      }
      _reactDom.default.render( /*#__PURE__*/_react.default.createElement(_public2.KibanaThemeProvider, {
        theme$: theme.theme$
      }, /*#__PURE__*/_react.default.createElement(_components.TimeFilter, {
        commit: filter => handlers.event({
          name: 'applyFilterAction',
          data: filter
        }),
        filter: filterExpression,
        commonlyUsedRanges: customQuickRanges,
        dateFormat: customDateFormat
      })), domNode, () => handlers.done());
      handlers.onDestroy(() => {
        _reactDom.default.unmountComponentAtNode(domNode);
      });
    }
  });
};
exports.timeFilterFactory = timeFilterFactory;