"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PROFILING_SERVER_FEATURE_ID = exports.PROFILING_FEATURE = void 0;
var _i18n = require("@kbn/i18n");
var _server = require("../../../../src/core/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const PROFILING_SERVER_FEATURE_ID = 'profiling';
exports.PROFILING_SERVER_FEATURE_ID = PROFILING_SERVER_FEATURE_ID;
const PROFILING_FEATURE = {
  id: PROFILING_SERVER_FEATURE_ID,
  name: _i18n.i18n.translate('xpack.profiling.featureRegistry.profilingFeatureName', {
    defaultMessage: 'Universal Profiling'
  }),
  order: 1200,
  category: _server.DEFAULT_APP_CATEGORIES.observability,
  app: ['kibana'],
  catalogue: [],
  // see x-pack/plugins/features/common/feature_kibana_privileges.ts
  privileges: {
    all: {
      app: ['kibana'],
      catalogue: [],
      savedObject: {
        all: [],
        read: []
      },
      ui: ['show']
    },
    read: {
      app: ['kibana'],
      catalogue: [],
      savedObject: {
        all: [],
        read: []
      },
      ui: []
    }
  }
};
exports.PROFILING_FEATURE = PROFILING_FEATURE;