"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;
var _semver = require("semver");
var _i18n = require("@kbn/i18n");
var _lodash = require("lodash");
var _configSchema = require("@kbn/config-schema");
var _constants = require("../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const kibanaVersion = new _semver.SemVer(_constants.MAJOR_VERSION);

// -------------------------------
// >= 8.x
// -------------------------------
const schemaLatest = _configSchema.schema.object({
  ui: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: true
    })
  }),
  slm_ui: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: true
    })
  })
}, {
  defaultValue: undefined
});
const configLatest = {
  exposeToBrowser: {
    ui: true,
    slm_ui: true
  },
  schema: schemaLatest,
  deprecations: () => []
};
// -------------------------------
// 7.x
// -------------------------------
const schema7x = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean({
    defaultValue: true
  }),
  ui: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: true
    })
  }),
  slm_ui: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: true
    })
  })
}, {
  defaultValue: undefined
});
const config7x = {
  exposeToBrowser: {
    ui: true,
    slm_ui: true
  },
  schema: schema7x,
  deprecations: () => [(completeConfig, rootPath, addDeprecation) => {
    if ((0, _lodash.get)(completeConfig, 'xpack.snapshot_restore.enabled') === undefined) {
      return completeConfig;
    }
    addDeprecation({
      configPath: 'xpack.snapshot_restore.enabled',
      level: 'critical',
      title: _i18n.i18n.translate('xpack.snapshotRestore.deprecations.enabledTitle', {
        defaultMessage: 'Setting "xpack.snapshot_restore.enabled" is deprecated'
      }),
      message: _i18n.i18n.translate('xpack.snapshotRestore.deprecations.enabledMessage', {
        defaultMessage: 'To disallow users from accessing the Snapshot and Restore UI, use the "xpack.snapshot_restore.ui.enabled" setting instead of "xpack.snapshot_restore.enabled".'
      }),
      correctiveActions: {
        manualSteps: [_i18n.i18n.translate('xpack.snapshotRestore.deprecations.enabled.manualStepOneMessage', {
          defaultMessage: 'Open the kibana.yml config file.'
        }), _i18n.i18n.translate('xpack.snapshotRestore.deprecations.enabled.manualStepTwoMessage', {
          defaultMessage: 'Change the "xpack.snapshot_restore.enabled" setting to "xpack.snapshot_restore.ui.enabled".'
        })]
      }
    });
    return completeConfig;
  }]
};
const config = kibanaVersion.major < 8 ? config7x : configLatest;
exports.config = config;