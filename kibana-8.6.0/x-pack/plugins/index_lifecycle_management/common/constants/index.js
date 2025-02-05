"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MAJOR_VERSION = exports.API_BASE_PATH = void 0;
Object.defineProperty(exports, "MIN_PLUGIN_LICENSE", {
  enumerable: true,
  get: function () {
    return _license.MIN_PLUGIN_LICENSE;
  }
});
Object.defineProperty(exports, "MIN_SEARCHABLE_SNAPSHOT_LICENSE", {
  enumerable: true,
  get: function () {
    return _license.MIN_SEARCHABLE_SNAPSHOT_LICENSE;
  }
});
exports.PLUGIN = void 0;
Object.defineProperty(exports, "phaseToNodePreferenceMap", {
  enumerable: true,
  get: function () {
    return _data_tiers.phaseToNodePreferenceMap;
  }
});
var _i18n = require("@kbn/i18n");
var _data_tiers = require("./data_tiers");
var _license = require("./license");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const PLUGIN = {
  ID: 'index_lifecycle_management',
  minimumLicenseType: _license.MIN_PLUGIN_LICENSE,
  TITLE: _i18n.i18n.translate('xpack.indexLifecycleMgmt.appTitle', {
    defaultMessage: 'Index Lifecycle Policies'
  })
};
exports.PLUGIN = PLUGIN;
const MAJOR_VERSION = '8.0.0';
exports.MAJOR_VERSION = MAJOR_VERSION;
const API_BASE_PATH = '/api/index_lifecycle_management';
exports.API_BASE_PATH = API_BASE_PATH;