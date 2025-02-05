"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.num = void 0;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const num = {
  name: 'num',
  from: {
    null: () => ({
      type: 'num',
      value: 0
    }),
    boolean: b => ({
      type: 'num',
      value: Number(b)
    }),
    string: n => {
      const value = Number(n);
      if (Number.isNaN(value)) {
        throw new Error(_i18n.i18n.translate('expressions.types.number.fromStringConversionErrorMessage', {
          defaultMessage: 'Can\'t typecast "{string}" string to number',
          values: {
            string: n
          }
        }));
      }
      return {
        type: 'num',
        value
      };
    },
    '*': value => ({
      type: 'num',
      value: Number(value)
    })
  },
  to: {
    render: ({
      value
    }) => {
      const text = `${value}`;
      return {
        type: 'render',
        as: 'text',
        value: {
          text
        }
      };
    },
    datatable: ({
      value
    }) => ({
      type: 'datatable',
      columns: [{
        id: 'value',
        name: 'value',
        meta: {
          type: 'number'
        }
      }],
      rows: [{
        value
      }]
    })
  }
};
exports.num = num;