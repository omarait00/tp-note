"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rangeFunction = void 0;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const rangeFunction = {
  name: 'range',
  type: 'kibana_range',
  inputTypes: ['null'],
  help: _i18n.i18n.translate('data.search.functions.range.help', {
    defaultMessage: 'Create kibana range filter'
  }),
  args: {
    gt: {
      types: ['string', 'number'],
      help: _i18n.i18n.translate('data.search.functions.range.gt.help', {
        defaultMessage: 'Greater than'
      })
    },
    lt: {
      types: ['string', 'number'],
      help: _i18n.i18n.translate('data.search.functions.range.lt.help', {
        defaultMessage: 'Less than'
      })
    },
    gte: {
      types: ['string', 'number'],
      help: _i18n.i18n.translate('data.search.functions.range.gte.help', {
        defaultMessage: 'Greater or equal than'
      })
    },
    lte: {
      types: ['string', 'number'],
      help: _i18n.i18n.translate('data.search.functions.range.lte.help', {
        defaultMessage: 'Less or equal than'
      })
    }
  },
  fn(input, args) {
    if (args.lt === undefined && args.lte === undefined) {
      throw new Error('lt or lte must be provided');
    }
    if (args.gt === undefined && args.gte === undefined) {
      throw new Error('gt or gte must be provided');
    }
    return {
      type: 'kibana_range',
      ...args
    };
  }
};
exports.rangeFunction = rangeFunction;