"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lte = lte;
var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function lte() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().lte;
  return {
    name: 'lte',
    type: 'boolean',
    inputTypes: ['number', 'string'],
    help,
    args: {
      value: {
        aliases: ['_'],
        types: ['number', 'string'],
        required: true,
        help: argHelp.value
      }
    },
    fn: (input, args) => {
      const {
        value
      } = args;
      if (typeof input !== typeof value) {
        return false;
      }
      return input <= value;
    }
  };
}