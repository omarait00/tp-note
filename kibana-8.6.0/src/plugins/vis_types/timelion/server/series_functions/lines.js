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
var _default = new _chainable.default('lines', {
  args: [{
    name: 'inputSeries',
    types: ['seriesList']
  }, {
    name: 'width',
    types: ['number', 'null'],
    help: _i18n.i18n.translate('timelion.help.functions.lines.args.widthHelpText', {
      defaultMessage: 'Line thickness'
    })
  }, {
    name: 'fill',
    types: ['number', 'null'],
    help: _i18n.i18n.translate('timelion.help.functions.lines.args.fillHelpText', {
      defaultMessage: 'Number between 0 and 10. Use for making area charts'
    })
  }, {
    name: 'stack',
    types: ['boolean', 'null'],
    help: _i18n.i18n.translate('timelion.help.functions.lines.args.stackHelpText', {
      defaultMessage: 'Stack lines, often misleading. At least use some fill if you use this.'
    })
  }, {
    name: 'show',
    types: ['number', 'boolean', 'null'],
    help: _i18n.i18n.translate('timelion.help.functions.lines.args.showHelpText', {
      defaultMessage: 'Show or hide lines'
    })
  }, {
    name: 'steps',
    types: ['number', 'boolean', 'null'],
    help: _i18n.i18n.translate('timelion.help.functions.lines.args.stepsHelpText', {
      defaultMessage: 'Show line as step, e.g., do not interpolate between points'
    })
  }],
  help: _i18n.i18n.translate('timelion.help.functions.linesHelpText', {
    defaultMessage: 'Show the seriesList as lines'
  }),
  fn: function linesFn(args) {
    return (0, _alter.default)(args, function (eachSeries, width, fill, stack, show, steps) {
      eachSeries.lines = eachSeries.lines || {};

      // Defaults
      if (eachSeries.lines.lineWidth == null) eachSeries.lines.lineWidth = 3;
      if (width != null) eachSeries.lines.lineWidth = width;
      if (fill != null) eachSeries.lines.fill = fill / 10;
      if (stack != null) eachSeries.stack = stack;
      if (show != null) eachSeries.lines.show = show;
      if (steps != null) eachSeries.lines.steps = steps;
      return eachSeries;
    });
  }
});
exports.default = _default;
module.exports = exports.default;