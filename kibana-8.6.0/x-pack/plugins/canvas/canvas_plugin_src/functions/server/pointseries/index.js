"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pointseries = pointseries;
var _tinymath = require("@kbn/tinymath");
var _lodash = require("lodash");
var _moment = _interopRequireDefault(require("moment"));
var _pivot_object_array = require("../../../../common/lib/pivot_object_array");
var _unquote_string = require("../../../../common/lib/unquote_string");
var _is_column_reference = require("./lib/is_column_reference");
var _get_expression_type = require("./lib/get_expression_type");
var _i18n = require("../../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// TODO: pointseries performs poorly, that's why we run it on the server.

const columnExists = (cols, colName) => cols.includes((0, _unquote_string.unquoteString)(colName));
function keysOf(obj) {
  return Object.keys(obj);
}
function pointseries() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().pointseries;
  return {
    name: 'pointseries',
    type: 'pointseries',
    context: {
      types: ['datatable']
    },
    help,
    args: {
      color: {
        types: ['string'],
        help: argHelp.color // If you need categorization, transform the field.
      },

      size: {
        types: ['string'],
        help: argHelp.size
      },
      text: {
        types: ['string'],
        help: argHelp.text
      },
      x: {
        types: ['string'],
        help: argHelp.x
      },
      y: {
        types: ['string'],
        help: argHelp.y
      }
      // In the future it may make sense to add things like shape, or tooltip values, but I think what we have is good for now
      // The way the function below is written you can add as many arbitrary named args as you want.
    },

    fn: (input, args) => {
      const errors = (0, _i18n.getFunctionErrors)().pointseries;
      // Note: can't replace pivotObjectArray with datatableToMathContext, lose name of non-numeric columns
      const columnNames = input.columns.map(col => col.name);
      const mathScope = (0, _pivot_object_array.pivotObjectArray)(input.rows, columnNames);
      const autoQuoteColumn = col => {
        if (!col || !columnNames.includes(col)) {
          return col;
        }
        return col.match(/\s/) ? `'${col}'` : col;
      };
      const measureNames = [];
      const dimensions = [];
      const columns = {};

      // Separates args into dimensions and measures arrays
      // by checking if arg is a column reference (dimension)
      keysOf(args).forEach(argName => {
        const mathExp = autoQuoteColumn(args[argName]);
        if (mathExp != null && mathExp.trim() !== '') {
          const col = {
            type: '',
            role: '',
            expression: mathExp
          };
          if ((0, _is_column_reference.isColumnReference)(mathExp)) {
            // TODO: Do something better if the column does not exist
            if (!columnExists(columnNames, mathExp)) {
              return;
            }
            dimensions.push({
              name: argName,
              value: mathExp
            });
            col.type = (0, _get_expression_type.getExpressionType)(input.columns, mathExp);
            col.role = 'dimension';
          } else {
            measureNames.push(argName);
            col.type = 'number';
            col.role = 'measure';
          }

          // @ts-expect-error untyped local: get_expression_type
          columns[argName] = col;
        }
      });
      const PRIMARY_KEY = '%%CANVAS_POINTSERIES_PRIMARY_KEY%%';
      const rows = input.rows.map((row, i) => ({
        ...row,
        [PRIMARY_KEY]: i
      }));
      function normalizeValue(expression, value, index) {
        const numberValue = Array.isArray(value) ? value[index] : value;
        switch ((0, _get_expression_type.getExpressionType)(input.columns, expression)) {
          case 'string':
            return String(numberValue);
          case 'number':
            return Number(numberValue);
          case 'date':
            return (0, _moment.default)(numberValue).valueOf();
          default:
            return numberValue;
        }
      }

      // Dimensions
      // Group rows by their dimension values, using the argument values and preserving the PRIMARY_KEY
      // There's probably a better way to do this
      const results = rows.reduce((rowAcc, row, i) => {
        const newRow = dimensions.reduce((acc, {
          name,
          value
        }) => {
          try {
            acc[name] = args[name] ? normalizeValue(value, (0, _tinymath.evaluate)(value, mathScope), i) : '_all';
          } catch (e) {
            // TODO: handle invalid column names...
            // Do nothing if column does not exist
            // acc[dimension] = '_all';
          }
          return acc;
        }, {
          [PRIMARY_KEY]: row[PRIMARY_KEY]
        });
        return Object.assign(rowAcc, {
          [row[PRIMARY_KEY]]: newRow
        });
      }, {});

      // Measures
      // First group up all of the distinct dimensioned bits. Each of these will be reduced to just 1 value
      // for each measure
      const measureKeys = (0, _lodash.groupBy)(rows, row => dimensions.map(({
        name
      }) => {
        const value = args[name];
        return value ? row[value] : '_all';
      }).join('::%BURLAP%::'));

      // Then compute that 1 value for each measure
      Object.values(measureKeys).forEach(valueRows => {
        const subtable = {
          type: 'datatable',
          columns: input.columns,
          rows: valueRows
        };
        const subScope = (0, _pivot_object_array.pivotObjectArray)(subtable.rows, subtable.columns.map(col => col.name));
        const measureValues = measureNames.map(measure => {
          try {
            const ev = (0, _tinymath.evaluate)(args[measure], subScope);
            if (Array.isArray(ev)) {
              throw errors.unwrappedExpression();
            }
            return ev;
          } catch (e) {
            // TODO: don't catch if eval to Array
            return null;
          }
        });
        valueRows.forEach(row => {
          Object.assign(results[row[PRIMARY_KEY]], (0, _lodash.zipObject)(measureNames, measureValues));
        });
      });

      // It only makes sense to uniq the rows in a point series as 2 values can not exist in the exact same place at the same time.
      const resultingRows = (0, _lodash.uniqBy)(Object.values(results).map(row => (0, _lodash.omit)(row, PRIMARY_KEY)), JSON.stringify);
      return {
        type: 'pointseries',
        columns,
        rows: resultingRows
      };
    }
  };
}