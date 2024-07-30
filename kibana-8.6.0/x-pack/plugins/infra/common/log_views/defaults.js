"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultLogViewsStaticConfig = exports.defaultLogViewId = exports.defaultLogViewAttributes = void 0;
var _defaults = require("../source_configuration/defaults");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const defaultLogViewId = 'default';
exports.defaultLogViewId = defaultLogViewId;
const defaultLogViewAttributes = {
  name: 'Log View',
  description: 'A default log view',
  logIndices: {
    type: 'index_name',
    indexName: 'logs-*,filebeat-*'
  },
  logColumns: [{
    timestampColumn: {
      id: '5e7f964a-be8a-40d8-88d2-fbcfbdca0e2f'
    }
  }, {
    fieldColumn: {
      id: 'eb9777a8-fcd3-420e-ba7d-172fff6da7a2',
      field: 'event.dataset'
    }
  }, {
    messageColumn: {
      id: 'b645d6da-824b-4723-9a2a-e8cece1645c0'
    }
  }]
};
exports.defaultLogViewAttributes = defaultLogViewAttributes;
const defaultLogViewsStaticConfig = {
  messageFields: _defaults.defaultSourceConfiguration.fields.message
};
exports.defaultLogViewsStaticConfig = defaultLogViewsStaticConfig;