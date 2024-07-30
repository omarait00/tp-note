"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  BASE_ACTION_API_PATH: true,
  INTERNAL_BASE_ACTION_API_PATH: true,
  ACTIONS_FEATURE_ID: true
};
exports.INTERNAL_BASE_ACTION_API_PATH = exports.BASE_ACTION_API_PATH = exports.ACTIONS_FEATURE_ID = void 0;
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
var _alert_history_schema = require("./alert_history_schema");
Object.keys(_alert_history_schema).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _alert_history_schema[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _alert_history_schema[key];
    }
  });
});
var _rewrite_request_case = require("./rewrite_request_case");
Object.keys(_rewrite_request_case).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _rewrite_request_case[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _rewrite_request_case[key];
    }
  });
});
var _mustache_template = require("./mustache_template");
Object.keys(_mustache_template).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _mustache_template[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _mustache_template[key];
    }
  });
});
var _validate_email_addresses = require("./validate_email_addresses");
Object.keys(_validate_email_addresses).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _validate_email_addresses[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _validate_email_addresses[key];
    }
  });
});
var _connector_feature_config = require("./connector_feature_config");
Object.keys(_connector_feature_config).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _connector_feature_config[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _connector_feature_config[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// TODO: https://github.com/elastic/kibana/issues/110895
/* eslint-disable @kbn/eslint/no_export_all */

const BASE_ACTION_API_PATH = '/api/actions';
exports.BASE_ACTION_API_PATH = BASE_ACTION_API_PATH;
const INTERNAL_BASE_ACTION_API_PATH = '/internal/actions';
exports.INTERNAL_BASE_ACTION_API_PATH = INTERNAL_BASE_ACTION_API_PATH;
const ACTIONS_FEATURE_ID = 'actions';
exports.ACTIONS_FEATURE_ID = ACTIONS_FEATURE_ID;