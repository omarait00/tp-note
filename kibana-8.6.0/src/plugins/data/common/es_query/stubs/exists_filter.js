"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.existsFilter = void 0;
var _esQuery = require("@kbn/es-query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const existsFilter = {
  meta: {
    index: 'logstash-*',
    negate: false,
    disabled: false,
    type: 'exists',
    key: 'machine.os',
    alias: null
  },
  $state: {
    store: _esQuery.FilterStateStore.APP_STATE
  },
  query: {}
};
exports.existsFilter = existsFilter;