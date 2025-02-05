"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.variable = void 0;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const variable = {
  name: 'var',
  help: _i18n.i18n.translate('expressions.functions.var.help', {
    defaultMessage: 'Updates the Kibana global context.'
  }),
  args: {
    name: {
      types: ['string'],
      aliases: ['_'],
      required: true,
      help: _i18n.i18n.translate('expressions.functions.var.name.help', {
        defaultMessage: 'Specify the name of the variable.'
      })
    }
  },
  fn(input, args, context) {
    const {
      variables
    } = context;
    return variables[args.name];
  }
};
exports.variable = variable;