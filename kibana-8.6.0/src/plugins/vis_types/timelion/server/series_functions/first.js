"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _i18n = require("@kbn/i18n");
var _alter = _interopRequireDefault(require("../lib/alter"));
var _chainable = _interopRequireDefault(require("../lib/classes/chainable"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var _default = new _chainable.default('first', {
  args: [{
    name: 'inputSeries',
    types: ['seriesList']
  }],
  help: _i18n.i18n.translate('timelion.help.functions.firstHelpText', {
    defaultMessage: `This is an internal function that simply returns the input seriesList. Don't use this`
  }),
  fn: function firstFn(args) {
    return (0, _alter.default)(args, function (eachSeries) {
      return eachSeries;
    });
  }
});
exports.default = _default;
module.exports = exports.default;