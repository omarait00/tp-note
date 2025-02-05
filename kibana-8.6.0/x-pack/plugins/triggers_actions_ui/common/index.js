"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  BASE_TRIGGERS_ACTIONS_UI_API_PATH: true
};
exports.BASE_TRIGGERS_ACTIONS_UI_API_PATH = void 0;
var _data = require("./data");
Object.keys(_data).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _data[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _data[key];
    }
  });
});
var _parse_interval = require("./parse_interval");
Object.keys(_parse_interval).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _parse_interval[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _parse_interval[key];
    }
  });
});
var _experimental_features = require("./experimental_features");
Object.keys(_experimental_features).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _experimental_features[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _experimental_features[key];
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

const BASE_TRIGGERS_ACTIONS_UI_API_PATH = '/internal/triggers_actions_ui';
exports.BASE_TRIGGERS_ACTIONS_UI_API_PATH = BASE_TRIGGERS_ACTIONS_UI_API_PATH;