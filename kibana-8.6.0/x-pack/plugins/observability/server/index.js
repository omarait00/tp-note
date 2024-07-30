"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  config: true,
  plugin: true,
  createOrUpdateIndex: true,
  unwrapEsResponse: true,
  WrappedElasticsearchClientError: true,
  rangeQuery: true,
  kqlQuery: true,
  termQuery: true,
  termsQuery: true,
  getInspectResponse: true,
  uiSettings: true
};
Object.defineProperty(exports, "WrappedElasticsearchClientError", {
  enumerable: true,
  get: function () {
    return _unwrap_es_response.WrappedElasticsearchClientError;
  }
});
exports.config = void 0;
Object.defineProperty(exports, "createOrUpdateIndex", {
  enumerable: true,
  get: function () {
    return _create_or_update_index.createOrUpdateIndex;
  }
});
Object.defineProperty(exports, "getInspectResponse", {
  enumerable: true,
  get: function () {
    return _get_inspect_response.getInspectResponse;
  }
});
Object.defineProperty(exports, "kqlQuery", {
  enumerable: true,
  get: function () {
    return _queries.kqlQuery;
  }
});
exports.plugin = void 0;
Object.defineProperty(exports, "rangeQuery", {
  enumerable: true,
  get: function () {
    return _queries.rangeQuery;
  }
});
Object.defineProperty(exports, "termQuery", {
  enumerable: true,
  get: function () {
    return _queries.termQuery;
  }
});
Object.defineProperty(exports, "termsQuery", {
  enumerable: true,
  get: function () {
    return _queries.termsQuery;
  }
});
Object.defineProperty(exports, "uiSettings", {
  enumerable: true,
  get: function () {
    return _ui_settings.uiSettings;
  }
});
Object.defineProperty(exports, "unwrapEsResponse", {
  enumerable: true,
  get: function () {
    return _unwrap_es_response.unwrapEsResponse;
  }
});
var _configSchema = require("@kbn/config-schema");
var _plugin = require("./plugin");
var _create_or_update_index = require("./utils/create_or_update_index");
var _unwrap_es_response = require("../common/utils/unwrap_es_response");
var _queries = require("./utils/queries");
var _get_inspect_response = require("../common/utils/get_inspect_response");
var _types = require("./types");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
var _ui_settings = require("./ui_settings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// TODO: https://github.com/elastic/kibana/issues/110905
/* eslint-disable @kbn/eslint/no_export_all */

const configSchema = _configSchema.schema.object({
  annotations: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: true
    }),
    index: _configSchema.schema.string({
      defaultValue: 'observability-annotations'
    })
  }),
  unsafe: _configSchema.schema.object({
    slo: _configSchema.schema.object({
      enabled: _configSchema.schema.boolean({
        defaultValue: false
      })
    }),
    alertDetails: _configSchema.schema.object({
      apm: _configSchema.schema.object({
        enabled: _configSchema.schema.boolean({
          defaultValue: false
        })
      }),
      metrics: _configSchema.schema.object({
        enabled: _configSchema.schema.boolean({
          defaultValue: false
        })
      }),
      logs: _configSchema.schema.object({
        enabled: _configSchema.schema.boolean({
          defaultValue: false
        })
      }),
      uptime: _configSchema.schema.object({
        enabled: _configSchema.schema.boolean({
          defaultValue: false
        })
      })
    })
  })
});
const config = {
  exposeToBrowser: {
    unsafe: true
  },
  schema: configSchema
};
exports.config = config;
const plugin = initContext => new _plugin.ObservabilityPlugin(initContext);
exports.plugin = plugin;