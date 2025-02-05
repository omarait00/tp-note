"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.variableSet = void 0;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const variableSet = {
  name: 'var_set',
  help: _i18n.i18n.translate('expressions.functions.varset.help', {
    defaultMessage: 'Updates the Kibana global context.'
  }),
  args: {
    name: {
      types: ['string'],
      aliases: ['_'],
      required: true,
      multi: true,
      help: _i18n.i18n.translate('expressions.functions.varset.name.help', {
        defaultMessage: 'Specify the name of the variable.'
      })
    },
    value: {
      aliases: ['val'],
      multi: true,
      help: _i18n.i18n.translate('expressions.functions.varset.val.help', {
        defaultMessage: 'Specify the value for the variable. When unspecified, the input context is used.'
      })
    }
  },
  fn(input, args, context) {
    const {
      variables
    } = context;
    args.name.forEach((name, i) => {
      var _args$value;
      variables[name] = ((_args$value = args.value) === null || _args$value === void 0 ? void 0 : _args$value[i]) === undefined ? input : args.value[i];
    });
    return input;
  }
};
exports.variableSet = variableSet;