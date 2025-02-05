"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metricTrendlineFunction = void 0;
var _i18n = require("@kbn/i18n");
var _utils = require("../../../../visualizations/common/utils");
var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const metricTrendlineFunction = () => ({
  name: _constants.EXPRESSION_METRIC_TRENDLINE_NAME,
  inputTypes: ['datatable'],
  type: _constants.EXPRESSION_METRIC_TRENDLINE_NAME,
  help: _i18n.i18n.translate('expressionMetricVis.trendline.function.help', {
    defaultMessage: 'Metric visualization'
  }),
  args: {
    metric: {
      types: ['vis_dimension', 'string'],
      help: _i18n.i18n.translate('expressionMetricVis.trendline.function.metric.help', {
        defaultMessage: 'The primary metric.'
      }),
      required: true
    },
    timeField: {
      types: ['vis_dimension', 'string'],
      help: _i18n.i18n.translate('expressionMetricVis.trendline.function.timeField.help', {
        defaultMessage: 'The time field for the trend line'
      }),
      required: true
    },
    breakdownBy: {
      types: ['vis_dimension', 'string'],
      help: _i18n.i18n.translate('expressionMetricVis.trendline.function.breakdownBy.help', {
        defaultMessage: 'The dimension containing the labels for sub-categories.'
      })
    },
    table: {
      types: ['datatable'],
      help: _i18n.i18n.translate('expressionMetricVis.trendline.function.table.help', {
        defaultMessage: 'A data table'
      }),
      multi: false
    },
    inspectorTableId: {
      types: ['string'],
      help: _i18n.i18n.translate('expressionMetricVis.trendline.function.inspectorTableId.help', {
        defaultMessage: 'An ID for the inspector table'
      }),
      multi: false,
      default: 'trendline'
    }
  },
  fn(input, args, handlers) {
    var _getColumnByAccessor, _getColumnByAccessor2;
    const table = args.table;
    (0, _utils.validateAccessor)(args.metric, table.columns);
    (0, _utils.validateAccessor)(args.timeField, table.columns);
    (0, _utils.validateAccessor)(args.breakdownBy, table.columns);
    const argsTable = [[[args.metric], _i18n.i18n.translate('expressionMetricVis.function.dimension.metric', {
      defaultMessage: 'Metric'
    })], [[args.timeField], _i18n.i18n.translate('expressionMetricVis.function.dimension.timeField', {
      defaultMessage: 'Time field'
    })]];
    if (args.breakdownBy) {
      argsTable.push([[args.breakdownBy], _i18n.i18n.translate('expressionMetricVis.function.dimension.splitGroup', {
        defaultMessage: 'Split group'
      })]);
    }
    const inspectorTable = (0, _utils.prepareLogTable)(table, argsTable, true);
    const metricColId = (_getColumnByAccessor = (0, _utils.getColumnByAccessor)(args.metric, table.columns)) === null || _getColumnByAccessor === void 0 ? void 0 : _getColumnByAccessor.id;
    const timeColId = (_getColumnByAccessor2 = (0, _utils.getColumnByAccessor)(args.timeField, table.columns)) === null || _getColumnByAccessor2 === void 0 ? void 0 : _getColumnByAccessor2.id;
    if (!metricColId || !timeColId) {
      throw new Error("Metric trendline - couldn't find metric or time column!");
    }
    const trends = {};
    if (!args.breakdownBy) {
      trends[_constants.DEFAULT_TRENDLINE_NAME] = table.rows.map(row => ({
        x: row[timeColId],
        y: row[metricColId]
      }));
    } else {
      var _getColumnByAccessor3;
      const breakdownByColId = (_getColumnByAccessor3 = (0, _utils.getColumnByAccessor)(args.breakdownBy, table.columns)) === null || _getColumnByAccessor3 === void 0 ? void 0 : _getColumnByAccessor3.id;
      if (!breakdownByColId) {
        throw new Error("Metric trendline - couldn't find breakdown column!");
      }
      const rowsByBreakdown = {};
      table.rows.forEach(row => {
        const breakdownTerm = row[breakdownByColId];
        if (!(breakdownTerm in rowsByBreakdown)) {
          rowsByBreakdown[breakdownTerm] = [];
        }
        rowsByBreakdown[breakdownTerm].push(row);
      });
      for (const breakdownTerm in rowsByBreakdown) {
        if (!rowsByBreakdown.hasOwnProperty(breakdownTerm)) continue;
        trends[breakdownTerm] = rowsByBreakdown[breakdownTerm].map(row => ({
          x: row[timeColId] !== null ? row[timeColId] : NaN,
          y: row[metricColId] !== null ? row[metricColId] : NaN
        }));
      }
    }
    return {
      type: _constants.EXPRESSION_METRIC_TRENDLINE_NAME,
      trends,
      inspectorTable,
      inspectorTableId: args.inspectorTableId
    };
  }
});
exports.metricTrendlineFunction = metricTrendlineFunction;