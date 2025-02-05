"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _i18n = require("@kbn/i18n");
var _alter = _interopRequireDefault(require("../lib/alter"));
var _chainable = _interopRequireDefault(require("../lib/classes/chainable"));
var _lodash = _interopRequireDefault(require("lodash"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function unflatten(data) {
  if (Object(data) !== data || Array.isArray(data)) return data;
  const regex = new RegExp(/\.?([^.\[\]]+)|\[(\d+)\]/g);
  const result = {};
  _lodash.default.each(data, function (val, p) {
    let cur = result;
    let prop = '';
    let m;
    while (m = regex.exec(p)) {
      cur = cur.hasOwnProperty(prop) && cur[prop] || (cur[prop] = m[2] ? [] : {});
      prop = m[2] || m[1];
    }
    cur[prop] = data[p];
  });
  return result[''] || result;
}
var _default = new _chainable.default('props', {
  args: [{
    name: 'inputSeries',
    types: ['seriesList']
  }, {
    name: 'global',
    types: ['boolean', 'null'],
    help: _i18n.i18n.translate('timelion.help.functions.props.args.globalHelpText', {
      defaultMessage: 'Set props on the seriesList vs on each series'
    })
  }],
  extended: {
    types: ['seriesList', 'number', 'string', 'boolean', 'null'],
    // Extended args can not currently be multivalued,
    // multi: false is not required and is shown here for demonstration purposes
    multi: false
  },
  // extended means you can pass arguments that aren't listed. They just won't be in the ordered array
  // They will be passed as args._extended:{}
  help: _i18n.i18n.translate('timelion.help.functions.propsHelpText', {
    defaultMessage: 'Use at your own risk, sets arbitrary properties on the series. For example {example}',
    values: {
      example: '.props(label=bears!)'
    }
  }),
  fn: function firstFn(args) {
    const properties = unflatten(_lodash.default.omit(args.byName, 'inputSeries', 'global'));
    if (args.byName.global) {
      _lodash.default.assign(args.byName.inputSeries, properties);
      return args.byName.inputSeries;
    } else {
      return (0, _alter.default)(args, function (eachSeries) {
        _lodash.default.assign(eachSeries, properties);
        return eachSeries;
      });
    }
  }
});
exports.default = _default;
module.exports = exports.default;