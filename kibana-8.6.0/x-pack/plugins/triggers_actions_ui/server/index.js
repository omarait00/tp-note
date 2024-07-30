"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "CoreQueryParamsSchemaProperties", {
  enumerable: true,
  get: function () {
    return _data.CoreQueryParamsSchemaProperties;
  }
});
Object.defineProperty(exports, "DEFAULT_GROUPS", {
  enumerable: true,
  get: function () {
    return _data.DEFAULT_GROUPS;
  }
});
Object.defineProperty(exports, "MAX_GROUPS", {
  enumerable: true,
  get: function () {
    return _data.MAX_GROUPS;
  }
});
Object.defineProperty(exports, "MAX_INTERVALS", {
  enumerable: true,
  get: function () {
    return _data.MAX_INTERVALS;
  }
});
Object.defineProperty(exports, "TIME_SERIES_BUCKET_SELECTOR_FIELD", {
  enumerable: true,
  get: function () {
    return _data.TIME_SERIES_BUCKET_SELECTOR_FIELD;
  }
});
exports.plugin = exports.config = void 0;
Object.defineProperty(exports, "validateCoreQueryBody", {
  enumerable: true,
  get: function () {
    return _data.validateCoreQueryBody;
  }
});
Object.defineProperty(exports, "validateTimeWindowUnits", {
  enumerable: true,
  get: function () {
    return _data.validateTimeWindowUnits;
  }
});
var _config = require("./config");
var _plugin = require("./plugin");
var _data = require("./data");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const config = {
  exposeToBrowser: {
    enableGeoTrackingThresholdAlert: true,
    enableExperimental: true
  },
  schema: _config.configSchema
};
exports.config = config;
const plugin = ctx => new _plugin.TriggersActionsPlugin(ctx);
exports.plugin = plugin;