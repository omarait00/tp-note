"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kqlFunction = void 0;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const kqlFunction = {
  name: 'kql',
  type: 'kibana_query',
  inputTypes: ['null'],
  help: _i18n.i18n.translate('data.search.functions.kql.help', {
    defaultMessage: 'Create kibana kql query'
  }),
  args: {
    q: {
      types: ['string'],
      required: true,
      aliases: ['query', '_'],
      help: _i18n.i18n.translate('data.search.functions.kql.q.help', {
        defaultMessage: 'Specify Kibana KQL free form text query'
      })
    }
  },
  fn(input, args) {
    return {
      type: 'kibana_query',
      language: 'kuery',
      query: args.q
    };
  }
};
exports.kqlFunction = kqlFunction;